import fs from "node:fs/promises";
import path from "node:path";
import { FileBlob, PresentationFile, fr, fixed } from "@oai/artifact-tool";

const SRC = "/Users/Toby_top/Library/Containers/com.tencent.xinWeChat/Data/Documents/xwechat_files/wxid_0h5cp9vmng5n12_b23f/temp/RWTemp/2026-08/a87b75edc5e806df6c054247a5e89246/212(1).pptx";
const OUT = "/Users/Toby_top/Documents/Github-repo/BPAHK-Project/IDBLOOM_8页精简版.pptx";
const TMP = "/Users/Toby_top/Documents/Github-repo/BPAHK-Project/.codex_tmp_idbloom_deck_work";
const KITCHEN = "/Users/Toby_top/Documents/Github-repo/BPAHK-Project/assets/idbloom-kitchen.png";
const DEMAND_IMG = path.join(TMP, "template-inspect/assets/ppt/media/image24.png");

const W = 1920;
const H = 1080;
const YELLOW = "#ffe21a";
const BLACK = "#111111";
const RED = "#f40000";
const TEAL = "#16a085";
const MINT = "#a8dfd0";
const PURPLE = "#7b55d9";
const GRAY = "#66706d";
const FONT_SCALE = 1.15;

const slidesMap = [1, 6, 7, 9, 14, 19, 22, 24];
const timings = [
  "0:00-0:35",
  "0:35-1:15",
  "1:15-2:05",
  "2:05-3:05",
  "3:05-4:10",
  "4:10-5:00",
  "5:00-5:55",
  "5:55-6:30",
];

async function bytes(file) {
  const buf = await fs.readFile(file);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}

function slidesOf(presentation) {
  return Array.isArray(presentation.slides.items)
    ? presentation.slides.items
    : Array.from({ length: presentation.slides.count }, (_, i) => presentation.slides.getItem(i));
}

function keepDottedBackground(slide) {
  for (const shape of [...slide.shapes.items]) {
    const p = shape.position || {};
    const isDotTile =
      String(shape.name || "").startsWith("Freeform") &&
      Math.abs((p.width || 0) - 308.43) < 3 &&
      Math.abs((p.height || 0) - 308.43) < 3;
    if (!isDotTile) shape.delete();
  }
  for (const image of [...slide.images.items]) slide.images.deleteById(image.id);
  for (const table of [...slide.tables.items]) slide.tables.deleteById(table.id);
  for (const chart of [...slide.charts.items || []]) chart.delete?.();
}

function box(slide, left, top, width, height, fill = "white", line = "#d8d8d8", radius = 0) {
  return slide.shapes.add({
    geometry: radius ? "roundRect" : "rect",
    position: { left, top, width, height },
    fill,
    line: { style: "solid", fill: line, width: 2 },
    borderRadius: radius,
  });
}

function text(slide, value, left, top, width, height, opts = {}) {
  const t = slide.shapes.add({
    geometry: "textbox",
    position: { left, top, width, height },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  t.text = value;
  t.text.style = {
    typeface: opts.typeface || "Arial",
    fontSize: Math.round((opts.size || 32) * FONT_SCALE),
    bold: opts.bold ?? false,
    italic: opts.italic ?? false,
    color: opts.color || BLACK,
    alignment: opts.align || "left",
    verticalAlignment: opts.valign || "top",
    lineSpacing: opts.lineSpacing || 1.08,
    insets: { top: 2, right: 2, bottom: 2, left: 2 },
  };
  return t;
}

function title(slide, value) {
  const brush = box(slide, 650, 68, 620, 82, YELLOW, YELLOW, 12);
  brush.rotation = -1.8;
  text(slide, value, 550, 82, 820, 70, {
    size: 34,
    bold: true,
    italic: true,
    align: "center",
    typeface: "Arial Black",
  }).bringToFront();
}

function footer(slide, i) {
  text(slide, `Time: ${timings[i]} | Slide ${i + 1}/8`, 1420, 1014, 360, 34, {
    size: 18,
    color: "#777777",
    align: "right",
  });
  text(slide, "IDBLOOM | BPA Topic 3 Labor Identity", 140, 1014, 520, 34, {
    size: 18,
    color: "#777777",
  });
}

function bullet(slide, value, x, y, w, opts = {}) {
  text(slide, "•", x, y, 28, 38, { size: opts.size || 30, bold: true, color: opts.dot || BLACK });
  return text(slide, value, x + 34, y + 2, w - 34, opts.height || 44, {
    size: opts.size || 28,
    bold: opts.bold || false,
    color: opts.color || BLACK,
    lineSpacing: 1.05,
  });
}

function arrow(slide, x1, y1, x2, y2, color = BLACK, width = 5) {
  return slide.shapes.add({
    geometry: "connector",
    position: { left: Math.min(x1, x2), top: Math.min(y1, y2), width: Math.abs(x2 - x1), height: Math.abs(y2 - y1) || 1 },
    line: { style: "solid", fill: color, width },
    connector: { from: { x: x1, y: y1 }, to: { x: x2, y: y2 } },
    head: { type: "triangle", width: "med", length: "med" },
  });
}

function rightArrow(slide, x, y, width = 70, height = 22, color = BLACK) {
  return slide.shapes.add({
    geometry: "rightArrow",
    position: { left: x, top: y, width, height },
    fill: color,
    line: { style: "solid", fill: color, width: 0 },
  });
}

function note(slide, lines) {
  slide.speakerNotes.textFrame.setText(lines.join("\n"));
  slide.speakerNotes.setVisible(true);
}

function roundedLabel(slide, label, x, y, w, h, fill = "#f6f6f6", stroke = "#222222", color = BLACK) {
  const s = box(slide, x, y, w, h, fill, stroke, 16);
  s.text = label;
  s.text.style = {
    typeface: "Arial",
    fontSize: Math.round(25 * FONT_SCALE),
    bold: true,
    color,
    alignment: "center",
    verticalAlignment: "middle",
    insets: { top: 4, right: 8, bottom: 4, left: 8 },
  };
  return s;
}

function line(slide, x1, y1, x2, y2, color = BLACK, width = 3) {
  return slide.shapes.add({
    geometry: "line",
    position: { left: x1, top: y1, width: x2 - x1, height: y2 - y1 },
    fill: "none",
    line: { style: "solid", fill: color, width },
  });
}

async function main() {
  const presentation = await PresentationFile.importPptx(await FileBlob.load(SRC));
  const originals = [...slidesOf(presentation)];
  const selected = slidesMap.map((n) => originals[n - 1].duplicate());
  for (const slide of originals) slide.delete();
  selected.forEach((slide, i) => slide.moveTo(i));

  const kitchenBytes = await bytes(KITCHEN);
  const demandBytes = await bytes(DEMAND_IMG);

  selected.forEach(keepDottedBackground);

  // 1. Title
  {
    const s = selected[0];
    box(s, 608, 304, 710, 88, YELLOW, YELLOW, 12).rotation = -1.5;
    text(s, "IDBLOOM", 590, 290, 740, 110, { size: 78, bold: true, typeface: "Arial Black", align: "center" });
    text(s, "Turning invisible home expertise into visible economic value", 335, 430, 1250, 56, {
      size: 34,
      bold: true,
      align: "center",
    });
    text(s, "From unpaid homemaker to Household Operations Specialist", 294, 576, 1332, 74, {
      size: 42,
      bold: true,
      italic: true,
      align: "center",
    });
    text(s, "Musea + Agency", 760, 704, 400, 42, { size: 26, bold: true, align: "center", color: GRAY });
    footer(s, 0);
    note(s, [
      "Opening thesis: IDBLOOM helps homemakers translate daily work into recognized identity and market opportunities.",
      "[Sources] README.md; pasted prompt; source deck 212(1).pptx.",
    ]);
  }

  // 2. Problem
  {
    const s = selected[1];
    title(s, "Invisible work has no market language");
    text(s, "A homemaker may work all day, but her resume still says:", 300, 300, 910, 70, { size: 36, bold: true });
    text(s, "Unemployed", 1210, 280, 420, 78, { size: 56, bold: true, italic: true, color: RED });
    bullet(s, "skills are unnamed", 360, 455, 520, { size: 30 });
    bullet(s, "labor is unpaid and unseen", 360, 535, 620, { size: 30 });
    bullet(s, "identity is hidden inside family roles", 360, 615, 700, { size: 30 });
    box(s, 1060, 435, 480, 260, "none", BLACK, 22);
    text(s, "Not a lack of ability.\nA lack of translation.", 1098, 500, 410, 120, {
      size: 36,
      bold: true,
      align: "center",
      valign: "middle",
    });
    footer(s, 1);
    note(s, [
      "Use this slide to set the core tension. Many details from the old problem/context slides can be said verbally here.",
      "[Sources] README.md; IDBLOOM_方案深化.md; pasted prompt.",
    ]);
  }

  // 3. Dual-engine mechanism
  {
    const s = selected[2];
    title(s, "IDBLOOM: Identity + Delivery");
    const left = roundedLabel(s, "Inner Identity", 160, 250, 470, 94, "#fff7b0", BLACK);
    const mid = roundedLabel(s, "Identity Passport", 725, 250, 470, 94, "#f5f5f5", BLACK);
    const right = roundedLabel(s, "Demand Delivery", 1290, 250, 470, 94, "#dff5ee", BLACK);
    rightArrow(s, 650, 286);
    rightArrow(s, 1215, 286);
    const items = [
      ["daily memo", "voice/photo/todo"],
      ["skill extraction", "name hidden competence"],
      ["evidence portfolio", "cases + tags + availability"],
      ["market packaging", "service/content/product"],
      ["local matching", "orders + feedback"],
    ];
    for (let i = 0; i < items.length; i++) {
      const x = 180 + i * 330;
      roundedLabel(s, items[i][0], x, 535, 245, 70, i < 2 ? "#fffbea" : i === 2 ? "#ffffff" : "#edfdf7", "#222222");
      text(s, items[i][1], x, 620, 245, 44, { size: 22, color: GRAY, align: "center" });
      if (i < items.length - 1) rightArrow(s, x + 262, 559, 55, 22);
    }
    footer(s, 2);
    note(s, [
      "Explain the product in one clean path: record daily life, extract skills, build identity evidence, then route to opportunities.",
      "[Sources] README.md; IDBLOOM_方案深化.md; pasted prompt.",
    ]);
  }

  // 4. Demo story
  {
    const s = selected[3];
    title(s, "One kitchen reset becomes a market offer");
    s.images.add({
      blob: kitchenBytes,
      contentType: "image/png",
      alt: "IDBLOOM kitchen demo image",
      fit: "cover",
      position: { left: 110, top: 238, width: 700, height: 492 },
      geometry: "roundRect",
      borderRadius: 22,
    });
    text(s, "\"I used 6 storage boxes to reorganize my kitchen.\"", 900, 230, 840, 72, {
      size: 30,
      bold: true,
      italic: true,
    });
    const labels = [
      "Space Planning",
      "Storage System Design",
      "Child Independence Training",
      "Family Workflow Optimization",
    ];
    labels.forEach((label, i) => roundedLabel(s, label, 930 + (i % 2) * 390, 370 + Math.floor(i / 2) * 108, 330, 70, "#fff7b0", "#222222"));
    roundedLabel(s, "2-hour Small Kitchen Reset", 990, 654, 560, 76, "#eaf8f4", TEAL, TEAL);
    text(s, "Simulated local demand: HKD 450 weekend trial", 960, 760, 620, 44, {
      size: 28,
      bold: true,
      color: TEAL,
      align: "center",
    });
    footer(s, 3);
    note(s, [
      "This is the 30-second demo anchor: daily kitchen organization becomes skill tags and then a priced local service.",
      "[Sources] README.md; 第一组任务一_IDBLOOM网站Demo开发指令.md; assets/idbloom-kitchen.png.",
    ]);
  }

  // 5. Monetization paths
  {
    const s = selected[4];
    title(s, "Demand Delivery routes skills to four markets");
    const paths = [
      ["Content", "Xiaohongshu / TikTok", "scripts, posts, before-after stories"],
      ["Products", "Taobao / Etsy / Shopify", "templates, recipes, labels, kits"],
      ["Offline Service", "local parents / community", "kitchen reset, meal prep, care planning"],
      ["Knowledge Service", "workshops / consults", "courses, family systems coaching"],
    ];
    paths.forEach((p, i) => {
      const x = 135 + i * 440;
      box(s, x, 260, 350, 372, i === 2 ? "#eaf8f4" : "#ffffff", i === 2 ? TEAL : "#222222", 24);
      text(s, p[0], x + 26, 300, 298, 42, { size: 31, bold: true, align: "center", color: i === 2 ? TEAL : BLACK });
      text(s, p[1], x + 34, 390, 282, 62, { size: 24, bold: true, align: "center", color: GRAY });
      text(s, p[2], x + 34, 500, 282, 86, { size: 23, align: "center", lineSpacing: 1.12 });
    });
    text(s, "Same identity passport, different income paths.", 460, 730, 1000, 52, { size: 34, bold: true, align: "center" });
    footer(s, 4);
    note(s, [
      "Merge the old online content, e-commerce, offline service, and knowledge service slides into one clean market routing slide.",
      "[Sources] README.md; IDBLOOM_方案深化.md; source deck slides 12-18.",
    ]);
  }

  // 6. Industry comparison
  {
    const s = selected[5];
    title(s, "Industries monetize uniqueness");
    const table = s.tables.add({
      rows: 4,
      columns: 4,
      left: 100,
      top: 255,
      width: 1720,
      height: 510,
      columnTracks: [fr(1.1), fr(1.7), fr(1.4), fr(1.8)],
      values: [
        ["Labor Identity", "Distinctiveness", "Example", "Digital tool -> value"],
        ["Virtual-world designer", "spatial intuition + worldbuilding", "Roblox maps", "game engines + AI -> creator revenue"],
        ["Knowledge coach", "empathy + explanation style", "bilingual tutor", "AI lesson plans -> workshops"],
        ["Homemaker / IDBLOOM", "routine design + care + taste", "Mrs. Chan", "AI identity engine -> local services"],
      ],
    });
    table.styleOptions = { headerRow: true, bandedRows: true };
    table.borders.assign({ style: "solid", fill: "#222222", width: 1.5 });
    for (let c = 0; c < 4; c++) {
      table.getCell(0, c).fill = YELLOW;
      table.getCell(0, c).text.style = { fontSize: 24, bold: true, color: BLACK, alignment: "center", verticalAlignment: "middle" };
    }
    for (let r = 1; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        table.getCell(r, c).text.style = { fontSize: 22, color: BLACK, alignment: c === 0 ? "center" : "left", verticalAlignment: "middle" };
      }
    }
    text(s, "The missing tool for homemakers is not labor matching. It is identity translation.", 270, 820, 1380, 48, {
      size: 30,
      bold: true,
      align: "center",
    });
    footer(s, 5);
    note(s, [
      "Use the comparison to answer the BPA theme directly: digital tools help personal uniqueness become economic value.",
      "[Sources] README.md; pasted prompt; IDBLOOM_方案深化.md.",
    ]);
  }

  // 7. Model, validation, risks
  {
    const s = selected[6];
    title(s, "The model works only if trust is designed in");
    const xs = [170, 560, 950, 1340];
    const vals = [
      ["User value", "identity\nincome\nconfidence"],
      ["Platform revenue", "10-15%\ncommission\npremium exports"],
      ["Validation KPI", "booking rate\nself-worth\nwillingness-to-pay"],
      ["Safeguards", "consent\nprivacy\nquality loop"],
    ];
    vals.forEach((v, i) => {
      box(s, xs[i], 260, 310, 260, "#ffffff", i === 3 ? RED : BLACK, 22);
      text(s, v[0], xs[i] + 24, 292, 262, 42, { size: 26, bold: true, align: "center", color: i === 3 ? RED : BLACK });
      text(s, v[1], xs[i] + 32, 370, 246, 112, { size: 27, align: "center", lineSpacing: 1.2 });
    });
    line(s, 475, 390, 555, 390, BLACK, 4);
    line(s, 865, 390, 945, 390, BLACK, 4);
    line(s, 1255, 390, 1335, 390, BLACK, 4);
    text(s, "Privacy first", 270, 650, 300, 42, { size: 30, bold: true });
    bullet(s, "authorized inputs only", 280, 710, 500, { size: 25 });
    bullet(s, "user confirms before publishing", 280, 765, 570, { size: 25 });
    text(s, "Quality standard", 1010, 650, 360, 42, { size: 30, bold: true });
    bullet(s, "before/after evidence", 1020, 710, 500, { size: 25 });
    bullet(s, "ratings + basic safety guidance", 1020, 765, 590, { size: 25 });
    footer(s, 6);
    note(s, [
      "The prompt's validation metrics are framed here as KPIs to test, not as unsupported achieved results.",
      "[Sources] README.md; IDBLOOM_方案深化.md; pasted prompt.",
    ]);
  }

  // 8. Closing + AI acknowledgement
  {
    const s = selected[7];
    title(s, "Hidden labor -> recognized opportunity");
    s.images.add({
      blob: demandBytes,
      contentType: "image/png",
      alt: "Demand Delivery prototype output showing market-ready positioning",
      fit: "cover",
      position: { left: 980, top: 250, width: 730, height: 380 },
      geometry: "roundRect",
      borderRadius: 20,
    });
    text(s, "AI should not only replace labor.\nIt should reveal the value society has failed to see.", 180, 300, 720, 190, {
      size: 44,
      bold: true,
      lineSpacing: 1.12,
    });
    text(s, "IDBLOOM: idbloom.tobysneko.com", 250, 565, 650, 50, { size: 30, bold: true, color: TEAL });
    box(s, 190, 700, 1500, 190, "#ffffff", "#dddddd", 18);
    text(s, "AI Usage Acknowledgement", 230, 748, 440, 36, { size: 24, bold: true });
    text(
      s,
      "Our team used AI tools to support brainstorming, language polishing, slide structure refinement and prototype simulation. The core idea, target user, business judgment, storyline and final adaptation were developed and validated by our student team.",
      230,
      790,
      1408,
      92,
      { size: 20, color: GRAY, lineSpacing: 1.1 },
    );
    footer(s, 7);
    note(s, [
      "Close by returning to the opening tension: IDBLOOM does not invent value, it makes existing value visible.",
      "[Sources] README.md; source deck media image24.png; pasted prompt.",
    ]);
  }

  const outDir = path.join(TMP, "final-render");
  await fs.mkdir(outDir, { recursive: true });
  for (const [i, slide] of selected.entries()) {
    const stem = `slide-${String(i + 1).padStart(2, "0")}`;
    const png = await presentation.export({ slide, format: "png", scale: 1 });
    await fs.writeFile(path.join(outDir, `${stem}.png`), new Uint8Array(await png.arrayBuffer()));
    const layout = await presentation.export({ slide, format: "layout" });
    await fs.writeFile(path.join(outDir, `${stem}.layout.json`), new Uint8Array(await layout.arrayBuffer()));
  }
  const montage = await presentation.export({ format: "webp", montage: true, scale: 1 });
  await fs.writeFile(path.join(TMP, "final-montage.webp"), new Uint8Array(await montage.arrayBuffer()));
  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(OUT);
  console.log(OUT);
}

main().catch((error) => {
  console.error(error.stack || error.message || String(error));
  process.exit(1);
});
