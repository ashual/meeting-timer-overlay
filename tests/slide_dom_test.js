const test = require("node:test");
const assert = require("node:assert/strict");

const slideDom = require("../extension/src/slide_dom.js");

const DECK_ID = "1EAYk18WDjIG-zp_0vLm3CsfQh_i8eXc67Jo2O9C6Vuc";

function fakeElement(attributes) {
  return { getAttribute: (name) => attributes[name] ?? null };
}

function fakeDocument(elementsBySelector) {
  return { querySelector: (selector) => elementsBySelector[selector] ?? null };
}

test("presentationIdFromUrl handles editor, viewer, and multi-account URLs", () => {
  assert.equal(slideDom.presentationIdFromUrl(`https://docs.google.com/presentation/d/${DECK_ID}/edit#slide=id.p`), DECK_ID);
  assert.equal(slideDom.presentationIdFromUrl(`https://docs.google.com/presentation/d/${DECK_ID}/present?slide=id.g1`), DECK_ID);
  assert.equal(slideDom.presentationIdFromUrl(`https://docs.google.com/presentation/u/1/d/${DECK_ID}/edit`), DECK_ID);
  assert.equal(slideDom.presentationIdFromUrl("https://docs.google.com/presentation/d/e/2PACX-1vQ/pub"), null);
  assert.equal(slideDom.presentationIdFromUrl("about:blank"), null);
  assert.equal(slideDom.presentationIdFromUrl(`https://docs.google.com/document/d/${DECK_ID}/edit`), null);
});

test("pageIdFromUrl reads the viewer query and the editor hash", () => {
  assert.equal(slideDom.pageIdFromUrl(`https://x/present?includes_info_params=1&slide=id.ge63a4b4_1_9`), "ge63a4b4_1_9");
  assert.equal(slideDom.pageIdFromUrl("https://x/edit#slide=id.p"), "p");
  assert.equal(slideDom.pageIdFromUrl("https://x/present"), null);
});

test("parseSlideNumber reads localized accessibility labels", () => {
  assert.equal(slideDom.parseSlideNumber("Slide 3 of 10: Roadmap"), 3);
  assert.equal(slideDom.parseSlideNumber("שקף 1 מתוך 5: "), 1);
  assert.equal(slideDom.parseSlideNumber(""), null);
  assert.equal(slideDom.parseSlideNumber(null), null);
});

test("deckPageUrl keeps the deck and account but drops the rest", () => {
  assert.equal(
    slideDom.deckPageUrl(`https://docs.google.com/presentation/d/${DECK_ID}/edit?authuser=1&usp=sharing#slide=id.p`, "htmlpresent"),
    `https://docs.google.com/presentation/d/${DECK_ID}/htmlpresent?authuser=1`,
  );
  assert.equal(
    slideDom.deckPageUrl(`https://docs.google.com/presentation/u/2/d/${DECK_ID}/edit`, "present"),
    `https://docs.google.com/presentation/u/2/d/${DECK_ID}/present`,
  );
});

// Captured from a real /present page of a 4-slide deck whose 3rd slide is skipped.
const SKIPPED_SLIDE_PRESENT_HTML =
  'viewerHmac: \'x\', docData: [[365760,205740],[["p",0,"",[],[],[],[],[[],false,1000],[],"",[],[],1,{},[]],' +
  '["h4bae1bf27f987c02_0_0",1,"Slide 2",[],[],[],[],[[],false,1000],[],"",[],[],1,{},[]],' +
  '["h4bae1bf27f987c02_0_5",2,"Slide 3 (skipped)",[],[],[],[],[[],false,1000],[],"",[],[],0,{},[]],' +
  '["h4bae1bf27f987c02_0_10",3,"Slide 4",[],[],[],[],[[],false,1000],[],"",[],[],1,{},[]]],' +
  '"\\u003cstyle\\u003e\\u003c/style\\u003e",[],null,[],null], start:  false , loop:  false';

test("markHiddenSlides flags skipped slides from the slideshow's docData", () => {
  const slides = ["p", "h4bae1bf27f987c02_0_0", "h4bae1bf27f987c02_0_5", "h4bae1bf27f987c02_0_10", null].map(
    (pageId, i) => ({ index: i + 1, pageId }),
  );
  assert.deepEqual(
    slideDom.markHiddenSlides(slides, SKIPPED_SLIDE_PRESENT_HTML).map((s) => s.hidden),
    [false, false, true, false, false],
  );
});

test("markHiddenSlides hides nothing when the slideshow data is unreadable", () => {
  const slides = [{ index: 1, pageId: "p" }, { index: 2, pageId: "h4bae1bf27f987c02_0_5" }];
  for (const presentHtml of [null, "<html>no viewer data</html>", SKIPPED_SLIDE_PRESENT_HTML.slice(0, 200)]) {
    assert.deepEqual(slideDom.markHiddenSlides(slides, presentHtml).map((s) => s.hidden), [false, false]);
  }
});

test("pickTitle prefers the largest text, then the highest, and cleans it", () => {
  const shape = (text, fontSize, top) => ({ text, fontSize, top });
  assert.equal(slideDom.pickTitle([shape("Body", 14, 10), shape("Noah \u000b Analytics", 36, 200)]), "Noah Analytics");
  assert.equal(slideDom.pickTitle([shape("Lower", 24, 300), shape("Upper", 24, 40)]), "Upper");
  assert.equal(slideDom.pickTitle([shape("   ", 40, 0), shape("Only text", 12, 0)]), "Only text");
  assert.equal(slideDom.pickTitle([]), "");
  assert.equal(slideDom.pickTitle([shape("x".repeat(120), 20, 0)]).length, 80);
});

test("shapeFromParts reads font sizes and positions from inline styles", () => {
  const shape = slideDom.shapeFromParts("width:579px; height:83px; top:528px; left:293px", [
    { style: "font-weight:400;font-size:48.0pt;text-align:center;", text: "{Name Here}" },
    { style: "font-size:20.0pt;", text: "Baby Album" },
  ]);
  assert.deepEqual(shape, { text: "{Name Here} Baby Album", fontSize: 48, top: 528 });
});

test("isViewerDocument accepts the audience viewer but not speaker notes", () => {
  const navbar = fakeElement({});
  const viewerSelector = ".punch-viewer-navbar, .punch-viewer-svgpage-a11yelement";
  assert.equal(slideDom.isViewerDocument(fakeDocument({ [viewerSelector]: navbar })), true);
  assert.equal(slideDom.isViewerDocument(fakeDocument({})), false);
  assert.equal(
    slideDom.isViewerDocument(
      fakeDocument({ [viewerSelector]: navbar, "[class*='punch-viewer-speakernotes']": fakeElement({}) }),
    ),
    false,
  );
});

test("currentSlideIndex prefers page IDs, then the navbar, then accessibility labels", () => {
  const navbar = fakeElement({ "aria-posinset": "4" });
  const a11y = fakeElement({ "aria-label": "Slide 6 of 9: Lena" });
  const doc = fakeDocument({
    ".punch-viewer-navbar [aria-posinset]": navbar,
    ".punch-viewer-svgpage-a11yelement[aria-label]": a11y,
  });
  const url = "https://x/present?slide=id.g2";

  assert.equal(slideDom.currentSlideIndex(doc, url, { g2: 7 }), 7);
  assert.equal(slideDom.currentSlideIndex(doc, url, { other: 1 }), 4);
  assert.equal(
    slideDom.currentSlideIndex(fakeDocument({ ".punch-viewer-svgpage-a11yelement[aria-label]": a11y }), url, {}),
    6,
  );
  assert.equal(slideDom.currentSlideIndex(fakeDocument({}), url, {}), null);
});

test("currentSlideIndex keeps the deck numbering after a skipped slide", () => {
  const a11y = fakeElement({ "aria-label": "Slide 4 of 4: Slide 4" });
  const doc = fakeDocument({ ".punch-viewer-svgpage-a11yelement[aria-label]": a11y });
  assert.equal(slideDom.currentSlideIndex(doc, "https://x/present", {}), 4);
});
