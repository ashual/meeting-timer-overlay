# Search visibility: next actions

Checked 26 October 2026. The existing homepage, setup, template, privacy, sitemap, stylesheet,
and deck returned HTTP 200. This proves public availability, not search indexing.
The interactive demo and meeting agenda are prepared in a separate PR.

## Search Console ownership

The current connected tools cannot manage Search Console. An owner must complete the account
verification flow; no ownership or indexing has been claimed.

1. Open https://search.google.com/search-console/about and add a URL-prefix property for
   `https://ashual.github.io/meeting-timer-overlay/` (include HTTPS and the project path).
2. Use a verification method offered by the wizard. HTML tag verification is convenient for
   this project because the token can be placed in the homepage's `<head>`. Keep any existing
   owners' verification tokens. Do not invent a token or add a placeholder tag.
3. For HTML-file verification, publish the exact supplied file at the exact URL the wizard
   requests. A project Pages site controls the project path, not necessarily the host root.
   If Google asks for a location outside that path, use the HTML-tag method instead.
4. After the tag/file is publicly deployed, click Verify in Search Console. Retain the token
   so verification can be rechecked later.
5. Submit `https://ashual.github.io/meeting-timer-overlay/sitemap.xml` under Sitemaps.
6. Inspect the homepage and setup URL. After merging the demo PR, inspect the two new pages.
   Request indexing where offered; a request does not guarantee indexing or placement.

## Content map

These are intent hypotheses, not measured keyword volumes or promised rankings.

| Search intent | Page | Useful original content |
| --- | --- | --- |
| Google Slides meeting timer | `/` | Product workflow, examples, installation, actual limitations |
| How to add a Google Slides timer for multiple presenters | `/setup.html` | Scan, mark sections, schedule, sharing-surface checks and recovery |
| Weekly team update slide template | `/weekly-update-template.html` | Editable PPTX plus import and per-browser setup instructions |
| Try a meeting timer / remaining-time allocation | `/demo.html` | Working interactive model with early finish, overtime and custom setups |
| 30-minute weekly team meeting agenda | `/weekly-team-meeting.html` | Specific 22-minute presenter block and a protected discussion buffer |

## AI discovery / GEO

Keep the timing rule and limitations in visible text, and keep the site, repository and
store listing consistent. The demo offers an original example people can inspect and link to.
Google's AI features guidance says normal search eligibility and helpful content remain the
foundation; it does not require special AI text files or special schema. No AI citations,
rankings, or inclusion in answers are guaranteed.

Do not turn the creator queue into mass link requests. An accurate mention on a relevant
independent guide is useful evidence only when the creator actually chooses to cover the tool.

## Baseline to record after verification

Record the same date range for each observation:
- Which of the five product/help pages are indexed; log any exclusion reason.
- Search impressions, clicks and queries using the reports available in the account.
- Store listing visits and installs from the actual Chrome Web Store dashboard.
- Organizers confirming first meetings and repeat meetings, counted separately.

None of those account metrics were accessed in this batch. Site visits and UTM strings do
not establish extension installs or real meeting use. Keep private pilot details outside
this public repository. Leave unobserved metrics unknown.

## Sources

- Ownership: https://support.google.com/webmasters/answer/9008080
- AI features and website eligibility:
  https://developers.google.com/search/docs/appearance/ai-features
- Sitemap submission:
  https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
