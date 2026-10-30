# Chrome Web Store listing

Copy-paste source for every field in the
[Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).

**Editing this file does not update the public store listing.** Upload the 1.2.1 package and publish the listing through the dashboard.
The manifest supplies the new name and short description. Dashboard publication is a separate step.

Fields are listed in the order the dashboard shows them. Character limits are the store's.

## Package

Upload `dist/meeting-timer-overlay-<version>.zip` from `npm run build`.

## Store listing tab

### Product details

**Title** (from the manifest, max 75): `Meeting Timer for Google Slides`

**Tagline** (marketing copy; included in the detailed description):

> Keep time. Keep the agenda moving.

**Summary / short description** (from the manifest, 72 characters):

> Make time visible for every speaker and topic, and know when to move on.

**Description** (max 16,000; plain text):

```text
Keep time. Keep the agenda moving.

Meeting Timer for Google Slides is a free, open-source Chrome extension for meetings with multiple speakers or topics and a fixed end time. Make time visible so everyone knows when to wrap up and move on.

A section can be a presentation, agenda topic, exercise, or discussion. One person can lead several topics, several people can speak within one topic, or you can mix both. Use it for workshops, panels, lessons, training sessions, board and community meetings, team updates, and other meetings already using Google Slides.

HOW IT WORKS
1. Open your Google Slides presentation in desktop Chrome and click the extension icon.
2. Scan the deck and mark the first slide of each speaker or topic section.
3. Set the meeting start time and duration, then start the session.
4. Present as usual. Reaching a marked slide switches the active section. Manual controls let you move between discussion topics while the slideshow is visible.

SHARED TIME AWARENESS
The overlay shows a whole-minute countdown and the upcoming section queue. At each transition, it divides the remaining meeting budget among the sections left. With 22 minutes and five sections remaining, the first allocation is 4.4 minutes. Finishing after two minutes leaves 20 minutes for four sections: five minutes each. Taking seven minutes leaves 15 minutes for four sections: 3.75 minutes each.

Early finishes leave more time for later items; overruns leave less. The facilitator decides when to move on. The timer does not interrupt anyone, enforce a limit, or guarantee equal total airtime. It suits comparable agenda blocks better than activities needing deliberately different fixed durations.

PRESENTATION FEATURES
• Visible countdown and section queue over your Google Slides presentation.
• Compact display after inactivity, with the fuller view returning on slide changes.
• Wrap-up and overtime indicators.
• Fullscreen slideshow support.
• Manual section navigation and optional keyboard shortcuts: Alt+Shift+N for next section, Alt+Shift+P for previous section, and Alt+Shift+O to show or hide the overlay.
• Per-presentation setup saved locally in your browser.

WORKFLOW LIMITS
Requires Google Slides in desktop Chrome. It is not a standalone overlay for arbitrary applications, and it has no native Google Meet or Zoom integration. The separate speaker-notes window is excluded. It does not detect who is speaking, automatically advance slides, or synchronize setup between organizers. Each browser or copied presentation needs its own setup.

FREE AND OPEN SOURCE
Free to use. MIT licensed. No separate account, advertising, or developer analytics backend.
Try the timing-rule simulation: https://ashual.github.io/meeting-timer-overlay/demo.html
Setup and installation: https://ashual.github.io/meeting-timer-overlay/
Source and support: https://github.com/ashual/meeting-timer-overlay

PRIVACY
Slide titles and settings stay in local browser storage. Scanning requests views of your open presentation from docs.google.com using your existing Google session.
Privacy policy: https://github.com/ashual/meeting-timer-overlay/blob/main/PRIVACY.md

Previously named Meeting Timer Overlay. This is an independent project and is not affiliated with or endorsed by Google. Google Slides is a trademark of Google LLC.
```

**Category:** `Workflow & Planning` (under Productivity)

**Language:** `English`

### Graphic assets

All files are in `store/assets/` (regenerate with `npm run store-assets`).

| Field                      | File                                   | Required size |
| -------------------------- | -------------------------------------- | ------------- |
| Store icon                 | `extension/icons/icon128.png`          | 128x128       |
| Screenshot 1               | `store/assets/screenshot-1-overlay.png` | 1280x800      |
| Screenshot 2               | `store/assets/screenshot-2-compact.png` | 1280x800      |
| Screenshot 3               | `store/assets/screenshot-3-setup.png`   | 1280x800      |
| Screenshot 4               | `store/assets/screenshot-4-wrap-up.png` | 1280x800      |
| Small promo tile           | `store/assets/promo-small-440x280.png`  | 440x280       |
| Marquee promo tile         | `store/assets/promo-marquee-1400x560.png` | 1400x560    |

The marquee tile is optional; it's only used if the store features the extension.

### Additional fields

- **Official URL:** leave as "None" unless you verify a domain in Google Search Console.
- **Homepage URL:** `https://ashual.github.io/meeting-timer-overlay/` (live).
- **Support URL:** the repository's issues page.
- **Mature content:** No.

## Privacy tab

**Single purpose description:**

> Meeting Timer for Google Slides shows a section timer and the list of upcoming speakers or topics on top of a Google Slides presentation during a meeting, splitting the remaining meeting time evenly between the sections that are left.

**Permission justifications:**

- **storage:**

  > Saves each presentation's setup (which slides start a section, section names, meeting start time and duration) and the running session locally, so the popup, the keyboard shortcuts, and the overlay in the presentation's frames all share the same state. Nothing is synced or sent anywhere.

- **Host permission** (content script on `https://docs.google.com/*`):

  > The content script draws the timer overlay on Google Slides presentations, detects which slide is showing to know when the next section starts, and, when the user clicks "Scan deck", reads the open presentation's slide titles from Google Slides. Google Slides runs fullscreen slideshows inside about:blank frames and windows it creates, which the script can only follow with match_origin_as_fallback; Chrome requires a "/*" path for that, so the match pattern can't be narrowed to /presentation/*. On any docs.google.com page that isn't a Slides presentation, the script exits immediately without reading the page.

**Are you using remote code?** No, I am not using remote code. (All JavaScript ships in the
package; the extension never evaluates fetched code.)

**Data usage.** What user data do you plan to collect from users now or in the future?

- Tick **Website content**. The extension reads slide titles from the presentation the user
  opens. It stays on the device, but ticking this is the conservative, accurate choice for a
  review because the store's definition covers data the extension handles.
- Leave every other category unticked.

Then tick all three certifications:

- I do not sell or transfer user data to third parties, outside of the approved use cases.
- I do not use or transfer user data for purposes that are unrelated to my item's single purpose.
- I do not use or transfer user data to determine creditworthiness or for lending purposes.

**Privacy policy URL:** a public link to `PRIVACY.md`, for example
`https://github.com/ashual/meeting-timer-overlay/blob/main/PRIVACY.md`.

## Distribution tab

- **Payments:** Free of charge.
- **Visibility:** Public. Choose Unlisted to share it only with people who have the link, for
  example just your team.
- **Distribution:** All regions.

## Test instructions tab (for the reviewer)

```text
1. Open any Google Slides presentation in the editor (for example, a copy of a deck with a few slides; viewing access is enough).
2. Click the extension's toolbar icon, then "Scan deck". Slide titles appear; hidden slides are left out.
3. Tick two or three slides as section starts, set Start to the current time and Duration to 10, and click "Start session".
4. Click "Slideshow" in Google Slides and move through the slides. The overlay in the top-right corner shows the countdown and highlights the current section; it advances when you reach the next ticked slide and shrinks to a slim strip after 5 seconds without slide changes.
5. Click "Stop" in the popup to remove the overlay.
No account, login, or payment is needed.
```

If you have a public demo deck, add its link in step 1 so the reviewer doesn't need their own.
