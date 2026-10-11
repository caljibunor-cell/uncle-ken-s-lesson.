# Uncle Ken's Lesson website

Open `index.html` in a browser to view the site.

## Folder structure
```
uncle-kens-lesson/
├── index.html       Page content (sections are labelled with comments)
├── css/style.css    All styling (colours at the top, then each section in page order)
└── js/script.js     Behaviour (settings at the top)
```

## Common edits
- **Phone number / WhatsApp:** search for `2348033932763` in `index.html` and `js/script.js`.
- **Receive enrolments by email:** paste your free Web3Forms key into `CONFIG.accessKey` at the top of `js/script.js`. Until then, the form opens WhatsApp.
- **Brand colours:** change the `--navy`, `--yellow` values in the `:root` block of `css/style.css`.
- **Stats numbers:** edit `data-target` in the STATS section of `index.html`.
- **Testimonials:** the three reviews are samples - replace them with real ones.

## SEO checklist (do these once the site is live)
1. **Replace the placeholder domain.** Search for `yourdomain.com` and replace it with your real website address in `index.html` (canonical, social tags, structured data), `robots.txt` and `sitemap.xml`.
2. Upload the whole folder to your host so `robots.txt` and `sitemap.xml` sit in the main folder.
3. Add the site to **Google Search Console** and submit `sitemap.xml`.
4. Create a **Google Business Profile** for Uncle Ken's Lesson (same name, address and phone as the site) so you appear on Google Maps in Asaba.
5. Replace the sample testimonials and stats with real ones before launch.
