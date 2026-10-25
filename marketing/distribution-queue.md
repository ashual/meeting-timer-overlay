# Free distribution queue

Prepared 26 October 2026. These are researched opportunities and ready-to-use drafts, not
completed submissions or endorsements. Nothing has been sent. The demo and agenda are live, and Search Console ownership is verified.
See [outreach-research.md](outreach-research.md) for the original six editorial/directory targets
and [outreach-expanded.md](outreach-expanded.md) for eight additional organizations, channel-specific
pitches, contact routes, editorial requirements, pilot asks, follow-ups, and a tracking table.
Product positioning: [positioning.md](positioning.md). The core audience is any meeting with
multiple speakers or topics and a fixed end time, using Google Slides; these channels are
an initial discovery batch.

## Order of work

1. Completed: merge the interactive-demo PR and verify the two new public pages.
2. Completed: verify Search Console and submit the sitemap. Its fetch-report issue remains
   documented in `search-visibility.md`; Google accepted four direct indexing requests.
3. Run one real meeting; confirm the store build and capture a real walkthrough.
4. Publish the maker's LinkedIn post and Show HN while the maker can answer questions.
5. Submit AlternativeTo; treat its review queue separately from publication.
6. After sending is authorized, begin with explicit resource invitations: Eric Curts,
   Find Extensions, Facilitator School, and SessionLab. Check live form/comment requirements;
   use one route per organization. General routing inquiries follow. Editorial proposals and
   unresolved contacts stay on hold as documented in the expanded report. Product Hunt is
   optional after pilot feedback.

Prioritize organizer feedback over launch votes. No paid placements, hunters, ads, or
submission fees are included. If any route requires payment, skip it.

## Initial launch shortlist

| Priority | Destination | Why it fits | Verified route / requirement | Status |
| --- | --- | --- | --- | --- |
| 1 | Show HN | The open-source extension has a concrete implementation and an allocation tradeoff to discuss. The browser simulation reduces installation friction. | Submit at https://news.ycombinator.com/submit using a personal account. Explain the actual extension, disclose the simulation's scope, and be available to discuss it. Do not ask for votes. | Draft below; not submitted |
| 2 | AlternativeTo | A directory entry can explain the speaker-or-topic workflow to people comparing timer software. | User menu → Suggest new application. Verified email required; entries go through moderation. Check for an existing entry before creating another. | Listing fields below; not submitted |
| 3 | Teacher Tech / Alice Keeler | Her own guide covers ClayCodes Slides Timer and auto-advance, so a presenter-section timer is a specific adjacent use case. Classroom fit is a hypothesis, not validated. | Public contact page: https://alicekeeler.com/contact-me/. It is primarily a professional-services contact route, not a promise to review unsolicited software. Confirm editorial suitability before sending. | Tailored pitch below; not sent |
| 4 | Control Alt Achieve / Eric Curts | His October 2026 resource roundup invites recommendations and discusses learning about tools from creators. See the expanded outreach report. | Public Connect page: https://www.controlaltachieve.com/p/connect.html. Current resource invitation: https://www.controlaltachieve.com/2026/10/LOTW261012.html. Coverage is discretionary. | Tailored pitch below; not sent |
| 5 | Product Hunt | A broad maker audience can try the example and install the released extension. Less specific than reaching recurring-meeting organizers. | Personal account; new accounts must complete onboarding. Self-hunting is supported. Submit a direct product URL. | Fields below; not submitted |

Evidence that a publisher covered a relevant topic is evidence of fit only. It does not
mean they are accepting pitches, promising coverage, or endorsing this project. No private
email addresses or inferred recipient identities are included.

## Show HN: draft ready; site deployed

Title: Show HN: A Google Slides timer for speakers and agenda topics

URL: https://github.com/ashual/meeting-timer-overlay

First comment:

I built a free Chrome extension for meetings with multiple speakers or topics and a fixed
end time. Mark each speaker or topic section in Google Slides and set the meeting start and
duration. Reaching a marked slide switches the active section automatically; manual controls
let a facilitator move discussion-led agendas forward. The goal is shared time awareness
and easier transitions before one topic consumes the meeting.

At each handoff, the allocation is the remaining meeting time divided by the sections left.
With 22 minutes and five sections, the first gets 4:24. If they finish after two minutes, the
next gets 5:00; if they take seven minutes, the next gets 3:45. This shares the remaining budget
rather than guaranteeing equal airtime. It doesn't stop a speaker or discussion, or advance slides for you.

You can try that rule without installing:
https://ashual.github.io/meeting-timer-overlay/demo.html
The page is a click-driven simulation using the extension's schedule code; it doesn't connect
to Slides. The actual extension follows your deck and real clock.

MIT licensed. Settings stay in local browser storage. No developer backend or analytics.
Scanning requests the open presentation's views from Google using your existing session.

I'd especially like feedback on whether the allocation model fits meetings with speakers or topics, and
where the initial deck setup is awkward.

Install:
https://chromewebstore.google.com/detail/meeting-timer-overlay/cdllfbfpncendlekbbaepmmohdcciihc

## AlternativeTo listing fields

- Name: Meeting Timer Overlay
- Website: https://ashual.github.io/meeting-timer-overlay/
- License: Open source, MIT
- Price: Free
- Platform: Google Chrome desktop extension; Google Slides required
- Source: https://github.com/ashual/meeting-timer-overlay
- Suggested tags, if available in the form: meeting timer, presentation timer, Google Slides,
  timeboxing, Chrome extension, open source
- Short description: A Google Slides timer for meetings with multiple speakers or topics and a fixed end time.
  Make time visible and know when to move on.

Long description:

Meeting Timer Overlay is a free, open-source Chrome extension for meetings with multiple
speakers or topics using Google Slides. Scan the deck, mark the first slide of each section,
and set the meeting start and duration. During the audience-facing slideshow, an overlay
shows the current timer and section queue. Section changes recalculate the remaining budget.
A section can be a person, topic, or discussion. It helps participants see when to wrap up
and move on, whether the meeting is a workshop, lesson, panel, board meeting, or team update.

Early finishes leave more time for later presenters; overruns leave less. The extension does
not guarantee equal airtime or enforce a speaking limit. It supports fullscreen presentation,
a compact display, and manual section controls. Settings are stored locally in the browser.
There is no separate account or developer analytics backend. Scanning fetches presentation
views from Google using the existing session. Desktop Chrome and Google Slides are required;
there is no native Zoom or Meet integration.

Use genuine functional overlaps when suggesting alternatives; do not mark unrelated popular
apps as alternatives for visibility.

## Product Hunt fields

Name: Meeting Timer Overlay

Tagline: Keep time visible for every speaker and agenda topic

Description: Free, open-source Google Slides timer for meetings with multiple speakers or topics and a fixed end time. See the time left, move between sections, and keep the agenda moving. No separate account.

Website: https://ashual.github.io/meeting-timer-overlay/

Download: https://chromewebstore.google.com/detail/meeting-timer-overlay/cdllfbfpncendlekbbaepmmohdcciihc

Pricing: Free

First comment:

I built this to help everyone see when to move on before one speaker or topic consumes the
meeting. It makes the remaining budget visible and recalculates it at each section transition.
A section can be a speaker, topic, or discussion. It doesn't interrupt anyone or enforce a
limit; the facilitator stays in control. Try the browser simulation before installing, then
share feedback after a meeting, workshop, lesson, panel, or discussion using Google Slides.

Use the repository's product screenshots, clearly described as illustrative. A real recording
is still needed for the proposed walkthrough video. No pilot results or testimonials are
claimed. The description is below the documented 260-character limit; recheck current fields
in the submission UI.

## Editorial pitch: Alice Keeler

Subject: A presenter-section timer alongside your Google Slides timer guide

Hi Alice,

Your guide to ClayCodes Slides Timer explains the fixed countdown and auto-advance workflow.
I built a free, MIT-licensed Chrome extension for a different case: multiple speakers or topics sharing
a fixed meeting deadline. Mark speaker or topic section starts in Google Slides; the overlay
shows the time left and recalculates the remaining budget at each transition.

It doesn't auto-advance slides or enforce equal airtime. I thought the group-presentation
case might be relevant to readers comparing Slides timing approaches, though I haven't
validated it in a classroom.

The timing rule can be tried without installation:
https://ashual.github.io/meeting-timer-overlay/demo.html
Source and setup: https://github.com/ashual/meeting-timer-overlay

I'm the developer. If this fits your editorial coverage, I'd be happy to answer questions.
This is a request for consideration, with no paid placement proposed.

## Editorial pitch: Control Alt Achieve

Subject: A shared-deck example for your Google timer coverage

Hi Eric,

Your countdown-timer guide covers free timers that work with Google tools. I built a free,
open-source extension for a specific related situation: multiple speakers or topics moving through one
Google Slides agenda with a fixed end time.

The timer follows marked speaker or topic sections. At each transition it divides the time
left among the sections remaining, so an early finish leaves more time for later items and
an overrun leaves less. It doesn't enforce a limit or auto-advance slides.

Here's a no-install simulation of that rule:
https://ashual.github.io/meeting-timer-overlay/demo.html
The actual extension and source: https://github.com/ashual/meeting-timer-overlay

If shared-deck group presentations fit your current coverage, would this be useful to review?
I'm the developer, and I haven't validated the workflow in a classroom. No paid placement is
proposed.

## Sources checked 26 October 2026

- Show HN rules: https://news.ycombinator.com/showhn.html
- AlternativeTo submission and moderation: https://alternativeto.net/faq/
- Product Hunt account, fields and image guidance:
  https://help.producthunt.com/en/articles/479557-how-to-post-a-product
- Product Hunt free use and self-hunting:
  https://www.producthunt.com/launch/how-product-hunt-works
- Teacher Tech guide:
  https://alicekeeler.com/2023/08/07/%F0%9F%AA%84-auto-advance-google-slides-%E2%8F%B3-slides-timer-by-claycodes/
- Teacher Tech contact: https://alicekeeler.com/contact-me/
- Control Alt Achieve guide:
  https://www.controlaltachieve.com/2016/03/countdown-timers-for-school.html
- Control Alt Achieve contact: https://www.controlaltachieve.com/p/connect.html
