(function () {
  "use strict";

  const { schedule, slideDom } = globalThis.MeetingTimer;
  const $ = (id) => document.getElementById(id);
  const FIVE_MINUTES_MS = 5 * 60 * 1000;
  const DEFAULT_DURATION_MINUTES = 30;
  const MAX_DURATION_MINUTES = 600;

  let tabId = null;
  let presentationId = null;
  let deck = null;
  let session = null;

  init();

  async function init() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    tabId = tab ? tab.id : null;
    const hello = tabId === null ? null : await sendToTab({ type: "hello" });

    bindSessionControls();
    renderActive((await chrome.storage.local.get("session")).session);
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && "session" in changes) renderActive(changes.session.newValue);
    });

    if (!hello || !hello.presentationId) {
      $("not-slides").hidden = false;
      return;
    }
    presentationId = hello.presentationId;
    deck = { ...defaultDeck(hello.title), ...(await chrome.storage.local.get(deckKey()))[deckKey()] };
    $("setup").hidden = false;
    $("deck-title").textContent = deck.title;
    $("start-input").value = deck.start;
    $("duration-input").value = String(deck.durationMinutes);
    bindSetup();
    renderSlides();
    renderSummary();
    renderActive(session);
  }

  async function sendToTab(message) {
    try {
      return await chrome.tabs.sendMessage(tabId, message, { frameId: 0 });
    } catch {
      return null;
    }
  }

  function deckKey() {
    return `deck:${presentationId}`;
  }

  function defaultDeck(title) {
    const start = Math.floor(Date.now() / FIVE_MINUTES_MS) * FIVE_MINUTES_MS;
    return {
      title: title || "Untitled presentation",
      slides: [],
      start: schedule.formatClock(start),
      durationMinutes: DEFAULT_DURATION_MINUTES,
    };
  }

  function saveDeck() {
    renderSummary();
    return chrome.storage.local.set({ [deckKey()]: deck });
  }

  function bindSetup() {
    $("start-input").addEventListener("change", (event) => {
      deck.start = event.target.value;
      saveDeck();
    });
    $("duration-input").addEventListener("input", (event) => {
      deck.durationMinutes = Number(event.target.value);
      saveDeck();
    });
    $("select-all-button").addEventListener("click", () => selectAll(true));
    $("select-none-button").addEventListener("click", () => selectAll(false));
    $("scan-button").addEventListener("click", scan);
    $("add-button").addEventListener("click", addManualSection);
    $("start-button").addEventListener("click", startSession);
  }

  function bindSessionControls() {
    $("next-button").addEventListener("click", () => updateSession((s) => schedule.startTurn(s, s.position + 1, Date.now())));
    $("hide-button").addEventListener("click", () => updateSession((s) => ({ ...s, hidden: !s.hidden })));
    $("stop-button").addEventListener("click", () => chrome.storage.local.remove("session"));
  }

  async function scan() {
    const button = $("scan-button");
    button.disabled = true;
    $("scan-status").textContent = "Scanning…";
    const response = await sendToTab({ type: "scan" });
    button.disabled = false;
    let scanned;
    try {
      if (!response) throw new Error("reload the presentation tab and retry.");
      if (!response.ok) throw new Error(response.error);
      scanned = slideDom.parseDeckHtml(response.html, response.presentHtml);
    } catch (error) {
      $("scan-status").textContent = `Scan failed: ${error.message}`;
      return;
    }
    const visible = scanned.slides.filter((s) => !s.hidden);
    const hiddenCount = scanned.slides.length - visible.length;
    deck.title = scanned.title || deck.title;
    deck.slides = mergeScan(deck.slides, visible);
    $("deck-title").textContent = deck.title;
    const hiddenNote = hiddenCount ? ` (${hiddenCount} hidden left out)` : "";
    $("scan-status").textContent = `Found ${visible.length} slides${hiddenNote}. Tick where each section starts and edit names as needed.`;
    renderSlides();
    saveDeck();
  }

  // Keep the user's selection and edited names across rescans; slides are matched by their
  // stable page ID so reordering the deck doesn't move a selection onto the wrong slide.
  function mergeScan(previousSlides, scannedSlides) {
    const previous = new Map(previousSlides.filter((s) => !s.manual).map((s) => [s.pageId || `#${s.index}`, s]));
    const scanned = scannedSlides.map((slide) => {
      const old = previous.get(slide.pageId || `#${slide.index}`);
      const edited = old && old.label !== old.title;
      return {
        index: slide.index,
        pageId: slide.pageId,
        title: slide.title,
        label: edited ? old.label : slide.title || `Slide ${slide.index}`,
        selected: old ? old.selected : false,
      };
    });
    return scanned.concat(previousSlides.filter((s) => s.manual));
  }

  function addManualSection() {
    const lastIndex = deck.slides.reduce((max, s) => Math.max(max, s.index), 0);
    deck.slides.push({ index: lastIndex + 1, pageId: null, title: "", label: "", selected: true, manual: true });
    renderSlides();
    saveDeck();
  }

  function selectAll(selected) {
    for (const slide of deck.slides) slide.selected = selected;
    renderSlides();
    saveDeck();
  }

  function renderSlides() {
    const list = $("slide-list");
    list.replaceChildren();
    deck.slides.sort((a, b) => a.index - b.index);
    for (const slide of deck.slides) list.append(slideRow(slide));
    $("bulk-actions").hidden = deck.slides.length === 0;
  }

  function slideRow(slide) {
    const item = document.createElement("li");
    item.classList.toggle("selected", slide.selected);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = slide.selected;
    checkbox.title = "Starts a section";
    checkbox.addEventListener("change", () => {
      slide.selected = checkbox.checked;
      item.classList.toggle("selected", slide.selected);
      saveDeck();
    });

    let number;
    if (slide.manual) {
      number = document.createElement("input");
      number.type = "number";
      number.min = "1";
      number.value = String(slide.index);
      number.title = "Slide number";
      number.addEventListener("change", () => {
        const index = Number(number.value);
        if (Number.isInteger(index) && index >= 1) slide.index = index;
        renderSlides();
        saveDeck();
      });
    } else {
      number = document.createElement("span");
      number.className = "slide-number";
      number.textContent = String(slide.index);
    }

    const label = document.createElement("input");
    label.type = "text";
    label.dir = "auto";
    label.value = slide.label;
    label.placeholder = `Slide ${slide.index}`;
    label.addEventListener("input", () => {
      slide.label = label.value;
      saveDeck();
    });

    item.append(checkbox, number, label);
    return item;
  }

  function meetingTimes(now) {
    const startMs = schedule.parseClock(deck.start, now);
    const minutes = deck.durationMinutes;
    const validDuration = Number.isInteger(minutes) && minutes >= 1 && minutes <= MAX_DURATION_MINUTES;
    return { startMs, endMs: startMs === null || !validDuration ? null : startMs + minutes * 60000 };
  }

  function renderSummary() {
    const count = deck.slides.filter((s) => s.selected).length;
    const now = Date.now();
    const { startMs, endMs } = meetingTimes(now);
    if (!count || startMs === null || endMs === null || endMs <= Math.max(now, startMs)) {
      $("summary").textContent = count ? `${count} sections selected` : "";
      return;
    }
    const each = (endMs - Math.max(now, startMs)) / count / 60000;
    $("summary").textContent = `${count} sections · about ${each.toFixed(1)} min each if everyone started now`;
  }

  async function startSession() {
    const now = Date.now();
    const { startMs, endMs } = meetingTimes(now);
    $("error").textContent = "";
    if (startMs === null) {
      $("error").textContent = "Set a start time.";
      return;
    }
    if (endMs === null) {
      $("error").textContent = `Set a duration between 1 and ${MAX_DURATION_MINUTES} whole minutes.`;
      return;
    }
    try {
      const next = schedule.createSession({
        presentationId,
        deckTitle: deck.title,
        sections: deck.slides.filter((s) => s.selected),
        pageIndex: Object.fromEntries(deck.slides.filter((s) => s.pageId).map((s) => [s.pageId, s.index])),
        startMs,
        endMs,
        now,
      });
      await chrome.storage.local.set({ session: next });
    } catch (error) {
      $("error").textContent = error.message;
    }
  }

  async function updateSession(change) {
    const { session: latest } = await chrome.storage.local.get("session");
    if (latest) await chrome.storage.local.set({ session: change(latest) });
  }

  function renderActive(next) {
    session = next || null;
    $("active-panel").hidden = !session;
    $("start-button").textContent = session && session.presentationId === presentationId ? "Restart session" : "Start session";
    if (!session) return;

    const { sections, position } = session;
    let status;
    if (position < 0) status = "waiting for the first section slide";
    else if (position >= sections.length) status = "all sections presented";
    else status = `${sections[position].label} · ${sections.length - position} left`;
    $("active-summary").textContent = `${session.deckTitle}: ${status}`;
    $("hide-button").textContent = session.hidden ? "Show overlay" : "Hide overlay";
    $("next-button").disabled = position >= sections.length;
  }
})();
