#!/usr/bin/env node
/**
 * HTML/CSS carousel → images + PDF
 *
 * 1. Load content from JSON (slides with title, body, footer, etc.)
 * 2. Render Nunjucks template with that content
 * 3. Use Playwright (headless Chromium) to:
 *    - Screenshot each slide as PNG/JPEG
 *    - Export the whole deck as PDF
 *
 * Usage:
 *   node src/render.js [content.json] [--output dir] [--format png|jpeg] [--no-pdf]
 */

import { chromium } from 'playwright';
import nunjucks from 'nunjucks';
import { readFileSync, mkdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const SLIDE_WIDTH = 630;
const SLIDE_HEIGHT = 1200;

const FRAME_TYPES = new Set([
  'cover', 'section-divider', 'outro', 'title-paragraph', 'bullet-list', 'numbered-steps',
  'definition', 'two-column', 'pros-cons', 'before-after', 'quote', 'data-stats',
  'diagram', 'image-caption', 'agenda', 'recap', 'default',
]);

function parseArgs() {
  const args = process.argv.slice(2);
  const contentPath = args.find((a) => !a.startsWith('--')) || join(ROOT, 'content', 'example.json');
  const outIdx = args.indexOf('--output');
  const outputDir = outIdx >= 0 ? args[outIdx + 1] : join(ROOT, 'output');
  const formatIdx = args.indexOf('--format');
  const imageFormat = (formatIdx >= 0 ? args[formatIdx + 1] : 'png').toLowerCase();
  const noPdf = args.includes('--no-pdf');
  return { contentPath: resolve(ROOT, contentPath), outputDir: resolve(ROOT, outputDir), imageFormat, noPdf };
}

function loadContent(contentPath) {
  const raw = readFileSync(contentPath, 'utf-8');
  const data = JSON.parse(raw);
  if (!data.slides || !Array.isArray(data.slides)) {
    throw new Error('Content JSON must have a "slides" array.');
  }
  data.slides.forEach((slide) => {
    const t = slide.type || 'title-paragraph';
    if (!FRAME_TYPES.has(t)) slide.type = 'title-paragraph';
  });
  return data;
}

function buildInlineCss(slides) {
  const templatesDir = join(ROOT, 'templates');
  const cssDir = join(templatesDir, 'css');
  const framesDir = join(cssDir, 'frames');
  let css = readFileSync(join(cssDir, 'base.css'), 'utf-8');
  const typesUsed = new Set(slides.map((s) => s.type || 'title-paragraph'));
  for (const type of typesUsed) {
    const path = join(framesDir, `${type}.css`);
    if (existsSync(path)) css += '\n' + readFileSync(path, 'utf-8');
  }
  return css;
}

function renderTemplate(content, inlineCss) {
  nunjucks.configure(join(ROOT, 'templates'), { autoescape: true });
  return nunjucks.render('slide.html', {
    ...content,
    title: content.title || 'Carousel',
    inlineStyles: inlineCss,
  });
}

async function renderToImagesAndPdf(html, options) {
  const { outputDir, imageFormat, noPdf } = options;
  mkdirSync(outputDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  /* Vertical frames: viewport width = frame width so layout is portrait */
  await page.setViewportSize({ width: SLIDE_WIDTH, height: SLIDE_HEIGHT });
  await page.setContent(html, {
    waitUntil: 'networkidle',
    timeout: 15000,
  });

  const frameCount = await page.locator('.frame').count();
  const ext = imageFormat === 'jpeg' ? 'jpg' : 'png';

  for (let i = 0; i < frameCount; i++) {
    const frame = page.locator('.frame').nth(i);
    await frame.scrollIntoViewIfNeeded();
    const box = await frame.boundingBox();
    if (!box) continue;
    const path = join(outputDir, `frame-${String(i + 1).padStart(2, '0')}.${ext}`);
    await page.screenshot({
      path,
      type: imageFormat,
      clip: { x: box.x, y: box.y, width: box.width, height: box.height },
    });
    console.log('Written:', path);
  }

  if (!noPdf) {
    const pdfPath = join(outputDir, 'carousel.pdf');
    await page.emulateMedia({ media: 'print' });
    await page.evaluate(() => document.fonts.ready);
    await page.pdf({
      path: pdfPath,
      width: `${SLIDE_WIDTH}px`,
      height: `${SLIDE_HEIGHT}px`,
      printBackground: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
      preferCSSPageSize: true,
    });
    console.log('Written:', pdfPath);
  }

  await browser.close();
}

async function main() {
  const { contentPath, outputDir, imageFormat, noPdf } = parseArgs();

  const content = loadContent(contentPath);
  const inlineCss = buildInlineCss(content.slides);
  const html = renderTemplate(content, inlineCss);

  await renderToImagesAndPdf(html, { outputDir, imageFormat, noPdf });
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
