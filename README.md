# Quadri Busari AI Evaluation Portfolio

Single-page portfolio built with semantic HTML, modular CSS, and vanilla JavaScript.

## Content accuracy

The portfolio states two years of AI evaluation experience. The response comparison includes a sample prompt, source text, and the reason for the preference. Downloadable work samples describe annotation methods and example decisions.

Publish performance figures and credentials only with supporting records. Keep sample scenarios clearly identified as examples.

## Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)
- System fonts and CSS motion
- Native scrolling and a keyboard-accessible work gallery

The current page has no external font or animation dependencies. The earlier Three.js background source is retained but is not loaded by the page.

## Work sample downloads

The work section links to five one-page PDFs and five editable Word documents. The combined archive at `assets/samples/Quadri_Busari_Annotation_Samples.zip` includes all ten files. The CV remains a separate download.

CV links point to `assets/cv/Busari_Quadri_CV.pdf`. The experience section follows the owner's selected CV. Python and its libraries are omitted, and Micro1 is the only listed certification. The contact address is `bqlekan@gmail.com`.

Sample sources and scenarios are clearly identified as examples. The documents use plain wording and ordinary punctuation, without unsupported performance claims.

## Local Development

1. Open the project folder in VS Code.
2. Start a local server from project root:

```powershell
& "C:\Program Files\nodejs\npx.cmd" --yes http-server . -p 4173 -c-1
```

3. Visit `http://127.0.0.1:4173/index.html`.

## Production Checklist

- Validate semantic HTML and ARIA labels.
- Validate keyboard navigation and focus visibility.
- Validate reduced motion behavior.
- Validate no-JS fallback behavior for navigation and core content visibility.
- Validate SEO metadata, canonical URL, robots, sitemap, and JSON-LD.
- Validate Lighthouse categories on desktop and mobile.

## Lighthouse Command

```powershell
Set-Location "c:\Users\Quasars\OneDrive\Documents\AI-Evaluation_Portfolio"
New-Item -ItemType Directory -Path ".lighthouse-tmp" -Force | Out-Null
$env:TEMP = (Resolve-Path ".lighthouse-tmp").Path
$env:TMP = $env:TEMP
& "C:\Program Files\nodejs\npx.cmd" --yes lighthouse "http://127.0.0.1:4173/index.html" --only-categories=performance,accessibility,best-practices,seo --no-enable-error-reporting --output=html --output=json --output-path="./lighthouse-report" --chrome-flags="--headless --disable-gpu --no-sandbox"
```

## Security Notes

- External links that open new tabs include `rel="noopener noreferrer"`.
- No secrets are stored in source files.
- Contact form currently opens a prefilled email draft via `mailto:` as a progressive fallback. Replace this with a server-backed endpoint when a production inbox workflow is available.
- Prefer self-hosting third-party JS files for stricter supply-chain control in production.

## Recommended Security Headers (Deployment)

Use your hosting platform to add headers such as:

- `Content-Security-Policy`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `Strict-Transport-Security`

Example CSP starter (adjust for your final host and asset strategy):

```text
default-src 'self';
script-src 'self' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com data:;
img-src 'self' data:;
connect-src 'self';
frame-ancestors 'none';
base-uri 'self';
form-action 'self';
```

## Browser Support

Browser support targets (verify on each platform before claiming support):

- Chrome, Edge, Firefox, Safari
- iOS Safari, Android Chrome

Progressive enhancement strategy ensures the portfolio remains usable if JavaScript or advanced animation features are unavailable.

## GitHub Pages Deployment

1. Push the repository to GitHub.
2. In the repository settings, enable GitHub Pages from the default branch root.
3. Keep the included `.nojekyll` file so static assets are served without Jekyll processing assumptions.
4. Confirm that `robots.txt`, `sitemap.xml`, `favicon.svg`, and canonical metadata match the deployed URL.

## Custom Domain Deployment

1. Configure the custom domain in GitHub Pages settings.
2. Add the provided domain to your DNS provider using the records required by GitHub Pages.
3. Update these files after choosing the final domain:
	- `index.html` canonical URL and structured data URL
	- `robots.txt`
	- `sitemap.xml`
4. Add a `CNAME` file only after the final domain is confirmed.
