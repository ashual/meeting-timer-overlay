(function () {
  "use strict";

  const MT = globalThis.MeetingTimer;
  if (!MT || MT.contentLoaded) return;
  MT.contentLoaded = true;

  const { schedule, slideDom, Overlay } = MT;
  const TICK_MS = 500;

  const presentationId = slideDom.presentationIdFromUrl(location.href);
  if (!presentationId && !createdBySlides()) return;

  let session = null;
  let sessionKey = null;
  let lastSlide = null;
  let overlay = null;

  if (window === window.top && presentationId) {
    chrome.runtime.onMessage.addListener(handleMessage);
  }
  chrome.storage.onChanged.addListener(onStorageChanged);
  chrome.storage.local.get("session").then(({ session: stored }) => applySession(stored));
  const timer = setInterval(tick, TICK_MS);

  // about:blank frames and popups have no URL of their own; they belong to the active session
  // only when a Slides page created them.
  function createdBySlides() {
    for (const related of [window.parent, window.top, window.opener]) {
      try {
        if (related && related !== window && slideDom.presentationIdFromUrl(related.location.href)) return true;
      } catch {
        // Cross-origin relatives cannot be inspected.
      }
    }
    return false;
  }

  function handleMessage(message, _sender, sendResponse) {
    if (message?.type === "hello") {
      sendResponse({ presentationId, title: document.title.replace(/\s+-\s+Google[^-]*$/, "") });
      return false;
    }
    if (message?.type === "scan") {
      Promise.all([
        slideDom.fetchDeckPage(location.href, "htmlpresent"),
        slideDom.fetchDeckPage(location.href, "present").catch(() => null),
      ]).then(
        ([html, presentHtml]) => sendResponse({ ok: true, html, presentHtml }),
        (error) => sendResponse({ ok: false, error: error.message }),
      );
      return true;
    }
    return false;
  }

  function onStorageChanged(changes, area) {
    if (area === "local" && "session" in changes) applySession(changes.session.newValue);
  }

  function applySession(next) {
    session = next && (!presentationId || next.presentationId === presentationId) ? next : null;
    const key = session ? session.startedAt : null;
    if (key !== sessionKey) {
      sessionKey = key;
      lastSlide = null;
    }
    tick();
  }

  function tick() {
    if (!chrome.runtime?.id) {
      shutdown();
      return;
    }
    if (!session || !slideDom.isViewerDocument(document)) {
      removeOverlay();
      return;
    }
    overlay = overlay || new Overlay(document);
    const slide = slideDom.currentSlideIndex(document, location.href, session.pageIndex);
    if (slide && slide !== lastSlide) {
      lastSlide = slide;
      overlay.wake();
      advanceTo(slide).catch(shutdownIfInvalidated);
    }
    overlay.mount();
    overlay.render(schedule.view(session, Date.now()), session.hidden);
  }

  async function advanceTo(slide) {
    const position = schedule.sectionPositionForSlide(session.sections, slide);
    if (position <= session.position) return;
    const { session: latest } = await chrome.storage.local.get("session");
    if (!latest || latest.startedAt !== sessionKey) return;
    const next = schedule.startTurn(latest, position, Date.now());
    if (next !== latest) await chrome.storage.local.set({ session: next });
  }

  function removeOverlay() {
    if (overlay) overlay.destroy();
    overlay = null;
  }

  // After the extension is reloaded or updated, this orphaned script loses chrome.* access.
  function shutdownIfInvalidated() {
    if (!chrome.runtime?.id) shutdown();
  }

  function shutdown() {
    clearInterval(timer);
    removeOverlay();
  }
})();
