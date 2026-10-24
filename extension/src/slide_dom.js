// Google Slides has no public DOM contract, so everything here is best-effort and
// isolated in one place: the accessible HTML view (/htmlpresent) and the slideshow page
// (/present) for deck scanning, and the presentation viewer's URL, navbar, and
// accessibility markers for slide tracking.
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.MeetingTimer = root.MeetingTimer || {};
    root.MeetingTimer.slideDom = api;
  }
})(globalThis, function () {
  "use strict";

  const VIEWER_SELECTOR = ".punch-viewer-navbar, .punch-viewer-svgpage-a11yelement";
  const SPEAKER_NOTES_SELECTOR = "[class*='punch-viewer-speakernotes']";
  const NAVBAR_POSITION_SELECTOR = ".punch-viewer-navbar [aria-posinset]";
  const A11Y_LABEL_SELECTOR = ".punch-viewer-svgpage-a11yelement[aria-label]";
  const MAX_TITLE_LENGTH = 80;
  const DOC_DATA_SHOWN_FIELD = 12;

  function presentationIdFromUrl(url) {
    const match = /\/presentation\/(?:u\/\d+\/)?d\/([\w-]{20,})/.exec(url || "");
    return match ? match[1] : null;
  }

  function pageIdFromUrl(url) {
    const match = /[?#&]slide=id\.([\w-]+)/.exec(url || "");
    return match ? match[1] : null;
  }

  function parseSlideNumber(text) {
    const match = /\d+/.exec(text || "");
    return match ? Number(match[0]) : null;
  }

  function deckPageUrl(href, view) {
    const url = new URL(href);
    const authuser = url.searchParams.get("authuser");
    url.pathname = url.pathname.replace(/(\/d\/[\w-]+).*$/, `$1/${view}`);
    url.search = authuser ? `?authuser=${encodeURIComponent(authuser)}` : "";
    url.hash = "";
    return url.toString();
  }

  // Speaker-notes windows render slide previews too; only the audience viewer counts.
  function isViewerDocument(doc) {
    return Boolean(doc.querySelector(VIEWER_SELECTOR)) && !doc.querySelector(SPEAKER_NOTES_SELECTOR);
  }

  // The viewer numbers slides like the editor's filmstrip, counting skipped slides too.
  function currentSlideIndex(doc, url, pageIndex) {
    const pageId = pageIdFromUrl(url);
    if (pageId && pageIndex && pageIndex[pageId]) return pageIndex[pageId];

    const navbarPosition = doc.querySelector(NAVBAR_POSITION_SELECTOR);
    const position = navbarPosition ? Number(navbarPosition.getAttribute("aria-posinset")) : NaN;
    if (Number.isInteger(position) && position >= 1) return position;

    const a11yElement = doc.querySelector(A11Y_LABEL_SELECTOR);
    return a11yElement ? parseSlideNumber(a11yElement.getAttribute("aria-label")) : null;
  }

  function balancedArrayAt(text, start) {
    let depth = 0;
    let inString = false;
    for (let i = start; i < text.length; i++) {
      const char = text[i];
      if (inString) {
        if (char === "\\") i++;
        else if (char === '"') inString = false;
      } else if (char === '"') {
        inString = true;
      } else if (char === "[") {
        depth++;
      } else if (char === "]" && --depth === 0) {
        return text.slice(start, i + 1);
      }
    }
    throw new Error("Unterminated array");
  }

  // The slideshow page embeds `docData: [[w, h], [slide, ...], ...]` as JSON. Each slide entry
  // starts with its page ID, and field 12 is 1 for shown slides and 0 for skipped ones.
  function skippedPageIds(presentHtml) {
    const marker = presentHtml ? presentHtml.indexOf("docData:") : -1;
    if (marker < 0) return new Set();
    try {
      const docData = JSON.parse(balancedArrayAt(presentHtml, presentHtml.indexOf("[", marker)));
      return new Set(
        docData[1].filter((entry) => Array.isArray(entry) && entry[DOC_DATA_SHOWN_FIELD] === 0).map((entry) => entry[0]),
      );
    } catch {
      return new Set();
    }
  }

  // When the slideshow data can't be read, nothing is treated as hidden.
  function markHiddenSlides(slides, presentHtml) {
    const skipped = skippedPageIds(presentHtml);
    return slides.map((slide) => ({ ...slide, hidden: Boolean(slide.pageId) && skipped.has(slide.pageId) }));
  }

  function cleanText(text) {
    return String(text || "")
      .replace(/[\u0000-\u001f\u007f\u2028\u2029\ufffd]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function cssNumber(style, property) {
    const match = new RegExp(`(?:^|;)\\s*${property}\\s*:\\s*(-?[\\d.]+)`).exec(style || "");
    return match ? Number(match[1]) : 0;
  }

  function shapeFromParts(shapeStyle, paragraphs) {
    return {
      text: paragraphs.map((p) => p.text).join(" "),
      fontSize: Math.max(0, ...paragraphs.map((p) => cssNumber(p.style, "font-size"))),
      top: cssNumber(shapeStyle, "top"),
    };
  }

  // Titles are not marked in the HTML view, so the most prominent text wins: the largest
  // font, then the highest on the slide.
  function pickTitle(shapes) {
    const candidates = shapes
      .map((shape) => ({ ...shape, text: cleanText(shape.text) }))
      .filter((shape) => shape.text);
    candidates.sort((a, b) => b.fontSize - a.fontSize || a.top - b.top);
    const title = candidates.length ? candidates[0].text : "";
    return title.length > MAX_TITLE_LENGTH ? `${title.slice(0, MAX_TITLE_LENGTH - 1)}…` : title;
  }

  function parseHtmlPresent(doc) {
    const slides = [];
    for (const slideElement of doc.querySelectorAll("div.slide")) {
      const content = slideElement.querySelector(".slide-content");
      if (!content) continue;
      const pageMatch = /pageid=([\w-]+)/.exec(content.getAttribute("style") || "");
      const shapes = [...content.querySelectorAll(".shape")].map((shape) =>
        shapeFromParts(
          shape.getAttribute("style"),
          [...shape.querySelectorAll("p")].map((p) => ({ style: p.getAttribute("style"), text: p.textContent })),
        ),
      );
      slides.push({ index: slides.length + 1, pageId: pageMatch ? pageMatch[1] : null, title: pickTitle(shapes) });
    }
    const titleMeta = doc.querySelector('meta[property="og:title"]');
    return { title: titleMeta ? cleanText(titleMeta.getAttribute("content")) : "", slides };
  }

  // Runs in the Slides page, where same-origin cookies apply.
  async function fetchDeckPage(href, view) {
    const response = await fetch(deckPageUrl(href, view), { credentials: "include" });
    if (!response.ok) throw new Error(`Google Slides returned HTTP ${response.status} for /${view}.`);
    return response.text();
  }

  // Runs in the popup: Slides pages enforce Trusted Types, which rejects DOMParser input.
  function parseDeckHtml(html, presentHtml) {
    const deck = parseHtmlPresent(new DOMParser().parseFromString(html, "text/html"));
    if (!deck.slides.length) {
      throw new Error("No slides found in the HTML view; Google may have changed its markup. Add sections manually.");
    }
    return { ...deck, slides: markHiddenSlides(deck.slides, presentHtml) };
  }

  return {
    cleanText,
    currentSlideIndex,
    deckPageUrl,
    fetchDeckPage,
    isViewerDocument,
    markHiddenSlides,
    pageIdFromUrl,
    parseDeckHtml,
    parseHtmlPresent,
    parseSlideNumber,
    pickTitle,
    presentationIdFromUrl,
    shapeFromParts,
  };
});
