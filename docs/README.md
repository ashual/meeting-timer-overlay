# Project website

Buildless static HTML/CSS. Serve this directory with any static web server. No external
fonts, client JavaScript, analytics, cookies, package installation, or build step.
The screenshots are copies of the repository-rendered examples in `store/assets/`, not
independent user reports. Update them when the product visuals change.

## Publish with GitHub Pages

Intended URL: `https://ashual.github.io/meeting-timer-overlay/`.
It is the canonical and Open Graph URL in the four pages and in `sitemap.xml`.
Before using another host or custom domain, update every absolute site URL consistently.

After the PR is merged, in the repository's **Settings → Pages** choose **Deploy from a
branch**, branch **main**, folder **/docs**, and Save. Wait for the Pages deployment to finish.
This PR does not change repository Pages settings or publish the website itself.

Once the website actually responds at its intended public URL:

1. Check all four pages, the images, and the PPTX download on the deployed site.
2. Set the GitHub About homepage and the Chrome Web Store homepage to that URL.
3. Verify this URL-prefix property in Google Search Console. For the HTML-file verification
   method, add the exact supplied verification file to this directory, then publish it.
   An HTML meta tag on the homepage is another option if offered by Search Console.
4. Submit `https://ashual.github.io/meeting-timer-overlay/sitemap.xml` and inspect indexing.
5. Update the README's relative HTML source links to the live setup/template URLs if desired.

The sitemap lists the pages intended to be published together. No `robots.txt` is added here:
a repository subdirectory cannot set the host-root `https://ashual.github.io/robots.txt`.

The homepage includes descriptive SoftwareApplication JSON-LD with free pricing and no
invented ratings. This alone does not establish eligibility for a Google software-app rich
result. Standard crawlable content supports search and Google's AI features; there is no
claim of guaranteed ranking or AI citations.

References checked 26 October 2026:
- https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/appearance/structured-data/software-app

## Keep the content consistent

- `privacy.html` contains a verbatim copy of `../PRIVACY.md`. Update both together.
- `downloads/weekly-team-update.pptx` is an eight-slide editable deck. Bracketed text is
  intentional template content. Slide 8 is optional. Import and save as native Google Slides
  before scanning. Setup lives in local browser storage and is never embedded in the deck.
- `assets/` holds product examples and the extension icon. Keep source images unchanged when
  copying them here, and retain captions identifying illustrative meeting content.
- Run `npm run check:site` from the repository root before committing website edits.
