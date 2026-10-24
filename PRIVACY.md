# Privacy policy

_Last updated: October 24, 2026_

Meeting Timer Overlay ("the extension") is a Chrome extension that shows a turn timer and a
list of sections on top of Google Slides presentations. This policy explains what data the
extension handles and what it does with it.

## The short version

The extension has no servers, no accounts, no analytics, and no advertising. Everything it
reads or saves stays in your browser on your device. It never sends your data to the
developer or to anyone else.

## What the extension reads

On Google Slides pages (`https://docs.google.com/presentation/...`) only, the extension reads:

- **The presentation's ID, title, and slide titles.** When you click **Scan deck**, the
  extension asks Google for two views of the presentation that is already open in your tab:
  the accessible HTML view (`/htmlpresent`) and the slideshow page (`/present`). These requests
  go only to `docs.google.com`, use your existing Google session in that tab, and are the same
  pages Google Slides itself serves. The extension uses them to list slide titles and to leave
  out slides you've hidden (skipped).
- **Which slide is showing** while you present, from the slideshow page's address and its
  on-screen slide number. This is how the timer knows when the next section starts.

The extension's content script also loads on other `docs.google.com` pages (a Chrome
requirement for following Slides into its slideshow frames), but there it stops immediately
without reading anything.

## What the extension saves

In `chrome.storage.local`, which lives on your device and isn't synced:

- **Per presentation:** the slide numbers and titles from the last scan, the section names you
  typed, which slides you ticked, and the meeting's start time and duration. These are saved
  so next week's setup takes seconds.
- **While a session runs:** the presentation ID and title, the section names, the meeting's
  start and end times, the current section, and whether you hid the overlay.

Clicking **Stop** deletes the running session. To delete everything, remove the extension or
clear its data from `chrome://extensions`.

## What the extension never does

- It doesn't send any data off your device, except the requests to `docs.google.com`
  described above, which only fetch your own presentation from Google.
- It doesn't sell, share, or transfer user data to third parties.
- It doesn't use or transfer user data for purposes unrelated to its single purpose: timing
  sections of a Google Slides presentation.
- It doesn't use or transfer user data to determine creditworthiness or for lending purposes.
- It doesn't load or run code from outside the extension package.

## Changes

If this policy changes, the new version will be published at this address with a new date.
Material changes will also be noted in the extension's release notes.

## Contact

Questions or concerns: open an issue in the project repository or email the developer at the
contact address listed on the extension's Chrome Web Store page.
