# Frame templates reference

Each slide in your content JSON can specify a `type`. If omitted, `title-paragraph` is used (title + body + optional footer). All frames are 1200×630px.

**To avoid truncation and missing elements:** See **[CONTENT_GUIDELINES.md](./CONTENT_GUIDELINES.md)** for character limits, line limits, required-field checklists, and validation tips.

---

## 1. Structural frames

### 1. Cover / Hook (`type: "cover"`)
**Purpose:** Set context and stop the scroll. Very stable layout. Styled with Ubuntu, title color `#032911`, white background.

| Field | Required | Notes |
|-------|----------|--------|
| `title` | ✓ | Large title (aggressive font scale) |
| `author` | | Name at top (e.g. "Alexey Grigorev") |
| `subtitle` | | Optional |
| `swipeLabel` | | Bottom CTA (e.g. "Swipe for more") |
| `accent` | | Optional visual or tagline block |
| `avatarUrl` | | Optional 80×80 avatar bottom-right (with dark overlay) |
| `brandFooter` | | Brand footer |

**Rules:** 1–2 text blocks only. No dynamic lists. Easy to validate overflow.

---

### 2. Section divider (`type: "section-divider"`)
**Purpose:** Split long carousels, reset attention. e.g. “Part 1: The problem”.

| Field | Required | Notes |
|-------|----------|--------|
| `headline` or `title` | ✓ | Short headline |
| `number` | | e.g. "1" |
| `icon` | | Optional |
| `body` | | Minimal body text |

---

### 3. Outro / CTA (`type: "outro"`)
**Purpose:** Drive action. Figma style: white bg, large lowercase CTA, optional short sentence and image.

| Field | Required | Notes |
|-------|----------|--------|
| `ctaText` or `title` | ✓ | Main CTA – **lowercase**, large type, centered |
| `supportingText` | | Short sentence below CTA (Ubuntu 500) |
| `imageUrl` | | Optional screenshot/image centered below text |
| `bullets` | | Optional array |
| `handle` | | e.g. @handle |
| `logo` | | Optional |
| `url` | | Optional |

**Automation:** CTA text capped. Often reused across carousels.

---

## 2. Content frames

### 4. Title + paragraph (`type: "title-paragraph"` or default)
**Purpose:** Explain one idea clearly. Two variants for alternating carousel slides.

| Field | Required | Notes |
|-------|----------|--------|
| `title` or `heading` | ✓ | |
| `body` or `paragraph` | ✓ | 2–4 lines max |
| `variant` | | `"light"` = white bg, black text, #032911 swipe/avatar; default = dark #032911 bg, #F4F0ED text |
| `swipeLabel` | | e.g. "Swipe" – shown with optional avatar at bottom |
| `avatarUrl` | | Optional avatar (with overlay) at bottom |
| `footer` | | Optional |

**Implementation:** Enforce max character count. CSS line-clamp applied.

---

### 5. Bullet list (`type: "bullet-list"`)
**Purpose:** Enumerate ideas, steps, features.

| Field | Required | Notes |
|-------|----------|--------|
| `title` or `heading` | ✓ | Short; 1–2 lines |
| `bullets` | ✓ | Array, **3–6 items** |
| `footer` | | Optional |

**Rules:** 3–6 bullets. No nested bullets. **Up to 2 lines per bullet** (longer text is truncated). Keep each item under ~100 chars to avoid truncation.

---

### 6. Numbered steps (`type: "numbered-steps"`)
**Purpose:** Process or sequence. Visual weight on numbers.

| Field | Required | Notes |
|-------|----------|--------|
| `title` or `heading` | ✓ | |
| `steps` | ✓ | Array, **3–5 items** |
| `footer` | | Optional |

---

### 7. Definition / concept (`type: "definition"`)
**Purpose:** Explain a term or mental model. Good for educational carousels.

| Field | Required | Notes |
|-------|----------|--------|
| `term` or `title` | ✓ | The term |
| `definition` or `body` | ✓ | Short definition |
| `whyItMatters` | | Optional line |
| `footer` | | Optional |

---

## 3. Comparison and contrast frames

### 8. Two-column comparison (`type: "two-column"`)
**Purpose:** Compare A vs B.

| Field | Required | Notes |
|-------|----------|--------|
| `leftTitle` | ✓ | |
| `leftBullets` | ✓ | **Same count as right** |
| `rightTitle` | ✓ | |
| `rightBullets` | ✓ | **Same count as left** |
| `footer` | | Optional |

**Automation:** Validate symmetry at input time. Same vertical height enforced by layout.

---

### 9. Pros / Cons (`type: "pros-cons"`)
**Purpose:** Balanced evaluation.

| Field | Required | Notes |
|-------|----------|--------|
| `title` | | Default: "Pros & Cons" |
| `pros` | ✓ | Array, **3–4 items** |
| `cons` | ✓ | Array, **3–4 items** |
| `footer` | | Optional |

**Tip:** Limit to 3–4 per side to avoid overflow.

---

### 10. Before / After (`type: "before-after"`)
**Purpose:** Show transformation. Used in tooling, workflow, learning outcomes.

| Field | Required | Notes |
|-------|----------|--------|
| `beforeTitle` | | Default: "Before" |
| `beforeContent` | ✓ | |
| `afterTitle` | | Default: "After" |
| `afterContent` | ✓ | |
| `footer` | | Optional |

---

## 4. Evidence and credibility frames

### 11. Quote / testimonial (`type: "quote"`)
**Purpose:** Social proof.

| Field | Required | Notes |
|-------|----------|--------|
| `quote` | ✓ | **Hard cap or font scaling** – length varies |
| `author` | ✓ | |
| `role` | | Optional (e.g. title, source) |
| `footer` | | Optional |

---

### 12. Data / stats (`type: "data-stats"`)
**Purpose:** Support claims. One big stat + short explanation.

| Field | Required | Notes |
|-------|----------|--------|
| `stat` | ✓ | e.g. "73% of X" |
| `explanation` or `body` | ✓ | Short text |
| `footer` | | Optional (e.g. source) |

**Avoid:** Dense tables, too many numbers.

---

## 5. Visual-centric frames

### 13. Diagram / schema (`type: "diagram"`)
**Purpose:** Explain structure or flow. Pre-designed SVG or image.

| Field | Required | Notes |
|-------|----------|--------|
| `caption` | | Short caption |
| `svg` | | Inline SVG (rendered with `| safe`) |
| `imageUrl` | | Or image URL |
| `footer` | | Optional |

**Implementation:** Pre-designed asset only. Do not generate diagrams dynamically unless necessary.

---

### 14. Image + caption (`type: "image-caption"`)
**Purpose:** Visual grounding.

| Field | Required | Notes |
|-------|----------|--------|
| `imageUrl` | ✓ | **Enforce aspect ratio** in pipeline |
| `caption` | | One line |
| `footer` | | Optional |

**Automation warning:** Image aspect ratios must be enforced.

---

## 6. Meta and navigation frames

### 15. Agenda / roadmap (`type: "agenda"`)
**Purpose:** Set expectations. List of sections + optional progress.

| Field | Required | Notes |
|-------|----------|--------|
| `title` | | Default: "Agenda" |
| `sections` | ✓ | Array of section names |
| `showProgress` | | If true, shows "current / total" |
| `footer` | | Optional |

---

### 16. Recap / summary (`type: "recap"`)
**Purpose:** Reinforce retention. 3–5 key takeaways.

| Field | Required | Notes |
|-------|----------|--------|
| `title` | | Default: "Key takeaways" |
| `takeaways` | ✓ | Array, **3–5 items** |
| `footer` | | Optional |

---

## Running the example

```bash
npm run render content/frames-example.json --output output/frames
```

Existing content without `type` continues to work as **title + paragraph** (title, body, optional footer).
