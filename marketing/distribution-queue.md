# Free distribution queue

Prepared 26 October 2026. These are researched opportunities and ready-to-use drafts, not
completed submissions or endorsements. Nothing has been sent. The demo and agenda URLs below
become available after the associated PR is merged and Pages finishes deploying.

## Order of work

1. Merge the interactive-demo PR; verify the two new public pages.
2. Verify Search Console and submit the sitemap (see `search-visibility.md`).
3. Run one real meeting; confirm the store build and capture a real walkthrough.
4. Publish the maker's LinkedIn post and Show HN while the maker can answer questions.
5. Submit AlternativeTo; treat its review queue separately from publication.
6. Try two relevant editorial pitches. Product Hunt is optional after pilot feedback.

Prioritize organizer feedback over launch votes. No paid placements, hunters, ads, or
submission fees are included. If any route requires payment, skip it.

## Five researched opportunities

| Priority | Destination | Why it fits | Verified route / requirement | Status |
| --- | --- | --- | --- | --- |
| 1 | Show HN | The open-source extension has a concrete implementation and an allocation tradeoff to discuss. The browser simulation reduces installation friction. | Submit at https://news.ycombinator.com/submit using a personal account. Explain the actual extension, disclose the simulation's scope, and be available to discuss it. Do not ask for votes. | Draft below; not submitted |
| 2 | AlternativeTo | A directory entry can explain the multi-presenter workflow to people comparing timer software. | User menu → Suggest new application. Verified email required; entries go through moderation. Check for an existing entry before creating another. | Listing fields below; not submitted |
| 3 | Teacher Tech / Alice Keeler | Her own guide covers ClayCodes Slides Timer and auto-advance, so a presenter-section timer is a specific adjacent use case. Classroom fit is a hypothesis, not validated. | Public contact page: https://alicekeeler.com/contact-me/. It is primarily a professional-services contact route, not a promise to review unsolicited software. Confirm editorial suitability before sending. | Tailored pitch below; not sent |
| 4 | Control Alt Achieve / Eric Curts | His own countdown-timer guide discusses free timers and Google tools. The article is from 2016; its age lowers confidence in a new pitch. | Public Connect page: https://www.controlaltachieve.com/p/connect.html. No free editorial submission program was established in this research. | Tailored pitch below; not sent |
| 5 | Product Hunt | A broad maker audience can try the example and install the released extension. Less specific than reaching recurring-meeting organizers. | Personal account; new accounts must complete onboarding. Self-hunting is supported. Submit a direct product URL. | Fields below; not submitted |

Evidence that a publisher covered a relevant topic is evidence of fit only. It does not
mean they are accepting pitches, promising coverage, or endorsing this project. No private
email addresses or inferred recipient identities are included.

## Show HN: ready to submit after deployment

Title: Show HN: A Google Slides timer that reallocates time between presenters

URL: https://github.com/ashual/meeting-timer-overlay

First comment:

I built a free Chrome extension for team updates where several people share one Google Slides
deck. Mark the first slide of each speaker's section, set the meeting start and duration, and
present as usual. Reaching a marked slide switches the active speaker automatically.

At each handoff, the allocation is the remaining meeting time divided by the presenters left.
With 22 minutes and five sections, the first gets 4:24. If they finish after two minutes, the
next gets 5:00; if they take seven minutes, the next gets 3:45. This shares the remaining budget
rather than guaranteeing equal airtime. It doesn't stop a speaker or advance slides for you.

You can try that rule without installing:
https://ashual.github.io/meeting-timer-overlay/demo.html
The page is a click-driven simulation using the extension's schedule code; it doesn't connect
to Slides. The actual extension follows your deck and real clock.

MIT licensed. Settings stay in local browser storage. No developer backend or analytics.
Scanning requests the open presentation's views from Google using your existing session.

I'd especially like feedback on whether the allocation model fits real team updates, and
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
- Short description: A Google Slides timer that follows presenter sections and divides the
  remaining meeting time among speakers still waiting.

Long description:

Meeting Timer Overlay is a free, open-source Chrome extension for meetings with multiple
presenters using one Google Slides deck. Scan the deck, mark each presenter's first slide,
and set the meeting start and duration. During the audience-facing slideshow, an overlay
shows the current timer and speaker queue. Section changes recalculate the remaining budget.

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

Tagline: A Google Slides timer that follows each presenter

Description: Free, open-source Chrome timer for shared Google Slides decks. Mark each speaker's
first slide; the timer switches sections and shares the time left. Try the browser simulation
before installing. No separate account.

Website: https://ashual.github.io/meeting-timer-overlay/

Download: https://chromewebstore.google.com/detail/meeting-timer-overlay/cdllfbfpncendlekbbaepmmohdcciihc

Pricing: Free

First comment:

I built this for the awkward moment when the last presenter inherits everyone else's overrun.
The extension makes that remaining budget visible and recalculates it at each slide-section
handoff. It doesn't promise equal airtime or interrupt anyone. There's also a browser simulation
so you can try the allocation rule before installing. I'd love feedback from organizers of
weekly updates, lab meetings, or shared-deck demos after one real meeting.

Use the repository's product screenshots, clearly described as illustrative. A real recording
is still needed for the proposed walkthrough video. No pilot results or testimonials are
claimed. The description is below the documented 260-character limit; recheck current fields
in the submission UI.

## Editorial pitch: Alice Keeler

Subject: A presenter-section timer alongside your Google Slides timer guide

Hi Alice,

Your guide to ClayCodes Slides Timer explains the fixed countdown and auto-advance workflow.
I built a free, MIT-licensed Chrome extension for a different case: several presenters sharing
one Google Slides deck. You mark each person's first slide; the overlay switches speaker
sections and recalculates a share of the remaining meeting time at each handoff.

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
open-source extension for a specific related situation: multiple people presenting from one
Google Slides deck.

The timer follows marked speaker sections. At each handoff it divides the time left among
presenters still waiting, so an early finish gives the next people more time and an overrun
leaves them less. It doesn't enforce a speaking limit or auto-advance slides.

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
