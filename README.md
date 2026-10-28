# Serdar Bahar’s personal website

A static academic website based on [Jon Barron’s template](https://jonbarron.info/).

## Preview locally

Open `index.html` in your browser, or run from this directory:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000. Stop the server with Ctrl+C.

## Publish on GitHub Pages

Commit and push your changes to `master`. In the repository’s **Settings → Pages**, select **Deploy from a branch**, branch **master**, folder **/ (root)**, then **Save**.

For the current repository (`serdarbahar/serdar-bahar.github.io`), the default project URL is:
https://serdarbahar.github.io/serdar-bahar.github.io/

To serve this template at https://serdarbahar.github.io/ instead, use the repository named exactly `serdarbahar.github.io` under the `serdarbahar` account. This may already host your previous website; update that repository only when you intend to replace it.

GitHub’s Settings → Pages screen shows the definitive published URL. Publication can take up to 10 minutes.

## Edit content — no build step

Open `index.html` directly in your browser, or use the local server above. Reload after editing. Content files are plain JavaScript objects with comments; retain the `window.… =` line and closing semicolon. The renderer uses text safely, so content fields should be plain text rather than HTML.

| File | What to edit |
| --- | --- |
| `content/profile.js` | Name, profile photo, biography paragraphs, and contact links in display order. Email, Twitter, Google Scholar, GitHub are prefilled; the first three are placeholders. |
| `content/authors.js` | Author directory, keyed by a unique `name-surname` ID. Set `name`, `url`, and optionally `bold: true`. |
| `content/papers.js` | Publications, in display order. Add/remove/reorder objects. |
| `index.html` | Original template structure; profile content is loaded from `content/profile.js`. |
| `stylesheet.css` | Original template styles. |
| `images/` | Your portrait and six temporary SVG mock thumbnails. |

### Edit your profile

Everything in the profile is configured in `content/profile.js`:

- `name`: displayed name, browser title, and author metadata.
- `photo.src`: image path, such as `images/serdar-bahar.jpg`, or an external image URL. Put replacement photos in `images/` and update this path.
- `photo.alt`: accessible description of the photo.
- `photo.url`: where clicking the photo goes; leave empty to open the photo itself.
- `description`: an array of paragraphs. Use plain strings for simple paragraphs. For inline links, use an array of strings and `{text, url}` parts, as shown below.
- `links`: contact links beneath the biography, separated by slashes automatically. Add, remove, or reorder entries. Empty URLs are hidden. Use `mailto:your@email.com` for email links.

Example biography and contact links:

```js
"description": [
  "A short paragraph about me.",
  ["I work at ", {"text": "My Lab", "url": "https://example.com/"}, "."]
],
"links": [
  {"label": "Email", "url": "mailto:you@example.com"},
  {"label": "Twitter", "url": "https://x.com/your_handle"},
  {"label": "Google Scholar", "url": "https://scholar.google.com/citations?user=YOUR_ID"},
  {"label": "GitHub", "url": "https://github.com/your_handle"}
]
```

### Add an author

Add an entry inside the object in `content/authors.js` (separate entries with commas). Use lowercase ASCII name-surname IDs, including all name parts: `serdar-bahar`, `bora-toprak-temir`. Keep accents in the displayed `name`:

```js
"author-name": {
  "name": "Author Name",
  "url": "https://author.example.com/"
}
```

Use that ID in each paper’s `authors` array. Update the URL here once to update every paper. Set `url` to `""` for an unlinked name. Your own name uses `bold: true`.

### Add or edit a paper

Copy an existing object in `content/papers.js` and edit:

```js
{
  "id": "unique-paper-id",
  "title": "Paper title",
  "authors": ["serdar-bahar", "author-name"],
  "venues": ["Journal Name", "Workshop Name"],
  "years": [2026, 2027],
  "awards": ["", "Spotlight"],
  "image": "images/my-paper.jpg",
  "imageAlt": "Description of the paper image",
  "links": [
    {"label": "project page", "url": "https://example.com/project"},
    {"label": "pdf", "url": "pdfs/my-paper.pdf"},
    {"label": "code", "url": ""},
    {"label": "video", "url": ""},
    {"label": "bib", "bibtex": `@article{myPaper,
  title = {Paper title},
  year = {2026}
}`}
  ],
  "description": "Optional one-sentence description.",
  "highlight": true
}
```

- `highlight: true` applies Jon Barron’s original `#ffffd0` yellow row; `false` leaves it white. Two papers are highlighted initially as examples.
- `venues`, `years`, and `awards` match by position. Each entry appears on its own line: `"venues": ["Journal Name", "ICRA"], "years": [2025, 2026], "awards": ["", "Spotlight"]` displays *Journal Name*, 2025 and *ICRA*, 2026 (Spotlight).
- Use an empty award string (`""`) for a venue without an award. Awards are optional: `"awards": []` hides all award labels. Use `"venues": []` with `"years": [2026]` to show only a year. Omitted years are left blank.
- To place the year inside a conference name, use `{year}`: `"IROS {year} RoBoWoMo Workshop"` with year `2026` and award `"Best Paper Award"` renders *IROS 2026 RoBoWoMo Workshop* (Best Paper Award). The year is not repeated afterward. Venue names without `{year}` keep the journal format: *Journal Name*, 2026.
- Links appear below the venues/years with slash separators. Add any labels you need; empty URLs are hidden. For a downloadable `.bib` file instead of a toggle, use another label such as `"citation file"` with a normal URL.
- A link entry with `label: "bib"` and a `bibtex` text field adds a button styled as a link. Clicking it shows/hides the citation below the link row. Both `bib` and `bibtex` labels work. Use backticks for multiline BibTeX; empty citations are hidden. RAMPA includes a filled example.
- `{"label": "pdf", "url": "pdfs/my-paper.pdf"}` opens a PDF in a new tab. Put local files in a `pdfs/` folder, or use an external PDF URL.
- Paper titles are plain text. Put resource URLs in `links`. `description: ""` hides the description.
- Replace the mock SVG image path with a real figure when ready. Thumbnails use the template’s 160px width.
- Optional `hoverImage` sets an animated thumbnail: `"image": "images/task_par-still.png", "hoverImage": "images/task_par.gif"`. The still image appears normally; hovering the paper row or focusing its thumbnail/links plays the GIF. Leaving the row and moving focus away restores the still. Omit `hoverImage` for ordinary images.
- Set `autoplay: true` to also play the animation on page load. The Task Parameter paper uses `images/task_par-once.gif`, a single-play copy of the original GIF: it runs once, holds its final frame, and replays on a new hover or keyboard focus. Leaving the row restores the still thumbnail. The original GIF is preserved. For other GIFs, their embedded loop setting determines whether they play once or repeat.
- The public site loads the content files directly, so committing and pushing content edits is sufficient. No package manager or generation command is needed. JavaScript must be enabled.

### Link sources

Verified paper links were taken from [arXiv](https://arxiv.org/), the [RAMPA project](https://rampa-robot.github.io/), [Emre Uğur’s paper archive](https://emreugur.org/), and the [MTI article](https://www.mdpi.com/2414-4088/9/3/27). Author websites were taken from the [CoLoRs directory](https://colors.cmpe.boun.edu.tr/people/), [Matteo Saveriano’s homepage](https://matteosaveriano.weebly.com/), and [Yukie Nagai’s lab](https://developmental-robotics.jp/en/members/yukie_nagai/). Unverified author URLs are blank.

Unused publications, media, bibliography files, and demo-project folders inherited from the original template have been removed. The original stylesheet is retained. The inherited custom domain was removed.
