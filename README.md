# Carousel Automation: HTML/CSS → images & PDF

This project includes a **template-based render pipeline** so you can turn carousel content into images and a PDF without touching Figma.

### How it works

1. **Define your frame templates** as HTML/CSS in `templates/` (one "page" per frame).
2. **Fill placeholders** with content from a JSON file (e.g. `content/example.json`).
3. **Render** with headless Chromium (Playwright):
   - **JPEG or PNG** per frame (`frame-01.png`, `frame-02.png`, …)
   - **PDF** for the whole deck (one page per frame)

### Setup

```bash
npm install
npx playwright install chromium
```

### Usage

```bash
# Render example content → output/ (PNG + PDF)
npm run render

# Custom content file
npm run render content/your-deck.json

# Options
node src/render.js content/example.json --output ./build --format jpeg --no-pdf
```

| Option       | Description                          |
|-------------|--------------------------------------|
| `--output`  | Directory for images and PDF         |
| `--format`  | `png` (default) or `jpeg`            |
| `--no-pdf`  | Only export images, no PDF           |

### Content JSON shape

Each slide can specify a `type` (e.g. `cover`, `bullet-list`, `title-paragraph`, `outro`). If omitted, `title-paragraph` is used.

```json
{
  "title": "Deck title",
  "slides": [
    { "type": "cover", "author": "Name", "title": "Hook", "subtitle": "...", "swipeLabel": "Swipe for more" },
    { "type": "bullet-list", "title": "Heading", "bullets": ["Item 1", "Item 2", "Item 3"] },
    { "type": "title-paragraph", "title": "Heading", "body": "Paragraph text." },
    { "type": "outro", "ctaText": "follow for more", "supportingText": "...", "url": "https://..." }
  ]
}
```

- **Frame reference:** [FRAME_TEMPLATES.md](./FRAME_TEMPLATES.md) — all frame types and their fields.
- **Avoid truncation & missing elements:** [CONTENT_GUIDELINES.md](./CONTENT_GUIDELINES.md) — character/line limits, checklists, and validation.

Templates are **per-frame**: each frame type has its own HTML partial and CSS file.

- **Shell:** `templates/slide.html` — document shell; loops over slides and includes the right frame partial.
- **Frame partials:** `templates/frames/<type>.html` — one file per frame type (e.g. `cover.html`, `bullet-list.html`, `outro.html`). Each partial renders one `.frame` div and its content.
- **Base CSS:** `templates/css/base.css` — shared layout, fonts, `.frame`, `.frame-number`, print rules.
- **Frame CSS:** `templates/css/frames/<type>.css` — styles for that frame only. The renderer inlines base + only the CSS for frame types used in the deck.

To add or change a frame: edit or create `templates/frames/<type>.html` and `templates/css/frames/<type>.css`; keep each frame as a single `.frame` (630×1200 vertical) so the renderer can screenshot and paginate correctly.

### Syncing from Figma (Figma MCP)

To pull design context (HTML/CSS) from a Figma file into these templates, see **[FIGMA_MCP.md](./FIGMA_MCP.md)**. You'll need a link to your Figma frame; the agent can then call the Figma MCP and update the matching frame template.

### Fonts

- The default template uses **Ubuntu** (and Inter) from Google Fonts (requires network when rendering).
- For brand fonts: add a `fonts/` folder, add `@font-face` in `templates/slide.css`, and (optionally) document in the template comment.

### Pros & cons

- **Pros:** Full layout control, deterministic output, templates in Git, CI-friendly (e.g. generate on every PR).
- **Cons:** You handle layout rules (line breaks, overflow); typography needs care (font embedding, fallbacks).
