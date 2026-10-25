# Search visibility: next actions

Checked 26 October 2026. All six website pages, the sitemap, stylesheet, and editable deck are live.
All six pages have matching canonical URLs and no noindex directive was found in the
page metadata or response headers. Public availability does not prove search indexing.

## Search Console ownership

Ownership was verified on 26 October 2026 using Google’s HTML-tag method. The verification
tag is published in `docs/index.html`; retain it so ownership can be rechecked. The following
steps are retained as a reference for recovery or additional verification methods.

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
| Google Slides meeting timer for speakers and topics | `/` | Fixed meeting deadline, shared time awareness, speaker/topic sections, installation and limits |
| How to time speakers and agenda topics in Google Slides | `/setup.html` | Scan, mark sections, schedule, sharing-surface checks and recovery |
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

Search Console currently reports that aggregate data is processing. Before the first
indexing request, the homepage inspection said URL is unknown to Google. Requests to crawl
are recorded separately from confirmed indexing. Store analytics and meeting-use metrics
were not accessed. Site visits and UTM strings do not establish installs or real meeting
use. Keep private pilot details outside this public repository. Leave unobserved metrics unknown.

## Sources

- Ownership: https://support.google.com/webmasters/answer/9008080
- AI features and website eligibility:
  https://developers.google.com/search/docs/appearance/ai-features
- Sitemap submission:
  https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap

## 26 October 2026 Search Console setup

- URL-prefix property created for `https://ashual.github.io/meeting-timer-overlay/`.
- Ownership verification succeeded using the published HTML tag.
- Indexing requested for the homepage, setup guide, interactive demo, and meeting agenda.
  Google confirmed addition of all four URLs to its priority crawl queue.
  Each inspection initially reported that the URL was unknown to Google; queue acceptance
  is not confirmation that the pages are indexed.
- Sitemap submitted and retried once after its first fetch error. The Sitemaps report
  still displayed “Couldn’t fetch” during this session. This is not recorded as success.
- Google’s live URL test of the exact sitemap URL succeeded: Crawl allowed = Yes,
  Page fetch = Successful, Indexing allowed = Yes. The public URL returns valid XML
  with HTTP 200. The host-root robots.txt returns 404; no blocking rule was found.
- The Manual actions report says “No issues detected”.
- Recheck sitemap processing after Google’s next fetch; no root cause was established
  for the report error, and no indexing or search-traffic gain is claimed.
