(function () {
  "use strict";

  const { schedule, Overlay } = globalThis.MeetingTimer;
  const MINUTE = 60 * 1000;
  const NAMES = ["Maya", "Noah", "Lena", "Omar", "Sofia"];
  const scene = new URLSearchParams(location.search).get("scene") || "overlay";

  const SLIDES = {
    Noah: {
      accent: "#2563eb",
      kicker: "Weekly team update",
      title: "Noah",
      subtitle: "Search: faster results page",
      bullets: ["Shipped result caching to 50% of users", "p95 latency down from 820 ms to 410 ms", "Next: roll out to everyone on Monday"],
      chart: [62, 58, 55, 41, 33, 30],
    },
    Lena: {
      accent: "#7c3aed",
      kicker: "Weekly team update",
      title: "Lena",
      subtitle: "Onboarding: new sign-up flow",
      bullets: ["Usability tests with 8 customers", "Drop-off on step 2 fixed", "Design review on Thursday"],
      chart: [30, 38, 44, 51, 57, 66],
    },
    Omar: {
      accent: "#ea580c",
      kicker: "Weekly team update",
      title: "Omar",
      subtitle: "Infrastructure: database migration",
      bullets: ["Replica cut-over rehearsal done", "Two runbooks updated", "Need a reviewer for the rollback plan"],
      chart: [80, 74, 69, 52, 48, 40],
    },
  };

  // A 30-minute meeting with five speakers, at the moment each scene depicts.
  function sessionAt(position, turnStartedMinutesAgo, minutesLeftInMeeting) {
    const now = Date.now();
    const endMs = now + minutesLeftInMeeting * MINUTE;
    let session = schedule.createSession({
      presentationId: "demo",
      deckTitle: "Weekly team update",
      sections: NAMES.map((label, i) => ({ index: 2 + i * 2, label })),
      pageIndex: {},
      startMs: endMs - 30 * MINUTE,
      endMs,
      now: endMs - 31 * MINUTE,
    });
    for (let i = 0; i <= position; i++) {
      const startedAgo = i === position ? turnStartedMinutesAgo : turnStartedMinutesAgo + (position - i) * 5;
      session = schedule.startTurn(session, i, now - startedAgo * MINUTE);
    }
    return schedule.view(session, now);
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function slide(content) {
    const root = el("div", "slide");
    root.style.setProperty("--accent", content.accent);
    root.append(el("div", "slide-band"));
    const body = el("div", "slide-body");
    const list = el("ul");
    for (const bullet of content.bullets) list.append(el("li", "", bullet));
    body.append(el("p", "kicker", content.kicker), el("h1", "", content.title), el("p", "subtitle", content.subtitle), list);
    const chart = el("div", "chart");
    for (const height of content.chart) {
      const bar = el("span");
      bar.style.height = `${height}%`;
      chart.append(bar);
    }
    root.append(body, chart);
    return root;
  }

  function showOverlay(container, view, { compact }) {
    const overlay = new Overlay(document);
    overlay.mount();
    container.append(overlay.host);
    if (!compact) overlay.wake = () => {};
    overlay.render(view, false);
    return overlay;
  }

  function slideshow(name, view, caption, options) {
    const screen = el("div", "screen");
    const frame = el("div", "slide-frame");
    frame.append(slide(SLIDES[name]));
    screen.append(frame, el("p", "caption", caption));
    document.body.append(screen);
    showOverlay(frame, view, options);
  }

  async function setup() {
    const root = el("div", "setup");
    const copy = el("div", "setup-copy");
    const steps = el("ol");
    for (const step of [
      "Scan your deck. Hidden slides are left out.",
      "Tick the slide where each person starts and set the meeting's start time and duration.",
      "Present as usual. The timer follows your slides.",
    ]) {
      steps.append(el("li", "", step));
    }
    copy.append(el("h1", "", "Set up in under a minute"), steps);
    const frame = el("iframe", "popup-frame");
    frame.width = "380";
    root.append(copy, frame);
    document.body.append(root);

    const popupUrl = new URL("../../extension/popup/popup.html", location.href);
    const html = await (await fetch(popupUrl)).text();
    const stub = `<base href="${new URL(".", popupUrl)}"><script>(${popupStub})(${JSON.stringify(deckForPopup())})<\/script>`;
    frame.srcdoc = html.replace("<head>", `<head>${stub}`);
    await new Promise((resolve) => frame.addEventListener("load", resolve, { once: true }));
    await new Promise((resolve) => setTimeout(resolve, 300));
    const doc = frame.contentDocument;
    doc.getElementById("scan-status").textContent =
      "Found 11 slides (1 hidden left out). Tick where each section starts and edit names as needed.";
    frame.height = String(doc.documentElement.scrollHeight);
    frame.style.transform = `scale(${Math.min(1.25, 740 / doc.documentElement.scrollHeight)})`;
  }

  function deckForPopup() {
    const titles = ["Weekly team update", "Maya", "Maya: details", "Noah", "Noah: latency", "Lena", "Lena: research", "Omar", "Omar: migration", "Sofia", "Wrap-up"];
    const now = new Date();
    const start = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    return {
      title: "Weekly team update",
      start,
      durationMinutes: 30,
      slides: titles.map((title, i) => ({
        index: i < 2 ? i + 1 : i + 2,
        pageId: `p${i}`,
        title,
        label: title,
        selected: NAMES.includes(title),
      })),
    };
  }

  // Runs inside the popup frame in place of the extension APIs.
  function popupStub(deck) {
    const store = { "deck:demo": deck };
    window.chrome = {
      tabs: {
        query: async () => [{ id: 1 }],
        sendMessage: async (_tab, message) =>
          message.type === "hello" ? { presentationId: "demo", title: deck.title } : null,
      },
      storage: {
        local: {
          get: async (key) => ({ [key]: store[key] }),
          set: async (items) => Object.assign(store, items),
          remove: async (key) => delete store[key],
        },
        onChanged: { addListener() {} },
      },
    };
  }

  function promoSmall() {
    const root = el("div", "promo promo-small");
    const icon = el("img");
    icon.src = "../../extension/icons/icon128.png";
    const copy = el("div");
    copy.append(el("h1", "", "Meeting Timer Overlay"), el("p", "", "Fair, calm turns for Google Slides meetings"));
    root.append(icon, copy);
    document.body.append(root);
  }

  function promoMarquee() {
    const root = el("div", "promo promo-marquee");
    const copy = el("div", "promo-copy");
    const brand = el("div", "brand");
    const icon = el("img");
    icon.src = "../../extension/icons/icon128.png";
    brand.append(icon, el("span", "", "Meeting Timer Overlay"));
    copy.append(
      brand,
      el("h1", "", "Everyone gets their turn"),
      el("p", "", "A calm countdown and speaker queue on top of your Google Slides. The time left is split evenly at every handoff."),
    );
    const mini = el("div", "screen-mini");
    mini.append(slide(SLIDES.Noah));
    const holder = el("div", "overlay-holder");
    mini.append(holder);
    root.append(copy, mini);
    document.body.append(root);
    showOverlay(holder, sessionAt(1, 1, 19), { compact: false });
  }

  const scenes = {
    overlay: () =>
      slideshow("Noah", sessionAt(1, 1, 19), "Each speaker gets an equal share of the time that's left", { compact: false }),
    compact: () =>
      slideshow("Lena", sessionAt(2, 0.5, 19.5), "After a few quiet seconds it shrinks out of the way", { compact: true }),
    wrapup: () =>
      slideshow("Omar", sessionAt(3, 8, 4), "When a turn runs out it turns a calm amber, never red", { compact: false }),
    setup,
    "promo-small": promoSmall,
    "promo-marquee": promoMarquee,
  };
  scenes[scene]();
})();
