(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.MeetingTimer = root.MeetingTimer || {};
    root.MeetingTimer.schedule = api;
  }
})(globalThis, function () {
  "use strict";

  const MINUTE_MS = 60 * 1000;

  function normalizeSections(sections) {
    const byIndex = new Map();
    for (const section of sections) {
      const index = Number(section.index);
      if (!Number.isInteger(index) || index < 1) continue;
      const label = String(section.label ?? "").replace(/\s+/g, " ").trim() || `Slide ${index}`;
      byIndex.set(index, { index, label, pageId: section.pageId || null });
    }
    return [...byIndex.values()].sort((a, b) => a.index - b.index);
  }

  function sectionPositionForSlide(sections, slideIndex) {
    let position = -1;
    for (let i = 0; i < sections.length && sections[i].index <= slideIndex; i++) {
      position = i;
    }
    return position;
  }

  function createSession({ presentationId, deckTitle, sections, pageIndex, startMs, endMs, now }) {
    const normalized = normalizeSections(sections);
    if (!normalized.length) throw new Error("Select at least one section slide.");
    if (!(endMs > startMs)) throw new Error("The meeting needs a positive duration.");
    if (endMs <= now) throw new Error("This meeting has already ended; check the start time and duration.");
    return {
      presentationId,
      deckTitle,
      sections: normalized,
      pageIndex: pageIndex || {},
      startMs,
      endMs,
      position: -1,
      turnStartMs: null,
      deadlineMs: null,
      hidden: false,
      startedAt: now,
    };
  }

  // Each turn gets an equal share of the time that is actually left when it begins, so
  // early finishers donate time to the remaining sections and overruns are absorbed fairly.
  function startTurn(session, position, now) {
    const count = session.sections.length;
    if (position <= session.position || session.position >= count) return session;
    if (position >= count) {
      return { ...session, position: count, turnStartMs: null, deadlineMs: null };
    }
    const turnStartMs = Math.max(now, session.startMs);
    const budgetMs = Math.max(0, session.endMs - turnStartMs) / (count - position);
    return { ...session, position, turnStartMs, deadlineMs: turnStartMs + budgetMs };
  }

  function formatClock(ms) {
    const date = new Date(ms);
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  function parseClock(text, now) {
    const match = /^(\d{1,2}):(\d{2})$/.exec(String(text).trim());
    if (!match || Number(match[1]) > 23 || Number(match[2]) > 59) return null;
    const date = new Date(now);
    date.setHours(Number(match[1]), Number(match[2]), 0, 0);
    return date.getTime();
  }

  function formatMinutes(ms) {
    if (ms < MINUTE_MS) return "<1";
    return String(Math.round(ms / MINUTE_MS));
  }

  function view(session, now) {
    const count = session.sections.length;
    const position = session.position;
    const items = session.sections.map((section, i) => ({
      label: section.label,
      state: i < position ? "done" : i === position ? "current" : "upcoming",
    }));
    const beforeStart = now < session.startMs;
    const startsCaption = `starts ${formatClock(session.startMs)}`;

    // The idle card only has room for a short value inside the ring and a short caption.
    if (position < 0) {
      const eachMs = Math.max(0, session.endMs - Math.max(now, session.startMs)) / count;
      const minutes = formatMinutes(eachMs);
      return {
        phase: "waiting",
        big: minutes,
        unit: "min each",
        caption: beforeStart ? startsCaption : `${count} left`,
        compact: { value: minutes, unit: "min", caption: `${count} left` },
        progress: 0,
        items,
      };
    }
    if (position >= count) {
      return {
        phase: "done",
        big: "Done",
        unit: "",
        caption: "all sections presented",
        compact: { value: "\u2713", unit: "", caption: "done" },
        progress: 1,
        items,
      };
    }

    const left = `${count - position} left`;
    const caption = beforeStart ? startsCaption : left;
    const turnNow = Math.max(now, session.turnStartMs);
    const totalMs = session.deadlineMs - session.turnStartMs;
    const remainingMs = session.deadlineMs - turnNow;
    if (remainingMs <= 0) {
      return {
        phase: "wrapup",
        big: "Wrap up",
        unit: "",
        caption,
        compact: { value: "0", unit: "min", caption: left },
        progress: 1,
        items,
      };
    }
    const minutes = formatMinutes(remainingMs);
    return {
      phase: "running",
      big: minutes,
      unit: "min",
      caption,
      compact: { value: minutes, unit: "min", caption: left },
      progress: Math.min(1, Math.max(0, (turnNow - session.turnStartMs) / totalMs)),
      items,
    };
  }

  return {
    createSession,
    formatClock,
    formatMinutes,
    normalizeSections,
    parseClock,
    sectionPositionForSlide,
    startTurn,
    view,
  };
});
