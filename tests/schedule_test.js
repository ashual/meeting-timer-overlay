const test = require("node:test");
const assert = require("node:assert/strict");

const schedule = require("../extension/src/schedule.js");

const MINUTE = 60 * 1000;
const START = Date.UTC(2026, 9, 21, 10, 0);

function makeSession(overrides = {}) {
  return schedule.createSession({
    presentationId: "deck",
    deckTitle: "Weekly",
    sections: ["Maya", "Noah", "Lena", "Omar", "Sofia"].map((label, i) => ({ index: i * 2 + 2, label })),
    pageIndex: {},
    startMs: START,
    endMs: START + 22 * MINUTE,
    now: START - MINUTE,
    ...overrides,
  });
}

test("normalizeSections sorts by slide order, dedupes, and fills missing labels", () => {
  const sections = schedule.normalizeSections([
    { index: 7, label: "  Omar  " },
    { index: 2, label: "Maya" },
    { index: 4, label: "" },
    { index: 2, label: "Maya again" },
    { index: 0, label: "invalid" },
  ]);
  assert.deepEqual(
    sections.map((s) => [s.index, s.label]),
    [
      [2, "Maya again"],
      [4, "Slide 4"],
      [7, "Omar"],
    ],
  );
});

test("sectionPositionForSlide maps detail slides to the latest section start", () => {
  const sections = schedule.normalizeSections([{ index: 2 }, { index: 5 }, { index: 9 }]);
  assert.equal(schedule.sectionPositionForSlide(sections, 1), -1);
  assert.equal(schedule.sectionPositionForSlide(sections, 2), 0);
  assert.equal(schedule.sectionPositionForSlide(sections, 4), 0);
  assert.equal(schedule.sectionPositionForSlide(sections, 5), 1);
  assert.equal(schedule.sectionPositionForSlide(sections, 30), 2);
});

test("createSession validates the configuration", () => {
  assert.throws(() => makeSession({ sections: [] }), /at least one section/);
  assert.throws(() => makeSession({ endMs: START }), /positive duration/);
  assert.throws(() => makeSession({ now: START + 30 * MINUTE }), /already ended/);
});

test("remaining time is split evenly and recalculated at each handoff", () => {
  let session = schedule.startTurn(makeSession(), 0, START);
  assert.equal(session.deadlineMs - session.turnStartMs, 4.4 * MINUTE);

  session = schedule.startTurn(session, 1, START + 2 * MINUTE);
  assert.equal(session.deadlineMs - session.turnStartMs, 5 * MINUTE);
});

test("a turn reached before the meeting starts holds its budget until the start time", () => {
  const session = schedule.startTurn(makeSession(), 0, START - 3 * MINUTE);
  assert.equal(session.turnStartMs, START);
  assert.equal(session.deadlineMs, START + 4.4 * MINUTE);

  const waiting = schedule.view(session, START - 3 * MINUTE);
  assert.equal(waiting.big, "4");
  assert.equal(waiting.progress, 0);
  assert.match(waiting.caption, /^starts /);
});

test("a late start compresses the remaining turns", () => {
  const session = schedule.startTurn(makeSession(), 0, START + 7 * MINUTE);
  assert.equal(session.deadlineMs - session.turnStartMs, 3 * MINUTE);
});

test("backward navigation and revisiting the current section keep the allocation", () => {
  const session = schedule.startTurn(makeSession(), 2, START + MINUTE);
  assert.equal(schedule.startTurn(session, 2, START + 3 * MINUTE), session);
  assert.equal(schedule.startTurn(session, 1, START + 3 * MINUTE), session);
  assert.equal(schedule.startTurn(session, -1, START + 3 * MINUTE), session);
});

test("returning to the previous section recalculates the time still left", () => {
  let session = schedule.startTurn(makeSession(), 0, START);
  session = schedule.startTurn(session, 1, START + 2 * MINUTE);
  assert.equal(session.deadlineMs - session.turnStartMs, 5 * MINUTE);

  const back = schedule.previousTurn(session, START + 3 * MINUTE);
  assert.equal(back.position, 0);
  assert.equal(back.turnStartMs, START + 3 * MINUTE);
  assert.equal(back.deadlineMs - back.turnStartMs, (19 * MINUTE) / 5);
  assert.deepEqual(
    schedule.view(back, START + 3 * MINUTE).items.map((item) => item.state),
    ["current", "upcoming", "upcoming", "upcoming", "upcoming"],
  );

  assert.equal(schedule.previousTurn(back, START + 4 * MINUTE), back);
  const waiting = makeSession();
  assert.equal(schedule.previousTurn(waiting, START), waiting);
});

test("returning from a finished session reopens the last section", () => {
  let session = schedule.startTurn(makeSession(), 4, START);
  session = schedule.startTurn(session, 5, START + MINUTE);
  const back = schedule.previousTurn(session, START + 2 * MINUTE);
  assert.equal(back.position, 4);
  assert.equal(back.turnStartMs, START + 2 * MINUTE);
  assert.equal(back.deadlineMs - back.turnStartMs, 20 * MINUTE);
  assert.equal(schedule.view(back, START + 2 * MINUTE).phase, "running");
});

test("skipping sections marks them presented and shares time among the rest", () => {
  const session = schedule.startTurn(makeSession(), 2, START + 4 * MINUTE);
  assert.equal(session.deadlineMs - session.turnStartMs, 6 * MINUTE);
  assert.deepEqual(
    schedule.view(session, START + 4 * MINUTE).items.map((i) => i.state),
    ["done", "done", "current", "upcoming", "upcoming"],
  );
});

test("advancing past the last section finishes the session", () => {
  let session = schedule.startTurn(makeSession(), 4, START);
  session = schedule.startTurn(session, 5, START + MINUTE);
  assert.equal(session.position, 5);
  const done = schedule.view(session, START + MINUTE);
  assert.equal(done.phase, "done");
  assert.ok(done.items.every((i) => i.state === "done"));
  assert.equal(schedule.startTurn(session, 6, START + 2 * MINUTE), session);
});

test("view shows whole minutes, a calm sub-minute state, and wrap up", () => {
  const session = schedule.startTurn(makeSession(), 0, START);

  const running = schedule.view(session, START);
  assert.deepEqual([running.phase, running.big, running.unit, running.caption], ["running", "4", "min", "5 left"]);
  assert.equal(running.progress, 0);

  assert.equal(schedule.view(session, START + 2.2 * MINUTE).progress, 0.5);
  assert.equal(schedule.view(session, START + 3.8 * MINUTE).big, "<1");

  const wrapup = schedule.view(session, START + 5 * MINUTE);
  assert.deepEqual([wrapup.phase, wrapup.big, wrapup.progress], ["wrapup", "Wrap up", 1]);
  assert.equal(schedule.view(session, session.deadlineMs + MINUTE).phase, "wrapup");

  const over = schedule.view(session, session.deadlineMs + MINUTE + 1);
  assert.deepEqual([over.phase, over.big, over.unit, over.compact.value, over.progress], ["over", "-1", "min", "-1", 1]);
  assert.equal(schedule.view(session, session.deadlineMs + 1.6 * MINUTE).big, "-1");
  assert.equal(schedule.view(session, session.deadlineMs + 2 * MINUTE).big, "-2");
});

test("the compact view keeps the minutes and the sections left in short form", () => {
  const before = makeSession();
  assert.deepEqual(schedule.view(before, START - MINUTE).compact, { value: "4", unit: "min", caption: "5 left" });

  const session = schedule.startTurn(before, 1, START + 2 * MINUTE);
  assert.deepEqual(schedule.view(session, START + 2 * MINUTE).compact, { value: "5", unit: "min", caption: "4 left" });
  assert.deepEqual(schedule.view(session, START + 6.5 * MINUTE).compact, { value: "<1", unit: "min", caption: "4 left" });
  assert.deepEqual(schedule.view(session, START + 8 * MINUTE).compact, { value: "0", unit: "min", caption: "4 left" });
  assert.deepEqual(schedule.view(session, START + 9 * MINUTE).compact, { value: "-2", unit: "min", caption: "4 left" });

  const done = schedule.startTurn(session, 5, START + 8 * MINUTE);
  assert.deepEqual(schedule.view(done, START + 8 * MINUTE).compact, { value: "\u2713", unit: "", caption: "done" });
});

test("view before the first section shows the per-section estimate", () => {
  const waiting = schedule.view(makeSession(), START + 2 * MINUTE);
  assert.deepEqual([waiting.phase, waiting.big, waiting.unit, waiting.caption], ["waiting", "4", "min each", "5 left"]);
  assert.ok(waiting.items.every((i) => i.state === "upcoming"));
});

test("view is derived from wall-clock time, so throttled ticks cannot drift", () => {
  const session = schedule.startTurn(makeSession(), 0, START);
  assert.deepEqual(schedule.view(session, START + 3 * MINUTE), schedule.view(session, START + 3 * MINUTE));
  assert.equal(schedule.view(session, START + 3 * MINUTE).big, "1");
});

test("parseClock and formatClock round-trip local wall-clock times", () => {
  const now = new Date(2026, 9, 21, 8, 15).getTime();
  const tenThirty = schedule.parseClock("10:30", now);
  assert.equal(schedule.formatClock(tenThirty), "10:30");
  assert.equal(new Date(tenThirty).getDate(), 21);
  assert.equal(schedule.parseClock("24:00", now), null);
  assert.equal(schedule.parseClock("", now), null);
});
