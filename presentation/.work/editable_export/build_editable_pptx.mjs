import fs from "node:fs/promises";
import path from "node:path";
import { Presentation, PresentationFile } from "@oai/artifact-tool";

const ROOT = "/Users/Toby_top/Documents/Github-repo/BPAHK-Project";
const DIR = path.join(ROOT, "presentation");
const OUT = path.join(DIR, "IDBLOOM_浅色演示版_9页_可编辑.pptx");
const QA = path.join(DIR, ".work/editable_export");
const W = 1920;
const H = 1080;

const C = {
  bg: "#f8f7f3",
  ink: "#1f2423",
  muted: "#5e6966",
  quiet: "#8c9994",
  line: "#d9dfdc",
  panel: "#ffffff",
  panel2: "#f1f7f5",
  cyan: "#138aa0",
  mint: "#168265",
  amber: "#c9901c",
  paleAmber: "#fff2c7",
  rose: "#d64d68",
  violet: "#725dc8",
};

const notes = [
  "Opening thesis: IDBLOOM helps homemakers translate daily work into recognized identity and market opportunities.\n[Sources] README.md; original prompt; IDBLOOM_frontend_slides.html.",
  "Core problem: homemakers are not lacking ability; their work lacks market translation.\n[Sources] README.md; original prompt; IDBLOOM_frontend_slides.html.",
  "Product flow: daily input -> skill extraction -> Identity Passport -> Demand Delivery.\n[Sources] README.md; original prompt; IDBLOOM_frontend_slides.html.",
  "Demo story: kitchen reset example used to show skill extraction and local demand packaging.\n[Sources] README.md; presentation/assets/idbloom-kitchen.png; IDBLOOM_frontend_slides.html.",
  "Market routing: one identity passport can support content, products, offline services, and knowledge services.\n[Sources] README.md; IDBLOOM_frontend_slides.html.",
  "Comparison: other fields already monetize personal uniqueness; homemakers need identity translation.\n[Sources] README.md; IDBLOOM_frontend_slides.html.",
  "Model and trust: user value, platform revenue, validation KPIs, and privacy safeguards.\n[Sources] README.md; IDBLOOM_frontend_slides.html.",
  "Closing claim: AI should reveal hidden labor value, not only replace labor.\n[Sources] README.md; presentation/assets/idbloom-demand-output.png; IDBLOOM_frontend_slides.html.",
  "AI acknowledgement: transparency page based on competition requirement and team AI usage statement.\n[Sources] README.md; user-provided acknowledgement reference image; IDBLOOM_frontend_slides.html.",
];

async function imageBytes(file) {
  const bytes = await fs.readFile(file);
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function lineConfig(color = C.line, width = 1) {
  return { style: "solid", fill: color, width };
}

function shape(slide, geometry, x, y, w, h, fill, line = C.line, opts = {}) {
  const config = {
    geometry,
    position: { left: x, top: y, width: w, height: h, rotation: opts.rotation },
    fill,
    line: lineConfig(line, opts.lineWidth ?? 1),
    shadow: opts.shadow ?? "shadow-none",
    name: opts.name,
  };
  if (["rect", "textbox", "roundRect"].includes(geometry)) config.borderRadius = opts.radius ?? 8;
  return slide.shapes.add(config);
}

function text(slide, value, x, y, w, h, opts = {}) {
  const t = slide.shapes.add({
    geometry: "textbox",
    position: { left: x, top: y, width: w, height: h, rotation: opts.rotation },
    fill: "none",
    line: lineConfig("none", 0),
    name: opts.name,
  });
  t.text = value;
  t.text.style = {
    fontSize: opts.size ?? 28,
    bold: opts.bold ?? false,
    italic: opts.italic ?? false,
    color: opts.color ?? C.ink,
    alignment: opts.align ?? "left",
    verticalAlignment: opts.valign ?? "top",
    lineSpacing: opts.lineSpacing ?? 1.12,
    autoFit: "shrinkText",
  };
  return t;
}

function rule(slide) {
  shape(slide, "line", 104, 994, 1712, 0, "none", C.cyan, { lineWidth: 1 });
}

function footer(slide, left, right) {
  rule(slide);
  text(slide, left, 104, 1012, 760, 28, { size: 19, color: "#6f7976" });
  text(slide, right, 1280, 1012, 536, 28, { size: 19, color: "#6f7976", align: "right" });
}

function background(slide) {
  slide.background.fill = C.bg;
  shape(slide, "rect", 0, 0, 680, 1080, "#eef7f5", "none", { lineWidth: 0, radius: 0 });
  shape(slide, "rect", 1420, 0, 500, 1080, "#fff8e6", "none", { lineWidth: 0, radius: 0 });
  for (let x = 160; x < W; x += 160) shape(slide, "line", x, 0, 0, H, "none", "#edf0ee");
  for (let y = 160; y < H; y += 160) shape(slide, "line", 0, y, W, 0, "none", "#edf0ee");
}

function note(slide, i) {
  slide.speakerNotes.textFrame.setText(notes[i]);
  slide.speakerNotes.setVisible(true);
}

function header(slide, eyebrow, title, wide = true) {
  text(slide, eyebrow, 104, 76, 620, 34, { size: 24, bold: true, color: C.mint });
  text(slide, title, 104, 122, wide ? 1520 : 1240, 158, {
    size: 78,
    bold: true,
    lineSpacing: 0.94,
  });
}

function panel(slide, x, y, w, h, fill = C.panel) {
  return shape(slide, "roundRect", x, y, w, h, fill, "#ccd5d1", { radius: 8, shadow: "shadow-sm" });
}

function chip(slide, value, x, y, w, h, color = C.cyan) {
  shape(slide, "roundRect", x, y, w, h, "#ffffff", color, { radius: 8 });
  text(slide, value, x + 16, y + 11, w - 32, h - 16, { size: 25, bold: true, color: C.ink, valign: "middle" });
}

function arrow(slide, x, y, w) {
  shape(slide, "line", x, y, w, 0, "none", C.cyan, { lineWidth: 5 });
  text(slide, ">", x + w - 14, y - 24, 32, 40, { size: 32, bold: true, color: C.cyan });
}

async function build() {
  await fs.mkdir(QA, { recursive: true });
  const presentation = Presentation.create({ slideSize: { width: W, height: H } });

  slide1(presentation.slides.add());
  slide2(presentation.slides.add());
  slide3(presentation.slides.add());
  await slide4(presentation.slides.add());
  slide5(presentation.slides.add());
  slide6(presentation.slides.add());
  slide7(presentation.slides.add());
  slide8(presentation.slides.add());
  slide9(presentation.slides.add());

  for (const [i, slide] of presentation.slides.items.entries()) note(slide, i);

  const inspect = await presentation.inspect({
    kind: "slide,textbox,shape,image,notes",
    maxChars: 200000,
  });
  await fs.writeFile(`${OUT}.inspect.ndjson`, inspect.ndjson);

  const montage = await presentation.export({ format: "webp", montage: true, scale: 1 });
  await fs.writeFile(path.join(QA, "editable-native-montage.webp"), new Uint8Array(await montage.arrayBuffer()));

  const pptx = await PresentationFile.exportPptx(presentation);
  await pptx.save(OUT);
  console.log(`Exported editable deck: ${OUT}`);
}

function slide1(slide) {
  background(slide);
  text(slide, "Topic 3 / Labor Identity", 104, 210, 620, 36, { size: 24, bold: true, color: C.mint });
  text(slide, "IDBLOOM", 104, 262, 760, 160, { size: 150, bold: true, lineSpacing: 0.86 });
  text(slide, "Turning invisible home expertise into visible economic value", 104, 470, 840, 118, {
    size: 48,
    bold: true,
    color: C.muted,
    lineSpacing: 1.04,
  });
  shape(slide, "rect", 104, 642, 7, 78, C.amber, C.amber, { radius: 0 });
  shape(slide, "rect", 118, 642, 826, 78, C.paleAmber, "#eadbad");
  text(slide, "From unpaid homemaker to Household Operations Specialist", 150, 661, 760, 42, {
    size: 32,
    bold: true,
    color: C.ink,
  });

  panel(slide, 1020, 160, 800, 720, "#ffffff");
  for (let y = 215; y < 820; y += 58) shape(slide, "line", 1045, y, 730, 0, "none", "#edf0ee");
  panel(slide, 1146, 276, 516, 402, "#f7fbfa");
  shape(slide, "rect", 1200, 360, 210, 16, C.cyan, C.cyan, { radius: 0 });
  shape(slide, "rect", 1200, 434, 330, 16, C.cyan, C.cyan, { radius: 0 });
  shape(slide, "rect", 1200, 508, 270, 16, C.cyan, C.cyan, { radius: 0 });
  shape(slide, "ellipse", 1460, 345, 126, 126, "none", C.mint, { lineWidth: 18 });
  const nodes = [
    ["Inner\nIdentity", 1600, 222, C.cyan],
    ["Demand\nDelivery", 1538, 680, C.amber],
    ["Market\nValue", 1110, 742, C.mint],
  ];
  for (const [label, x, y, color] of nodes) {
    shape(slide, "ellipse", x, y, 172, 172, "#ffffff", color);
    text(slide, label, x + 18, y + 45, 136, 74, { size: 24, bold: true, color, align: "center", valign: "middle" });
  }
  footer(slide, "IDBLOOM / BPA Topic 3", "0:00-0:35 / 01");
}

function slide2(slide) {
  background(slide);
  header(slide, "Problem", "Invisible work has no market language");
  panel(slide, 104, 320, 830, 430, "#ffffff");
  text(slide, "Resume field", 158, 368, 420, 42, { size: 28, bold: true, color: C.quiet });
  text(slide, "Unemployed", 158, 450, 690, 118, { size: 106, bold: true, color: C.rose, lineSpacing: 0.9 });
  shape(slide, "rect", 156, 546, 720, 8, C.amber, C.amber, { rotation: -3, radius: 0 });
  text(slide, "A homemaker may work all day, but her resume still says nothing.", 158, 624, 650, 74, {
    size: 30,
    bold: true,
    color: C.muted,
  });

  const rows = [
    ["01", "Skills are unnamed", C.cyan, "#e8f5f5"],
    ["02", "Labor is unpaid and unseen", C.amber, "#fff4d8"],
    ["03", "Identity is hidden inside family roles", C.mint, "#eaf5ee"],
  ];
  for (const [i, row] of rows.entries()) {
    const y = 320 + i * 144;
    shape(slide, "rect", 1015, y, 5, 118, row[2], row[2], { radius: 0 });
    shape(slide, "rect", 1020, y, 796, 118, row[3], "none", { lineWidth: 0, radius: 0 });
    text(slide, row[0], 1050, y + 34, 78, 48, { size: 34, bold: true, color: row[2] });
    text(slide, row[1], 1140, y + 25, 610, 58, { size: 36, bold: true, color: C.ink, valign: "middle" });
  }
  shape(slide, "rect", 104, 840, 1712, 96, C.paleAmber, "#e5cf86");
  text(slide, "Not a lack of ability.", 138, 864, 720, 48, { size: 38, bold: true });
  text(slide, "A lack of translation.", 1040, 864, 700, 48, { size: 38, bold: true, color: C.amber, align: "right" });
  footer(slide, "Hidden labor -> unnamed value", "0:35-1:15 / 02");
}

function slide3(slide) {
  background(slide);
  header(slide, "Mechanism", "IDBLOOM = Identity + Delivery", false);
  const engines = [
    ["Inner Identity", "AI discovers hidden skills from daily home life."],
    ["Identity Passport", "Evidence, tags, cases, availability, and value language."],
    ["Demand Delivery", "Routes skills into services, content, products, and local orders."],
  ];
  const xs = [104, 720, 1336];
  for (const [i, item] of engines.entries()) {
    panel(slide, xs[i], 292, 480, 184, "#ffffff");
    text(slide, item[0], xs[i] + 34, 326, 410, 48, { size: 40, bold: true });
    text(slide, item[1], xs[i] + 34, 394, 390, 58, { size: 26, color: C.muted });
  }
  arrow(slide, 610, 382, 84);
  arrow(slide, 1226, 382, 84);

  const steps = [
    ["Daily memo", "voice / photo / to-do", C.cyan],
    ["Skill extraction", "name hidden competence", C.mint],
    ["Evidence portfolio", "cases + tags + availability", C.amber],
    ["Market packaging", "service / content / product", C.violet],
    ["Local matching", "orders + feedback", C.rose],
  ];
  for (const [i, s] of steps.entries()) {
    const x = 104 + i * 344;
    shape(slide, "rect", x, 592, 320, 5, s[2], s[2], { radius: 0 });
    shape(slide, "rect", x, 597, 320, 190, "#ffffff", "#d6dedb", { radius: 0 });
    text(slide, s[0], x + 24, 626, 270, 70, { size: 32, bold: true, lineSpacing: 1 });
    text(slide, s[1], x + 24, 718, 260, 45, { size: 23, color: C.muted });
    if (i < steps.length - 1) {
      text(slide, ">", x + 322, 672, 28, 36, { size: 28, bold: true, color: "#9aa6a2" });
    }
  }
  footer(slide, "Product flow", "1:15-2:05 / 03");
}

async function slide4(slide) {
  background(slide);
  header(slide, "Demo Story", "One kitchen reset becomes a market offer");
  panel(slide, 104, 330, 810, 610, "#ffffff");
  slide.images.add({
    blob: await imageBytes(path.join(DIR, "assets/idbloom-kitchen.png")),
    contentType: "image/png",
    alt: "Organized kitchen shelf used in the IDBLOOM demo",
    fit: "cover",
    position: { left: 118, top: 344, width: 782, height: 582 },
    geometry: "roundRect",
    borderRadius: 8,
  });
  shape(slide, "rect", 118, 624, 782, 5, C.cyan, C.cyan, { radius: 0 });

  text(slide, "\"I used 6 storage boxes to reorganize my kitchen.\"", 980, 330, 830, 168, {
    size: 54,
    bold: true,
    color: C.ink,
    lineSpacing: 1.02,
  });
  const chips = [
    ["Space Planning", 980, 548, 250],
    ["Storage System Design", 1248, 548, 340],
    ["Child Independence Training", 980, 626, 398],
    ["Family Workflow Optimization", 1398, 626, 420],
  ];
  for (const [v, x, y, w] of chips) chip(slide, v, x, y, w, 58);
  shape(slide, "rect", 980, 760, 830, 140, "#eaf5ee", C.mint);
  text(slide, "2-hour Small Kitchen Reset", 1014, 790, 560, 48, { size: 39, bold: true });
  text(slide, "Simulated local demand", 1014, 848, 360, 32, { size: 24, bold: true, color: C.mint });
  text(slide, "HKD 450", 1600, 804, 178, 60, { size: 42, bold: true, color: C.amber, align: "right" });
  footer(slide, "Daily action -> skill evidence -> priced service", "2:05-3:05 / 04");
}

function slide5(slide) {
  background(slide);
  header(slide, "Demand Delivery", "Four markets for the same hidden expertise");
  const routes = [
    ["01", "Content", "Xiaohongshu\nTikTok", "scripts, posts, before-after stories", C.cyan],
    ["02", "Products", "Taobao\nEtsy / Shopify", "templates, recipes, labels, kits", C.amber],
    ["03", "Offline Service", "local parents\ncommunity groups", "kitchen reset, meal prep, care planning", C.mint],
    ["04", "Knowledge Service", "workshops\nconsults", "courses, family systems coaching", C.violet],
  ];
  for (const [i, r] of routes.entries()) {
    const x = 104 + i * 422;
    panel(slide, x, 304, 396, 496, "#ffffff");
    shape(slide, "rect", x, 304, 396, 6, r[4], r[4], { radius: 0 });
    text(slide, r[0], x + 30, 340, 80, 34, { size: 26, bold: true, color: C.quiet });
    text(slide, r[1], x + 30, 416, 320, 92, { size: 46, bold: true, lineSpacing: 0.98 });
    text(slide, r[2], x + 30, 550, 320, 82, { size: 25, bold: true, color: C.mint, lineSpacing: 1.28 });
    text(slide, r[3], x + 30, 692, 320, 86, { size: 29, bold: true, color: C.ink, lineSpacing: 1.12 });
  }
  shape(slide, "rect", 104, 850, 1712, 82, "#e8f5f5", C.cyan);
  text(slide, "Same identity passport, different income paths.", 140, 870, 1640, 42, {
    size: 39,
    bold: true,
    align: "center",
  });
  footer(slide, "Market routing", "3:05-4:10 / 05");
}

function tableCell(slide, value, x, y, w, h, opts = {}) {
  shape(slide, "rect", x, y, w, h, opts.fill ?? "#ffffff", "#d9dfdc", { radius: 0 });
  text(slide, value, x + 18, y + 18, w - 36, h - 24, {
    size: opts.size ?? 26,
    bold: opts.bold ?? false,
    color: opts.color ?? C.ink,
    valign: "middle",
    lineSpacing: 1.1,
  });
}

function slide6(slide) {
  background(slide);
  header(slide, "Comparison", "Industries already monetize uniqueness");
  const x = 104;
  const y = 285;
  const widths = [420, 520, 320, 452];
  const heights = [74, 156, 156, 156];
  const values = [
    ["Labor Identity", "Distinctiveness", "Example", "Digital Tool -> Value"],
    ["Virtual-world designer", "spatial intuition + worldbuilding", "Roblox maps", "game engines + AI -> creator revenue"],
    ["Knowledge coach", "empathy + explanation style", "bilingual tutor", "AI lesson plans -> workshops"],
    ["Homemaker / IDBLOOM", "routine design + care + taste", "Mrs. Chan", "AI identity engine -> local services"],
  ];
  let yy = y;
  for (let r = 0; r < values.length; r += 1) {
    let xx = x;
    for (let c = 0; c < values[r].length; c += 1) {
      const isHead = r === 0;
      const isHot = r === 3;
      tableCell(slide, values[r][c], xx, yy, widths[c], heights[r], {
        fill: isHead ? "#e8f5f5" : isHot ? "#fff0bd" : "#ffffff",
        bold: isHead || c === 0 || isHot,
        size: isHead ? 21 : c === 0 ? 29 : 25,
        color: isHead ? C.mint : isHot && c === 0 ? C.amber : C.ink,
      });
      xx += widths[c];
    }
    yy += heights[r];
  }
  shape(slide, "rect", 104, 860, 930, 72, C.paleAmber, C.amber);
  text(slide, "The missing tool is not labor matching. It is identity translation.", 134, 878, 870, 36, {
    size: 32,
    bold: true,
  });
  footer(slide, "Why this is timely", "4:10-5:00 / 06");
}

function slide7(slide) {
  background(slide);
  header(slide, "Model + Trust", "The model works only if trust is designed in");
  const boxes = [
    ["User value", "identity, income, confidence"],
    ["Platform revenue", "10-15% commission, premium exports, certificates"],
    ["Validation KPI", ""],
    ["Safeguards", "consent, privacy, user confirmation, quality loop"],
  ];
  for (const [i, b] of boxes.entries()) {
    const x = 104 + i * 424;
    panel(slide, x, 310, 400, 260, "#ffffff");
    text(slide, b[0], x + 28, 344, 334, 44, { size: 36, bold: true });
    if (i !== 2) text(slide, b[1], x + 28, 424, 326, 90, { size: 28, color: C.muted });
  }
  const kpiX = 104 + 2 * 424 + 28;
  const kpis = [
    ["booking rate", 0.72],
    ["self-worth", 0.84],
    ["willingness", 0.64],
  ];
  for (const [i, k] of kpis.entries()) {
    const y = 414 + i * 52;
    text(slide, k[0], kpiX, y, 150, 30, { size: 21, bold: true, color: C.mint });
    shape(slide, "rect", kpiX + 164, y + 8, 150, 12, "#e3e8e6", "none", { lineWidth: 0, radius: 0 });
    shape(slide, "rect", kpiX + 164, y + 8, 150 * k[1], 12, C.cyan, C.cyan, { radius: 0 });
  }
  const safes = [
    ["Privacy first", "Authorized inputs only. User confirms before anything is published."],
    ["Quality standard", "Before-after evidence, ratings, and basic safety guidance protect buyers and users."],
  ];
  for (const [i, s] of safes.entries()) {
    const x = 104 + i * 858;
    shape(slide, "rect", x, 655, 826, 190, "#fff4d8", C.amber);
    text(slide, s[0], x + 34, 686, 360, 44, { size: 36, bold: true });
    text(slide, s[1], x + 34, 754, 720, 58, { size: 27, color: C.muted });
  }
  footer(slide, "Business model + ethics", "5:00-5:55 / 07");
}

function slide8(slide) {
  background(slide);
  text(slide, "Closing", 104, 150, 360, 34, { size: 24, bold: true, color: C.mint });
  text(slide, "Hidden labor -> recognized opportunity", 104, 196, 780, 160, {
    size: 72,
    bold: true,
    lineSpacing: 0.94,
  });
  text(slide, "AI should not only replace labor. It should reveal the value society has failed to see.", 104, 438, 780, 230, {
    size: 58,
    bold: true,
    lineSpacing: 1.02,
  });
  text(slide, "IDBLOOM: idbloom.tobysneko.com", 104, 720, 740, 44, { size: 30, bold: true, color: C.mint });

  panel(slide, 970, 214, 820, 630, "#ffffff");
  shape(slide, "rect", 970, 214, 820, 76, "#f1f7f5", "#d2ddd9", { radius: 0 });
  shape(slide, "ellipse", 1002, 238, 18, 18, C.rose, C.rose);
  shape(slide, "ellipse", 1030, 238, 18, 18, C.amber, C.amber);
  shape(slide, "ellipse", 1058, 238, 18, 18, C.mint, C.mint);
  text(slide, "Demand Delivery Output", 1110, 234, 420, 34, { size: 28, bold: true });
  shape(slide, "roundRect", 1550, 230, 190, 40, "#e8f5f5", C.cyan, { radius: 8 });
  text(slide, "MATCH READY", 1570, 238, 150, 22, { size: 18, bold: true, color: C.cyan, align: "center" });

  shape(slide, "roundRect", 1006, 326, 318, 458, "#fbfdfc", "#d9dfdc", { radius: 8 });
  text(slide, "Mrs. Chan", 1034, 356, 260, 36, { size: 32, bold: true });
  text(slide, "Household Operations Specialist", 1034, 402, 250, 52, { size: 23, color: C.muted });
  chip(slide, "Space Planning", 1034, 486, 230, 52);
  chip(slide, "Care Workflow", 1034, 552, 230, 52, C.mint);
  chip(slide, "Kitchen Reset", 1034, 618, 230, 52, C.amber);
  text(slide, "Evidence: before-after storage system + family routine improvement", 1034, 704, 240, 58, {
    size: 22,
    color: C.muted,
  });

  shape(slide, "roundRect", 1358, 326, 386, 214, "#eaf5ee", C.mint, { radius: 8 });
  text(slide, "Local Demand", 1386, 358, 240, 34, { size: 30, bold: true });
  text(slide, "2-hour Small Kitchen Reset", 1386, 414, 300, 44, { size: 27, bold: true });
  text(slide, "HKD 450", 1386, 478, 200, 44, { size: 34, bold: true, color: C.amber });

  shape(slide, "roundRect", 1358, 572, 386, 96, "#fff4d8", C.amber, { radius: 8 });
  text(slide, "Route", 1386, 590, 100, 28, { size: 24, bold: true });
  text(slide, "community groups -> local booking", 1490, 590, 220, 52, { size: 22, color: C.muted });
  shape(slide, "roundRect", 1358, 694, 386, 90, "#f1f7f5", C.cyan, { radius: 8 });
  text(slide, "Next action", 1386, 712, 160, 28, { size: 24, bold: true });
  text(slide, "confirm availability and publish", 1548, 712, 160, 52, { size: 22, color: C.muted });
  footer(slide, "IDBLOOM / final message", "5:55-6:30 / 08");
}

function slide9(slide) {
  background(slide);
  shape(slide, "line", 84, 58, 0, 964, "none", C.ink, { lineWidth: 3 });
  text(slide, "AI Tool Acknowledgement & Usage Transparency", 158, 50, 1320, 54, {
    size: 42,
    bold: true,
  });
  text(
    slide,
    "In accordance with competition guidelines, AI tools were utilized solely as supporting mechanisms under strict student guidance, supervision, and iterative adaptation:",
    158,
    116,
    1550,
    108,
    { size: 32, italic: true, bold: true, lineSpacing: 1.18 },
  );

  const x0 = 158;
  const y0 = 260;
  const gaps = 52;
  const ws = [470, 500, 590];
  const xs = [x0, x0 + ws[0] + gaps, x0 + ws[0] + gaps + ws[1] + gaps];
  const heads = ["AI Tool / Platform", "Role & Scope of Involvement", "Student Input & Adaptation\n(Core Content)"];
  for (let i = 0; i < 3; i += 1) {
    text(slide, heads[i], xs[i], y0, ws[i], 92, { size: 30, italic: true, color: C.ink, lineSpacing: 1.18 });
    shape(slide, "line", xs[i], y0 + 110, ws[i], 0, "none", C.line, { lineWidth: 2 });
  }

  const row1 = y0 + 148;
  const row2 = row1 + 270;
  const rows = [
    [
      "LLM (ChatGPT / Coze)",
      "Concept brainstorming, grammar refinement, and initial prompt testing for the MVP Bot.",
      "100% Student-Driven: Core research canvas, industry matrix analysis, identity business model, and strategic narrative were conceptualized and authored by students.",
    ],
    [
      "UI / Code Generation\n(Codex / Figma)",
      "Layout formatting and HTML/CSS template structure for PDF export.",
      "100% Student-Designed: Prototype workflow, Mrs. Chan's daily case scenario, pricing logic, and UI design decisions were defined and validated by the team.",
    ],
  ];
  for (const [ri, row] of rows.entries()) {
    const y = ri === 0 ? row1 : row2;
    for (let c = 0; c < 3; c += 1) {
      text(slide, row[c], xs[c], y, ws[c], ri === 0 ? 210 : 260, {
        size: c === 0 ? 29 : 28,
        bold: c === 0,
        italic: c !== 0,
        lineSpacing: 1.18,
      });
      shape(slide, "line", xs[c], y + (ri === 0 ? 235 : 286), ws[c], 0, "none", C.line, { lineWidth: 2 });
    }
  }
  footer(slide, "Competition transparency", "6:30-7:00 / 09");
}

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
