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

### Output Formats

This project supports three output formats:

1. **Carousel Vertical** (630×1200px) — Default format for LinkedIn/Instagram carousels
2. **Carousel Square** (1080×1080px) — Square format for Instagram posts
3. **Twitter Resource** (1200×675px) — Single-image resource for Twitter

### Usage

```bash
# Render vertical carousel (default) → output/<project-name>/ (PNG + PDF)
npm run render content/your-deck.json

# Render square carousel → output/<project-name>/ (PNG + PDF)
node src/render.js content/your-deck.json --square

# Render Twitter resource → output/<project-name>/ (single PNG)
node src/render.js content/your-deck-twitter.json --twitter

# Custom output directory
node src/render.js content/example.json --output ./custom-output

# Additional options
node src/render.js content/example.json --format jpeg --no-pdf
```

| Option       | Description                          |
|-------------|--------------------------------------|
| `--output`  | Directory for images and PDF         |
| `--format`  | `png` (default) or `jpeg`            |
| `--no-pdf`  | Only export images, no PDF           |
| `--square`  | Render square format (1080×1080px)   |
| `--twitter` | Render Twitter resource (1200×675px) |

### Content JSON shape

#### Carousel Content (Vertical & Square)

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

#### Twitter Resource Content

Twitter resources use a different structure with `sections` instead of `slides`:

```json
{
  "resourceTitle": "Resource Title",
  "sections": [
    { "title": "Section 1", "content": "Content goes here..." },
    { "title": "Section 2", "content": "More content..." }
  ]
}
```

- **Frame reference:** [FRAME_TEMPLATES.md](./FRAME_TEMPLATES.md) — all frame types and their fields.
- **Avoid truncation & missing elements:** [CONTENT_GUIDELINES.md](./CONTENT_GUIDELINES.md) — character/line limits, checklists, and validation.

### Template Structure

Templates are organized by format:

#### Vertical Carousel (630×1200px)
- **Shell:** `templates/slide.html`
- **Frame partials:** `templates/frames/<type>.html` (e.g. `cover.html`, `outro.html`)
- **Base CSS:** `templates/css/base.css`
- **Frame CSS:** `templates/css/frames/<type>.css`

#### Square Carousel (1080×1080px)
- **Shell:** `templates/slide-square.html`
- **Frame partials:** `templates/frames-square/<type>.html`
- **Base CSS:** `templates/css/base-square.css`
- **Frame CSS:** `templates/css/frames-square/<type>.css`

#### Twitter Resource (1200×675px)
- **Shell:** `templates/twitter-resource.html`
- **CSS:** `templates/css/twitter-resource.css`

Each carousel format uses **per-frame templates**: each frame type has its own HTML partial and CSS file. The renderer inlines base CSS + only the CSS for frame types used in the deck.

To add or change a frame: edit or create the HTML partial and CSS file in the appropriate directory for your format.

### Syncing from Figma (Figma MCP)

To pull design context (HTML/CSS) from a Figma file into these templates, see **[FIGMA_MCP.md](./FIGMA_MCP.md)**. You'll need a link to your Figma frame; the agent can then call the Figma MCP and update the matching frame template.

### Fonts

- The default template uses **Ubuntu** (and Inter) from Google Fonts (requires network when rendering).
- For brand fonts: add a `fonts/` folder, add `@font-face` in `templates/slide.css`, and (optionally) document in the template comment.

### Pros & cons

- **Pros:** Full layout control, deterministic output, templates in Git, CI-friendly (e.g. generate on every PR).
- **Cons:** You handle layout rules (line breaks, overflow); typography needs care (font embedding, fallbacks).
