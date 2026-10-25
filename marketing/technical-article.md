# A Google Slides timer that recalculates at each agenda transition

Draft for the maker's technical blog or DEV account. Not published. The descriptions below
come from the repository source, rather than a new live-meeting benchmark.

---

A meeting can have a fixed end time and still spend nearly all of it on one topic. The
remaining speakers or agenda items inherit whatever time is left. A visible countdown makes
that tradeoff easier for the room to see and helps the facilitator decide when to move on.

I built Meeting Timer Overlay for meetings with multiple speakers or topics and a fixed
end time. A section can represent a speaker, a topic, a discussion, or a combination. In
Google Slides, mark the first slide of each section and set the meeting start and duration. When the slideshow reaches a marked slide, the extension starts that section's
countdown and recalculates its share of the remaining time.

## The allocation model

At each handoff, the extension divides the remaining meeting budget among the sections left,
including the section starting now. In the implementation, the effective start is the later
of now and the scheduled meeting start, and a negative remaining budget is clamped to zero:

```js
const turnStartMs = Math.max(now, session.startMs);
const budgetMs = Math.max(0, session.endMs - turnStartMs)
  / (session.sections.length - position);
```

With 22 minutes and five sections left, the first allocation is 4.4 minutes. If that speaker
finishes after two minutes, the next person receives 20 / 4 = five minutes. The example is an
illustration of the rule, not a measurement from a pilot.

This approach shares the remaining budget. It cannot guarantee equal total airtime: an early
overrun still leaves less time for later people. It also does not interrupt anyone or stop
the deck. The tradeoff is explicit in the UI, which moves from a whole-minute countdown to
amber “Wrap up” and, more than a minute over, negative minutes in red.

The calculation uses absolute times rather than decrementing an in-memory counter. That keeps
the model tied to the wall clock when a background tab's callbacks run less frequently.

## Slide changes are section boundaries

Presenters often go back to a detail slide. Treating every backward slide change as a new turn
would reset timing accidentally. Automatic changes therefore move the session forward only.
A jump ahead marks the intervening sections as done. A separate Previous section control
returns to the previous section and recalculates the remaining budget from there.

Scanning and detection have their own module. The extension fetches the open presentation's
accessible HTML view for titles, and its slideshow view for shown/skipped slide information.
Both requests go to docs.google.com with the user's existing Google session. Titles are a
heuristic based on prominent text, so the popup allows edited names and manual sections.

During presentation, detection uses the viewer address, slide position, and accessibility
labels as fallbacks. This depends on Google Slides page structure and can break when it
changes. The manual controls are part of the recovery path.

## An overlay that leaves the presentation usable

The overlay uses a closed Shadow DOM to isolate its styling. Its host has
`pointer-events: none`, which lets presentation clicks pass through. When a fullscreen element
would hide an overlay outside it, the code moves the host into the relevant element. The
separate speaker-notes window is intentionally excluded.

After five seconds without a slide change, the card shrinks to a compact strip. The next slide
change expands it again. Keyboard shortcuts provide next section, previous section, and
show/hide controls without requiring the popup during the presentation.

## Local configuration and an explicit network boundary

Settings and the active session live in chrome.storage.local. There is no developer backend,
separate account system, or analytics. Scanning still requests the presentation views from
Google; “local settings” should not be mistaken for “no network requests.” The privacy policy
explains those requests and the docs.google.com content-script scope.

A copied deck does not carry extension settings. Each organizer configures their copy in their
own browser. That is why the reusable weekly-update deck includes a separate setup path.

## Try it in one real meeting

The extension is free and MIT licensed. If you run a recurring shared-deck update, I would like
to hear where setup gets awkward and whether the remaining-time rule makes transitions easier in your meeting.
Workshops, panels, board meetings, lessons, and team updates are all possible use cases when
Google Slides provides the agenda sections; no adoption in those settings is being claimed.

- Install: https://chromewebstore.google.com/detail/meeting-timer-overlay/cdllfbfpncendlekbbaepmmohdcciihc
- Source and setup: https://github.com/ashual/meeting-timer-overlay
- Allocation model: https://github.com/ashual/meeting-timer-overlay/blob/main/extension/src/schedule.js
- Slide detection: https://github.com/ashual/meeting-timer-overlay/blob/main/extension/src/slide_dom.js
- Overlay: https://github.com/ashual/meeting-timer-overlay/blob/main/extension/src/overlay.js
- Privacy: https://github.com/ashual/meeting-timer-overlay/blob/main/PRIVACY.md
