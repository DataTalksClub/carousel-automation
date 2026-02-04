# Content guidelines for carousel JSON

Use this when filling the `slides` array so slides render correctly: no truncation, no missing elements, and a clear story.

**Rule of thumb:** Stay under the limits below. After editing JSON, run `npm run render -- content/your-file.json --output output/check` and look at the images/PDF to confirm nothing is cut off or missing.

**Mobile-optimized design:** Body text is set to 24pt+ (2rem/32px) following LinkedIn carousel best practices for mobile readability. This ensures content remains readable on phones in portrait mode.

---

## 1. How truncation works

Slides are **630×1200px** (vertical). Text that exceeds the allowed **lines** is cut with an ellipsis (…). The engine does **not** auto-shrink font size.

| Element type        | Max lines (approx.) | If you exceed it        |
|---------------------|---------------------|--------------------------|
| Cover title         | 2                   | Second line is cut      |
| Cover subtitle      | 3                   | Fourth line is cut      |
| Bullet list item    | 2 per bullet        | Third line is cut        |
| Title–paragraph title | 2                | Third line is cut        |
| Title–paragraph body  | 5                | Sixth line is cut        |
| Outro CTA           | 2                   | Third line is cut        |
| Outro supporting text| 4                   | Fifth line is cut        |

**Recommendation:** Keep each piece of copy short. Prefer one idea per slide.

---

## 2. Character limits (approximate)

Use these as a ceiling. Actual fit depends on word length and font. Note: Body text is now larger (2rem/24pt) for mobile optimization, so effective character counts are slightly lower than before.

### Cover (`type: "cover"`)

| Field         | Approx. max | Notes                                      |
|---------------|-------------|--------------------------------------------|
| `title`       | ~100 chars  | 2 lines; keep punchy                       |
| `subtitle`    | ~200 chars  | 3 lines; one clear sentence or two short   |
| `author`      | ~40 chars   | 1 line                                    |
| `swipeLabel`  | ~25 chars   | 1 line (e.g. "Swipe for more")            |
| `brandFooter` | ~40 chars   | 1 line                                    |

**Checklist:** At least `title`. Prefer `author` + `subtitle` + `swipeLabel` so the slide feels complete.

---

### Bullet list (`type: "bullet-list"`)

| Field     | Approx. max      | Notes                          |
|-----------|------------------|--------------------------------|
| `title`   | ~80 chars        | 1–2 lines; short heading      |
| `bullets` | 3–6 items        | **Required.** 4–5 is ideal    |
| each item | ~100 chars       | 2 lines per bullet max        |

**Checklist:** `title` + `bullets` (array with 3–6 strings). No nested bullets; one phrase or short sentence per item.

**Avoid:** Long bullets like full sentences with multiple clauses. Split into more bullets or shorten.

---

### Title + paragraph (`type: "title-paragraph"`)

| Field    | Approx. max | Notes                                      |
|----------|-------------|--------------------------------------------|
| `title`  | ~80 chars   | 2 lines max                                |
| `body`   | ~280 chars  | 4-5 lines max; 2–3 sentences is ideal (larger font for mobile) |
| `variant`| —           | Use `"light"` for white bg (alternate decks)|

**Checklist:** `title` + `body`. Add `variant: "light"` when you want a white slide instead of dark green.

**Avoid:** Long paragraphs. If the body runs over ~300 chars, shorten or split into another slide.

---

### Outro / CTA (`type: "outro"`)

| Field            | Approx. max | Notes                                  |
|------------------|-------------|----------------------------------------|
| `ctaText`        | ~70 chars   | 2 lines; clear and actionable          |
| `supportingText` | ~200 chars  | 3-4 lines; one short sentence is ideal (larger font for mobile) |
| `url`            | any        | Shown in footer; keep readable        |
| `handle`         | ~30 chars   | e.g. @username                         |

**Checklist:** `ctaText` (required). Prefer `supportingText` and either `url` or `handle` so the CTA is clear and actionable.

**Avoid:** Long CTA (e.g. two full sentences). One short line + one supporting line works best.

---

## 3. Other frame types (short reference)

- **Section divider:** `headline` or `title` (short). Optional: `number`, `body` (1–2 lines).
- **Quote:** `quote` (~250 chars / ~5 lines) + `author`. Optional: `role`.
- **Data/stats:** `stat` (short, e.g. "73%") + `explanation` (~150 chars).
- **Two-column:** `leftTitle`, `leftBullets[]`, `rightTitle`, `rightBullets[]` — **same number of bullets** on each side.
- **Pros/cons:** `pros[]` and `cons[]` — 3–4 items each; keep each item to 1–2 lines.
- **Before/after:** `beforeContent`, `afterContent` — short blocks (~150 chars each).
- **Numbered steps:** `title` + `steps[]` (3–5 items); each step 1–2 lines.
- **Definition:** `term` + `definition` (~200 chars). Optional: `whyItMatters` (1–2 lines).
- **Image + caption:** `imageUrl` (required) + `caption` (1–2 lines). Use a consistent aspect ratio.
- **Agenda:** `sections[]` (list of section names). Optional: `showProgress: true`.
- **Recap:** `takeaways[]` (3–5 items); each 1–2 lines.

---

## 4. Avoiding missing elements

1. **Cover:** Include at least `title`. Add `author` and `subtitle` so the opener is clear; add `swipeLabel` for a clear next step.
2. **Content slides:** Every slide must have the **required** fields for its `type` (see FRAME_TEMPLATES.md). Missing required fields show as "Untitled" or empty.
3. **Outro:** Always set `ctaText`. Add `url` or `handle` so people know where to go; add `supportingText` to explain sharing or next step.
4. **Alternating look:** Use `variant: "light"` on some `title-paragraph` slides so the deck alternates dark/light and stays easy to scan.
5. **Bullet count:** For bullet-list, use 3–6 items. For two-column, keep left and right bullet counts equal.

---

## 5. Quick validation before render

- [ ] Every slide has a `type` (or rely on default `title-paragraph`).
- [ ] Cover has `title`; optionally `author`, `subtitle`, `swipeLabel`.
- [ ] Every bullet-list has `title` and `bullets` (array, 3–6 items).
- [ ] Every title-paragraph has `title` and `body`.
- [ ] Outro has `ctaText`; optionally `supportingText`, `url`, or `handle`.
- [ ] No single field is obviously over the character limits above.
- [ ] Run `npm run render` and check the output folder for truncation or missing text.

For full field reference and optional fields, see **FRAME_TEMPLATES.md**.
