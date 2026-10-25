# Launch kit

Drafts only. No posts, messages, or directory submissions have been sent. The site and demo are
live. Search Console ownership is verified; its initial sitemap-report issue is documented in
`search-visibility.md`. See `positioning.md` for the product's scope and messaging reference.

## GitHub About

```text
Free, open-source Google Slides timer for meetings with multiple speakers or topics and a fixed end time. Make time visible and keep the agenda moving.
```

## GitHub topics

```text
chrome-extension, google-slides, meeting-timer, agenda, timeboxing, facilitation, presentation-timer, open-source, javascript
```

## Proposed future manifest summary

```text
Google Slides meeting timer for speakers and topics. Make time visible, share the time left, and keep the agenda moving.
```

The current package summary is unchanged. Check the proposed summary's length before a
separately reviewed extension release.

## Homepage metadata

```text
Title: Google Slides Timer for Speakers & Topics | Meeting Timer Overlay
Description: A free Google Slides timer for meetings with multiple speakers or topics and a fixed end time. Make time visible and know when to move on.
H1: Keep time. Keep the agenda moving.
CTA: Add to Chrome — free
Supporting copy: Multiple speakers or topics. One fixed end time. Keep the remaining time visible so everyone knows when to wrap up and move on.
```

## LinkedIn post

```text
A meeting can have a clear end time and still spend almost all of it on the first topic.

I built Meeting Timer Overlay to make that time visible to everyone.

It's a free, open-source Chrome extension for Google Slides. Mark where each speaker or topic starts and set the meeting's start time and duration. As you move through those sections, the timer recalculates a share of the time left.

One person can lead several topics. Several people can speak. The meeting can mix presentations and discussion. The goal is to make it easier to see when to wrap up and move on.

Workshops, panels, board meetings, lessons, training, community meetings, team updates: any of these can use a timed agenda in Slides.

It doesn't interrupt anyone or enforce a limit; the facilitator still decides when to move on. No separate account, subscription, or developer analytics.

Try the timing rule without installing: https://ashual.github.io/meeting-timer-overlay/demo.html
Install: https://chromewebstore.google.com/detail/meeting-timer-overlay/cdllfbfpncendlekbbaepmmohdcciihc
Source: https://github.com/ashual/meeting-timer-overlay

If you run a meeting with several speakers or topics, I'd love feedback from one actual session: was the time visible, and were transitions easier?
```

## Show HN submission

```text
Title: Show HN: A Google Slides timer for speakers and agenda topics
Link: https://github.com/ashual/meeting-timer-overlay

I built a free Chrome extension for meetings with several speakers or topics and a fixed end time.

Mark section-start slides and set the meeting start and duration. When you reach a marked slide, its timer starts. A section can represent a person, a topic, a discussion, or a mix. You can also advance sections manually when a discussion moves on.

Each transition recalculates (meeting end − now) / sections left. A short section gives time back; an overrun leaves less for later items. It makes the tradeoff visible, rather than guaranteeing equal airtime or enforcing a speaking limit.

No-install simulation: https://ashual.github.io/meeting-timer-overlay/demo.html
The simulation uses the extension's timing model and does not connect to Slides. The installed extension follows your deck and real clock.

MIT licensed. Settings stay in local browser storage. Scanning requests the open deck's views from Google using the existing session. No developer backend or separate account.

I'd like feedback on the timing model and on setup for both speaker-led and topic-led agendas.
```

## Product Hunt fields

```text
Name: Meeting Timer Overlay
Tagline: Keep time visible for every speaker and agenda topic
Description: Free, open-source Google Slides timer for meetings with multiple speakers or topics and a fixed end time. See the time left, move between sections, and keep the agenda moving. No separate account.
Pricing: Free
Maker comment: I built this to help a room see when to move on before one topic consumes the meeting. Mark speaker or topic sections in Google Slides; the timer follows them and recalculates the time left. It supports shared time awareness while the facilitator stays in control. I'd love feedback after one real meeting, workshop, lesson, panel, or discussion.
```

## Pilot invitation

```text
I built a free, open-source Google Slides timer for meetings with several speakers or topics and a fixed end time. It shows the current countdown and what's still on the agenda, recalculating the remaining budget at each section transition.

Would you try it in one meeting you already run? I'd like to hear whether everyone could see the time and whether it was easier to move to the next speaker or topic. A short section gives time back; an overrun reduces what's left. The timer doesn't enforce the deadline.

Try the rule: https://ashual.github.io/meeting-timer-overlay/demo.html
Install: https://chromewebstore.google.com/detail/meeting-timer-overlay/cdllfbfpncendlekbbaepmmohdcciihc
```

## Creator pitch template

```text
Subject: A Google Slides timer for speakers and topics

Your guide on [specific verified article] covers [relevant workflow]. I built Meeting Timer Overlay for meetings where multiple speakers or topics share a fixed end time.

It marks speaker or topic sections in Google Slides, shows the current timer and agenda queue, and recalculates the remaining budget at each transition. The purpose is shared time awareness and easier decisions about when to move on. It doesn't enforce a limit or listen to the discussion.

Try the rule without installing: https://ashual.github.io/meeting-timer-overlay/demo.html
Source and setup: https://github.com/ashual/meeting-timer-overlay

I'm the developer. Would this use case fit your editorial coverage?
```

## Demo recording script

```text
0–5s: Show a topic-title slide and the overlay. Caption: “Several speakers or topics. One fixed end time.”
5–12s: Show Scan deck, mark topic or speaker section starts, and set duration.
12–20s: Move to the next marked section. Also show the manual next-section control for a discussion-led agenda.
20–25s: Illustrate 22 minutes / 5 sections → one section uses 2 minutes → 20 minutes / 4 sections. Label the example as an illustration.
25–30s: Show the install URL and “Make time visible. Keep the agenda moving. Free · Open source · Google Slides in Chrome.”
Use a real screen recording and a non-sensitive deck. Don't fabricate pilot results or time saved.
```

## Publication handoff

- The existing Pages configuration deploys website changes after merge.
- Publish corrected store copy separately after checking the installed store build.
- Keep the current manifest summary until a separately reviewed extension release.
- Keep weekly-update materials as examples; include topic-led agendas in future pilots.
- See `outreach-research.md` for existing leads and `positioning.md` for broader audience research.
