# Launch kit

Drafts only. Nothing in this folder has been published or sent. Confirm account eligibility
and channel rules at publication time. Replace personal statements or placeholders as needed.
The original four-page project site is live. The demo and meeting agenda are prepared in
the follow-up PR; use their links only after it is merged and Pages deploys.
See `distribution-queue.md` for researched routes and updated submission fields, and
`search-visibility.md` for the account-dependent indexing steps.

## GitHub About

```text
Free, open-source Google Slides meeting timer with automatic speaker handoffs and fair sharing of the time left.
```

## GitHub topics

```text
chrome-extension, google-slides, meeting-timer, presentation-timer, meeting-productivity, timeboxing, open-source, javascript
```

## Proposed future manifest summary

```text
Free Google Slides meeting timer: automatic speaker handoffs and a fair share of remaining time. Open source, no account.
```

## Homepage metadata

```text
Title: Google Slides Meeting Timer for Team Updates | Meeting Timer Overlay
Description: Give each presenter a fair share of the time left. A free, open-source Chrome timer that follows Google Slides sections. No separate account.
H1: Give every presenter a fair share of the time left.
CTA: Add to Chrome — free
Supporting copy: Mark each speaker’s first slide. Set your meeting time. Present as usual; the timer follows the deck and recalculates the remaining time between sections.
```

## LinkedIn post

```text
The last person presenting in a team meeting often gets whatever time is left.

I built Meeting Timer Overlay to make that tradeoff visible.

It runs on Google Slides. Mark where each speaker’s section starts and set the meeting duration. As you move through the deck, the timer switches sections automatically and divides the remaining time among the presenters still waiting.

If someone finishes early, the next presenters get more time. If someone runs over, the reduced time becomes visible.

Free and open source. No separate account, subscription, or analytics in the extension.

If you run weekly updates, lab meetings, or team demos in Slides, I’d love feedback from one real meeting: did it make timing easier?

Install: https://chromewebstore.google.com/detail/meeting-timer-overlay/cdllfbfpncendlekbbaepmmohdcciihc
Source: https://github.com/ashual/meeting-timer-overlay
```

## Show HN submission

```text
Title: Show HN: A Google Slides timer that shares time left among presenters
Link: https://github.com/ashual/meeting-timer-overlay

I built a Chrome extension for meetings where multiple people present from one Google Slides deck.

You scan the deck, mark the slides where sections begin, and set the meeting start and duration. When you reach a section’s first slide, its timer starts. Its allocation is (meeting end − now) / sections left.

That is a deliberate tradeoff: it shares the remaining budget rather than guaranteeing equal total airtime. A long early update can still leave later speakers with less time.

The overlay has a speaker queue, fullscreen support, a compact view, and manual shortcuts. Configuration stays in local browser storage. It uses existing Slides page views for scanning; no developer backend or separate OAuth flow.

MIT licensed, no build step for loading the extension. I’m interested in feedback on the allocation model and setup friction.

Install: https://chromewebstore.google.com/detail/meeting-timer-overlay/cdllfbfpncendlekbbaepmmohdcciihc
```

## Product Hunt fields

```text
Name: Meeting Timer Overlay
Tagline: Fair speaking time for Google Slides team updates
Description: A free, open-source Chrome extension that follows your Google Slides sections, switches presenter timers automatically, and shares the time left among upcoming speakers. No separate account or subscription.
Pricing: Free
Maker comment: I built this for meetings with several presenters sharing one deck. The timer follows the slides and recalculates the time left at each section. I’d love to hear whether this fits your team’s update meeting, and what makes setup difficult.
```

## Pilot invitation

```text
I built a free, open-source timer for team updates in Google Slides. It switches speaker sections as you move through the deck and splits the remaining meeting time among the sections left.

Would you try it in one meeting you already run? I can help configure the first deck. The most useful feedback would be whether setup felt easy and whether the final presenter had enough time.

https://chromewebstore.google.com/detail/meeting-timer-overlay/cdllfbfpncendlekbbaepmmohdcciihc
```

## Creator pitch template

```text
Subject: A Google Slides timer for meetings with several presenters

I read your guide on [specific relevant article] and thought this might be useful for the multi-presenter case.

I built Meeting Timer Overlay, a free MIT-licensed Chrome extension. Rather than embedding a fixed countdown, it follows the speaker sections in a Slides deck and recalculates a share of the remaining meeting time at each handoff.

Here is the working extension: https://chromewebstore.google.com/detail/meeting-timer-overlay/cdllfbfpncendlekbbaepmmohdcciihc
Source and setup: https://github.com/ashual/meeting-timer-overlay

If it fits your coverage, I’d be glad to answer questions. If not, no problem. I’m the developer; this is not a paid placement request.
```

## Demo recording script

```text
0–5s: Show a normal team-update slide and the overlay. Caption: “Several presenters. One meeting deadline.”
5–12s: Show Scan deck, select two section starts, and set duration.
12–20s: Present and move into the next marked section. Show the active speaker changing.
20–25s: Explain the real 22 minutes / 5 sections → early finish → 20 minutes / 4 sections example with on-screen text. Label this as an illustration, not a live measurement.
25–30s: Show the install URL and “Free · Open source · Google Slides in Chrome.”
Use a real screen recording, legible captions, and a non-sensitive deck. Do not fabricate user numbers or time saved.
```

## Publication handoff

- README, website, deck and listing source are prepared in the PR.
- Merge the PR and enable Pages from main /docs following docs/README.md.
- Confirm the installed store build before publishing the corrected store description.
- Keep the current manifest summary until a separately reviewed extension release changes it.
- Record a real walkthrough before posting the demo. The repository images use illustrative content.
- Invite real organizers and record responses, first meetings, and repeat use in experiment-log.md.
