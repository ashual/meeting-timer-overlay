# Chrome Web Store listing

Copy-paste source for every field in the
[Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole). Fields
are listed in the order the dashboard shows them. Character limits are the store's.

## Package

Upload `dist/meeting-timer-overlay-<version>.zip` from `npm run build`.

## Store listing tab

### Product details

**Title** (from the manifest, max 75): `Meeting Timer Overlay`

**Summary** (from the manifest, max 132):

> A calm, fair turn timer for Google Slides meetings: splits the time left evenly and shows whose turn it is.

**Description** (max 16,000; plain text):

```text
Keep your weekly round of updates fair, without being the one who interrupts.

Meeting Timer Overlay adds a small, calm card to the corner of your Google Slides presentation. It shows a countdown for whoever is presenting and the list of everyone who's up, so the whole room can see whose turn it is and how much time is left. Nobody has to watch the clock.

HOW THE TIME IS SPLIT
Every section gets an equal share of the time that's actually left when it begins:
time for this section = time left in the meeting / sections left.
With 22 minutes left and 5 people, the first person gets 4.4 minutes. If they finish after 2 minutes, the next person gets 20 / 4 = 5 minutes. Short updates give time back to everyone after them; long ones take it from the people still waiting, and the timer shows it.

WHAT YOU SEE
• A whole-minute countdown, with no seconds ticking, so it never feels stressful.
• Every section in slide order: finished ones are checked, the current one is highlighted, and upcoming ones wait.
• How many sections are left.
• When a turn runs out, a calm amber "Wrap up". More than a minute over, the extra minutes count with a minus sign, in red, fading slowly in and out.
• After a few seconds without a slide change, the card shrinks to a slim strip with just the minutes, sections left, and progress dots. The next slide change brings it back.
• A see-through design that stays readable on light, dark, or busy slides.

IT FOLLOWS YOUR SLIDES
You never touch the timer during the meeting. Tick the slide where each person's part starts; when you reach that slide, their turn begins. Detail slides in between belong to the current person, going back through slides leaves the turn as it is, and jumping ahead marks skipped sections as done. Alt+Shift+P returns to the previous section and recalculates the time left.

SET UP IN UNDER A MINUTE
1. Open your deck and click the extension icon.
2. Click "Scan deck". Slide titles are listed for you, and hidden (skipped) slides are left out.
3. Tick where each section starts, set the meeting's start time and duration, and click "Start session".
4. Present as usual.
Your setup is saved per presentation, so next week you just rescan and start.

MADE FOR PRESENTING
• The overlay never takes focus or clicks: keep clicking or using arrow keys to change slides.
• Works in fullscreen slideshows.
• Optional shortcuts: Alt+Shift+N advances to the next section, Alt+Shift+P returns to the previous section and recalculates the time left, Alt+Shift+O shows or hides the overlay.

PRIVATE BY DESIGN
No accounts, no servers, no analytics. Your slide titles and settings stay in your browser. The extension only reads Google Slides pages you open.

Meeting Timer Overlay is an independent project and isn't affiliated with or endorsed by Google. Google Slides is a trademark of Google LLC.
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
- **Homepage URL:** the repository's public page.
- **Support URL:** the repository's issues page.
- **Mature content:** No.

## Privacy tab

**Single purpose description:**

> Meeting Timer Overlay shows a fair turn timer and the list of presenters on top of a Google Slides presentation during a meeting, splitting the remaining meeting time evenly between the sections that are left.

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
`https://github.com/<owner>/meeting-timer-overlay/blob/main/PRIVACY.md`.

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
