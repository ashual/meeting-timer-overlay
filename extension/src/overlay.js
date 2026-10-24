(function (root) {
  "use strict";

  const SVG_NS = "http://www.w3.org/2000/svg";
  const RING_RADIUS = 15;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;
  const MIN_ROW_PX = 22;
  const MAX_ROW_PX = 34;
  const TARGET_HEIGHT_RATIO = 0.52;
  const COMPACT_AFTER_MS = 5000;

  // The host lives in Google's DOM, so it resets inherited styles and never takes input:
  // clicks and keys must keep reaching the slides.
  const HOST_STYLE =
    "all: initial; position: fixed; top: 16px; right: 16px; z-index: 2147483647; pointer-events: none;";

  const STYLE = `
    .card {
      --text: #eef3f9;
      --muted: rgba(238, 243, 249, 0.66);
      --accent: #2dd4bf;
      --warm: #f6c177;
      --surface: rgba(8, 18, 32, 0.6);
      --row-h: 30px;
      --ring: clamp(28px, 2.3vw, 38px);
      --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
      box-sizing: border-box;
      width: clamp(190px, 13vw, 240px);
      max-height: 86vh;
      padding: 12px 10px 10px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 14px;
      /* See-through, yet the backdrop is blurred and darkened enough that light text reads on
         white, black, or busy slides alike. */
      background: linear-gradient(180deg, rgba(18, 36, 61, 0.42), rgba(11, 24, 42, 0.5));
      box-shadow: 0 10px 28px rgba(3, 10, 22, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(16px) saturate(150%) brightness(0.6);
      color: var(--text);
      text-shadow: 0 1px 2px rgba(3, 10, 22, 0.55);
      font: 500 13px/1.25 "Google Sans", "Segoe UI", Roboto, system-ui, sans-serif;
      opacity: 0;
      transform: translateX(14px) scale(0.98);
      transition: opacity 420ms ease, transform 520ms var(--ease), width 560ms var(--ease);
    }
    .card.shown { opacity: 1; transform: none; }
    .card.shown.hidden { opacity: 0; transform: translateX(14px) scale(0.98); }

    .head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      margin-bottom: 6px;
      padding: 0 4px 10px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.14);
      transition: gap 560ms var(--ease);
    }
    .clock {
      flex: 1;
      min-width: 0;
      max-height: 80px;
      overflow: hidden;
      white-space: nowrap;
      transition: opacity 260ms ease, max-height 560ms var(--ease);
    }
    .time { display: flex; align-items: baseline; gap: 5px; white-space: nowrap; }
    .big {
      display: inline-block;
      font-size: clamp(24px, 2.1vw, 34px);
      font-weight: 600;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
      transition: color 600ms ease;
    }
    .big.tick { animation: tick 380ms ease; }
    .unit { font-size: clamp(11px, 0.8vw, 14px); color: var(--muted); }
    .caption { margin-top: 2px; font-size: clamp(10.5px, 0.72vw, 12.5px); color: var(--muted); }
    .card[data-phase="wrapup"] .big { color: var(--warm); }

    .dial-wrap { flex: none; display: flex; flex-direction: column; align-items: center; }
    .dial {
      position: relative;
      width: var(--ring);
      height: var(--ring);
      transition: width 560ms var(--ease), height 560ms var(--ease);
    }
    .ring { display: block; width: 100%; height: 100%; transform: rotate(-90deg); }
    .dial-text {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 1;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 220ms ease;
    }
    .dial-value {
      display: inline-block;
      font-size: calc(var(--ring) * 0.36);
      font-weight: 600;
      letter-spacing: -0.02em;
      font-variant-numeric: tabular-nums;
      transition: color 600ms ease;
    }
    .dial-value.tick { animation: tick 380ms ease; }
    .dial-unit { margin-top: 1px; font-size: calc(var(--ring) * 0.2); color: var(--muted); }
    .card[data-phase="wrapup"] .dial-value { color: var(--warm); }
    .dial-caption {
      max-height: 0;
      margin-top: 0;
      overflow: hidden;
      white-space: nowrap;
      font-size: clamp(10.5px, 0.72vw, 12.5px);
      color: var(--muted);
      opacity: 0;
      transition: opacity 220ms ease, max-height 560ms var(--ease), margin-top 560ms var(--ease);
    }
    .ring circle { fill: none; stroke-width: 3.2; }
    .track { stroke: rgba(255, 255, 255, 0.18); }
    .arc {
      stroke: var(--accent);
      stroke-linecap: round;
      stroke-dasharray: ${RING_CIRCUMFERENCE};
      filter: drop-shadow(0 0 3px rgba(45, 212, 191, 0.45));
      transition: stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 600ms ease;
    }
    .card[data-phase="wrapup"] .arc { stroke: var(--warm); filter: drop-shadow(0 0 3px rgba(246, 193, 119, 0.45)); }
    .card[data-phase="done"] .arc { stroke: rgba(238, 243, 249, 0.4); filter: none; }

    .list { position: relative; }
    .list::before {
      content: "";
      position: absolute;
      left: 15px;
      top: calc(var(--row-h) / 2);
      bottom: calc(var(--row-h) / 2);
      width: 1px;
      background: rgba(255, 255, 255, 0.2);
      transition: left 560ms var(--ease);
    }
    .pill {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: var(--row-h);
      border-radius: 9px;
      background: linear-gradient(90deg, rgba(20, 184, 166, 0.95), rgba(13, 148, 136, 0.9));
      box-shadow: 0 0 0 1px rgba(94, 234, 212, 0.35), 0 4px 16px rgba(20, 184, 166, 0.35);
      opacity: 0;
      transition: transform 520ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity 300ms ease;
    }
    .pill.on { opacity: 1; }
    .card[data-phase="wrapup"] .pill {
      background: linear-gradient(90deg, rgba(217, 140, 50, 0.92), rgba(190, 118, 38, 0.9));
      box-shadow: 0 0 0 1px rgba(246, 193, 119, 0.35), 0 4px 16px rgba(217, 140, 50, 0.3);
    }

    ol { margin: 0; padding: 0; list-style: none; }
    .row {
      position: relative;
      display: flex;
      align-items: center;
      gap: 8px;
      height: var(--row-h);
      padding: 0 8px;
      font-size: clamp(12px, calc(var(--row-h) * 0.42), 15px);
      transition: color 300ms ease, padding 560ms var(--ease), gap 560ms var(--ease);
    }
    .row[data-state="done"] { color: var(--muted); }
    .row[data-state="current"] { color: #fff; font-weight: 600; }

    /* One SVG for ring, dot, and check: separate boxes snap to pixels independently and the
       dot drifts off-center at fractional row positions. */
    .mark { flex: none; width: 14px; height: 14px; overflow: visible; }
    .mark-ring {
      fill: var(--surface);
      stroke: rgba(238, 243, 249, 0.7);
      stroke-width: 1.5;
      transition: stroke 300ms ease, fill 300ms ease;
    }
    .mark-dot,
    .check {
      transform-box: fill-box;
      transform-origin: center;
    }
    .mark-dot {
      fill: #fff;
      transform: scale(0);
      transition: transform 320ms cubic-bezier(0.3, 1.5, 0.5, 1);
    }
    .row[data-state="done"] .mark-ring { stroke: rgba(238, 243, 249, 0.5); }
    .row[data-state="current"] .mark-ring { stroke: #fff; fill: transparent; }
    .row[data-state="current"] .mark-dot { transform: scale(1); }
    .check {
      fill: none;
      stroke: currentColor;
      stroke-width: 1.7;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0;
      transform: scale(0.4);
      transition: opacity 250ms ease, transform 360ms cubic-bezier(0.3, 1.6, 0.5, 1);
    }
    .row[data-state="done"] .check { opacity: 1; transform: none; }

    .label {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      text-align: left;
      transition: opacity 260ms ease;
    }
    .arrow {
      flex: none;
      width: 12px;
      height: 12px;
      fill: none;
      stroke: #fff;
      stroke-width: 1.6;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0;
      transform: translateX(-4px);
      transition: opacity 300ms ease, transform 420ms var(--ease), width 560ms var(--ease);
    }
    .row[data-state="current"] .arrow { opacity: 1; transform: none; }

    /* After a quiet spell the card keeps only the ring (with the minutes inside), the sections
       left, and the section circles. Row heights stay put, so the circles don't move. */
    .card.compact { --ring: clamp(44px, 3vw, 54px); width: calc(var(--ring) + 30px); }
    .card.compact .head { gap: 0; }
    .card.compact .clock { flex: 0 0 0; opacity: 0; max-height: 0; }
    .card.compact .dial-text { opacity: 1; transition-delay: 240ms; }
    .card.compact .dial-caption { max-height: 20px; margin-top: 6px; opacity: 1; transition-delay: 240ms, 0ms, 0ms; }
    .card.compact .list::before { left: calc(50% - 0.5px); }
    .card.compact .row { gap: 0; padding: 0 calc((var(--ring) - 6px) / 2); }
    .card.compact .label { flex: 0 0 0; opacity: 0; }
    .card.compact .arrow { width: 0; opacity: 0; }

    @keyframes tick {
      from { opacity: 0.15; transform: translateY(3px); }
      to { opacity: 1; transform: none; }
    }

    @media (prefers-reduced-motion: reduce) {
      .card, .card *, .card *::after { transition: none !important; animation: none !important; }
    }
  `;

  function element(doc, tag, className) {
    const node = doc.createElement(tag);
    if (className) node.className = className;
    return node;
  }

  function svgElement(doc, tag, attributes) {
    const node = doc.createElementNS(SVG_NS, tag);
    for (const [name, value] of Object.entries(attributes)) node.setAttribute(name, value);
    return node;
  }

  function icon(doc, className, pathData) {
    const svg = svgElement(doc, "svg", { class: className, viewBox: "0 0 12 12", "aria-hidden": "true" });
    svg.append(svgElement(doc, "path", { d: pathData }));
    return svg;
  }

  function setText(node, text) {
    if (node.textContent !== text) node.textContent = text;
  }

  class Overlay {
    constructor(doc) {
      this.doc = doc;
      this.host = element(doc, "div");
      this.host.setAttribute("style", HOST_STYLE);
      // Closed and built without innerHTML: Slides enforces Trusted Types.
      const shadow = this.host.attachShadow({ mode: "closed" });
      const style = element(doc, "style");
      style.textContent = STYLE;

      this.card = element(doc, "div", "card");
      this.card.setAttribute("aria-hidden", "true");

      this.head = element(doc, "div", "head");
      const clock = element(doc, "div", "clock");
      const time = element(doc, "div", "time");
      this.big = element(doc, "span", "big");
      this.unit = element(doc, "span", "unit");
      this.caption = element(doc, "div", "caption");
      time.append(this.big, this.unit);
      clock.append(time, this.caption);

      const ring = svgElement(doc, "svg", { class: "ring", viewBox: "0 0 36 36" });
      const circle = { cx: "18", cy: "18", r: String(RING_RADIUS) };
      this.arc = svgElement(doc, "circle", { ...circle, class: "arc" });
      this.arc.style.strokeDashoffset = String(RING_CIRCUMFERENCE);
      ring.append(svgElement(doc, "circle", { ...circle, class: "track" }), this.arc);

      const dialText = element(doc, "div", "dial-text");
      this.dialValue = element(doc, "span", "dial-value");
      this.dialUnit = element(doc, "span", "dial-unit");
      dialText.append(this.dialValue, this.dialUnit);
      const dial = element(doc, "div", "dial");
      dial.append(ring, dialText);
      this.dialCaption = element(doc, "div", "dial-caption");
      const dialWrap = element(doc, "div", "dial-wrap");
      dialWrap.append(dial, this.dialCaption);
      this.head.append(clock, dialWrap);

      const list = element(doc, "div", "list");
      this.pill = element(doc, "div", "pill");
      this.listItems = element(doc, "ol");
      list.append(this.pill, this.listItems);

      this.card.append(this.head, list);
      shadow.append(style, this.card);

      this.rows = [];
      this.signature = null;
      this.lastBig = null;
      this.pillY = null;
      this.revealScheduled = false;
      this.currentIndex = null;
      this.headHeight = 0;
      this.compactTimer = null;

      this.onFullscreenChange = () => this.mount();
      this.onResize = () => this.layout();
      doc.addEventListener("fullscreenchange", this.onFullscreenChange);
      doc.defaultView.addEventListener("resize", this.onResize);
    }

    // A fullscreen element creates its own top layer; anything outside it is invisible.
    mount() {
      const fullscreen = this.doc.fullscreenElement;
      const parent = fullscreen && fullscreen.tagName !== "IFRAME" ? fullscreen : this.doc.documentElement;
      if (this.host.parentNode !== parent) parent.appendChild(this.host);
      if (!this.revealScheduled) {
        this.revealScheduled = true;
        const win = this.doc.defaultView;
        win.requestAnimationFrame(() => win.requestAnimationFrame(() => this.card.classList.add("shown")));
      }
    }

    render(view, hidden) {
      this.card.dataset.phase = view.phase;
      this.card.classList.toggle("hidden", Boolean(hidden));

      if (view.big !== this.lastBig) {
        this.big.textContent = view.big;
        if (this.lastBig !== null) this.replay(this.big, "tick");
        this.lastBig = view.big;
      }
      setText(this.unit, view.unit);
      setText(this.caption, view.caption);
      if (view.compact.value !== this.dialValue.textContent) {
        const changed = this.dialValue.textContent !== "";
        this.dialValue.textContent = view.compact.value;
        if (changed) this.replay(this.dialValue, "tick");
      }
      setText(this.dialUnit, view.compact.unit);
      setText(this.dialCaption, view.compact.caption);
      const offset = String(RING_CIRCUMFERENCE * (1 - view.progress));
      if (this.arc.style.strokeDashoffset !== offset) this.arc.style.strokeDashoffset = offset;

      const signature = view.items.map((item) => item.label).join("\u0000");
      if (signature !== this.signature) {
        this.signature = signature;
        this.buildRows(view.items);
        this.layout();
      }
      view.items.forEach((item, i) => {
        if (this.rows[i].dataset.state !== item.state) this.rows[i].dataset.state = item.state;
      });
      this.placePill();

      const currentIndex = view.items.findIndex((item) => item.state === "current");
      if (currentIndex !== this.currentIndex) {
        this.currentIndex = currentIndex;
        this.wake();
      }
    }

    // Shows the full card, then shrinks it to circles once nothing has changed for a while.
    wake() {
      this.card.classList.remove("compact");
      const win = this.doc.defaultView;
      win.clearTimeout(this.compactTimer);
      this.compactTimer = win.setTimeout(() => this.card.classList.add("compact"), COMPACT_AFTER_MS);
    }

    buildRows(items) {
      this.rows = items.map((item) => {
        const row = element(this.doc, "li", "row");
        const mark = svgElement(this.doc, "svg", { class: "mark", viewBox: "0 0 14 14", "aria-hidden": "true" });
        mark.append(
          svgElement(this.doc, "circle", { class: "mark-ring", cx: "7", cy: "7", r: "6.25" }),
          svgElement(this.doc, "circle", { class: "mark-dot", cx: "7", cy: "7", r: "3" }),
          svgElement(this.doc, "path", { class: "check", d: "M4 7.2l2 2 4-4.4" }),
        );
        const label = element(this.doc, "span", "label");
        label.dir = "auto";
        label.textContent = item.label;
        row.append(mark, label, icon(this.doc, "arrow", "M2 6h8M7 3l3 3-3 3"));
        return row;
      });
      this.listItems.replaceChildren(...this.rows);
      this.pillY = null;
    }

    // Rows shrink to keep the card near half the screen height; with many sections the card
    // grows instead of hiding anyone. The compact header is shorter, so the full one is remembered.
    layout() {
      if (!this.card.classList.contains("compact")) this.headHeight = this.head.offsetHeight;
      const count = Math.max(this.rows.length, 1);
      const available = this.doc.defaultView.innerHeight * TARGET_HEIGHT_RATIO - this.headHeight - 30;
      const rowHeight = Math.min(MAX_ROW_PX, Math.max(MIN_ROW_PX, available / count));
      this.card.style.setProperty("--row-h", `${rowHeight.toFixed(1)}px`);
      this.pillY = null;
      this.placePill();
    }

    placePill() {
      const current = this.rows.find((row) => row.dataset.state === "current");
      if (!current) {
        this.pill.classList.remove("on");
        return;
      }
      const y = current.offsetTop;
      if (y === this.pillY) return;
      const firstPlacement = !this.pill.classList.contains("on");
      if (firstPlacement) this.pill.style.transition = "none";
      this.pill.style.transform = `translateY(${y}px)`;
      if (firstPlacement) {
        void this.pill.offsetWidth;
        this.pill.style.transition = "";
      }
      this.pill.classList.add("on");
      this.pillY = y;
    }

    replay(node, className) {
      node.classList.remove(className);
      void node.offsetWidth;
      node.classList.add(className);
    }

    destroy() {
      this.doc.defaultView.clearTimeout(this.compactTimer);
      this.doc.removeEventListener("fullscreenchange", this.onFullscreenChange);
      this.doc.defaultView.removeEventListener("resize", this.onResize);
      this.host.remove();
    }
  }

  root.MeetingTimer = root.MeetingTimer || {};
  root.MeetingTimer.Overlay = Overlay;
})(globalThis);
