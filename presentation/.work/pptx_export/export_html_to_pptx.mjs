import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const require = createRequire(import.meta.url);
const { chromium } = require("/Users/Toby_top/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright-core");

const ROOT = "/Users/Toby_top/Documents/Github-repo/BPAHK-Project";
const PRESENTATION_DIR = path.join(ROOT, "presentation");
const HTML = path.join(PRESENTATION_DIR, "IDBLOOM_frontend_slides.html");
const OUT_DIR = path.join(PRESENTATION_DIR, ".work/pptx_export");
const SHOT_DIR = path.join(OUT_DIR, "screenshots");
const FINAL = path.join(PRESENTATION_DIR, "IDBLOOM_浅色演示版_9页.pptx");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const W = 1920;
const H = 1080;

const notes = [
  "Opening thesis: IDBLOOM helps homemakers translate daily work into recognized identity and market opportunities.\n[Sources] README.md; original prompt; IDBLOOM_frontend_slides.html.",
  "Core problem: Homemakers are not lacking ability; their work lacks market translation.\n[Sources] README.md; original prompt; IDBLOOM_frontend_slides.html.",
  "Product flow: daily input -> skill extraction -> Identity Passport -> Demand Delivery.\n[Sources] README.md; original prompt; IDBLOOM_frontend_slides.html.",
  "Demo story: kitchen reset example used to show skill extraction and local demand packaging.\n[Sources] README.md; presentation/assets/idbloom-kitchen.png; IDBLOOM_frontend_slides.html.",
  "Market routing: one identity passport can support content, products, offline services, and knowledge services.\n[Sources] README.md; IDBLOOM_frontend_slides.html.",
  "Comparison: other fields already monetize personal uniqueness; homemakers need identity translation.\n[Sources] README.md; IDBLOOM_frontend_slides.html.",
  "Model and trust: user value, platform revenue, validation KPIs, and privacy safeguards.\n[Sources] README.md; IDBLOOM_frontend_slides.html.",
  "Closing claim: AI should reveal hidden labor value, not only replace labor.\n[Sources] README.md; presentation/assets/idbloom-demand-output.png; IDBLOOM_frontend_slides.html.",
  "AI acknowledgement: transparency page based on competition requirement and team AI usage statement.\n[Sources] README.md; user-provided acknowledgement reference image; IDBLOOM_frontend_slides.html.",
];

async function bytes(file) {
  const buf = await fs.readFile(file);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

async function captureSlides() {
  await fs.mkdir(SHOT_DIR, { recursive: true });
  const browser = await chromium.launch({ executablePath: CHROME, headless: true });
  const page = await browser.newPage({ viewport: { width: W, height: H, deviceScaleFactor: 1 } });
  await page.goto(pathToFileURL(HTML).href, { waitUntil: "networkidle" });
  await page.addStyleTag({
    content: ".deck-controls,.edit-hotzone,.edit-toggle,.edit-status{display:none!important}",
  });
  await page.waitForTimeout(800);
  const count = await page.locator(".slide").count();

  for (let i = 0; i < count; i += 1) {
    await page.evaluate((index) => {
      const slides = Array.from(document.querySelectorAll(".slide"));
      slides.forEach((slide, n) => {
        slide.classList.toggle("active", n === index);
        slide.classList.toggle("visible", n === index);
      });
      document.getElementById("slideCounter").textContent = `${index + 1} / ${slides.length}`;
    }, i);
    await page.waitForTimeout(1400);
    await page.screenshot({
      path: path.join(SHOT_DIR, `slide-${String(i + 1).padStart(2, "0")}.png`),
      fullPage: false,
    });
  }
  await browser.close();
  return count;
}

async function buildPptx(count) {
  const presentation = Presentation.create({ slideSize: { width: W, height: H } });
  for (let i = 0; i < count; i += 1) {
    const slide = presentation.slides.add();
    const file = path.join(SHOT_DIR, `slide-${String(i + 1).padStart(2, "0")}.png`);
    slide.images.add({
      blob: await bytes(file),
      contentType: "image/png",
      alt: `IDBLOOM slide ${i + 1}`,
      fit: "cover",
      position: { left: 0, top: 0, width: W, height: H },
    });
    slide.speakerNotes.textFrame.setText(notes[i] || "[Sources] IDBLOOM_frontend_slides.html.");
    slide.speakerNotes.setVisible(true);
  }
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(FINAL);
  return presentation;
}

async function renderCheck(presentation) {
  const renderDir = path.join(OUT_DIR, "rendered");
  await fs.mkdir(renderDir, { recursive: true });
  for (const [index, slide] of presentation.slides.items.entries()) {
    const png = await presentation.export({ slide, format: "png", scale: 1 });
    await fs.writeFile(path.join(renderDir, `slide-${String(index + 1).padStart(2, "0")}.png`), new Uint8Array(await png.arrayBuffer()));
  }
  const montage = await presentation.export({ format: "webp", montage: true, scale: 1 });
  await fs.writeFile(path.join(OUT_DIR, "montage.webp"), new Uint8Array(await montage.arrayBuffer()));
}

async function main() {
  const count = await captureSlides();
  const presentation = await buildPptx(count);
  await renderCheck(presentation);
  console.log(`Exported ${count} slides to ${FINAL}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
