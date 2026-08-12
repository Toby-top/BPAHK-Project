const example =
  `Daily memo - Mrs. Chan / 陈太太一日生活记录
- 7:10 AM: Prepared breakfast and packed school snacks for two children.
  早上 7:10：准备早餐，并为两个孩子打包上学小食。
- 8:30 AM: Checked the fridge, made a shopping list, and compared prices.
  早上 8:30：检查冰箱、列购物清单，并比较价格。
- 10:15 AM: Bought groceries, storage boxes, and breakfast supplies.
  上午 10:15：购买食材、收纳盒和早餐用品。
- 1:00 PM: Reorganized the kitchen into breakfast, baking, and seasoning zones.
  下午 1:00：把厨房整理成早餐、烘焙和调味分区。
- 4:30 PM: Helped the children find snacks by themselves after school.
  下午 4:30：帮助孩子放学后自行找到小食。
- 8:45 PM: Reviewed tomorrow's meal plan and family schedule.
  晚上 8:45：检查明天的餐食计划和家庭日程。`;

const skills = [
  "Meal Planning / 餐食规划",
  "Budget Awareness / 预算意识",
  "Procurement / 采购管理",
  "Space Optimization / 空间优化",
  "Child Independence Coaching / 儿童独立训练",
  "Schedule Coordination / 日程协调",
];

const storyInput = document.querySelector("#daily-story");
const exampleButton = document.querySelector("#example-button");
const bloomButton = document.querySelector("#bloom-button");
const demandButton = document.querySelector("#demand-button");
const homeButton = document.querySelector("#home-button");
const memoPage = document.querySelector("#memo-page");
const identityPage = document.querySelector("#identity-page");
const deliveryPage = document.querySelector("#delivery-page");
const statusPill = document.querySelector("#status-pill");
const loadingState = document.querySelector("#loading-state");
const identityResults = document.querySelector("#identity-results");
const identityActions = document.querySelector("#identity-actions");
const skillTags = document.querySelector("#skill-tags");
const identityCards = [...document.querySelectorAll("#identity-results .result-card")];
const deliveryCards = [...document.querySelectorAll("#delivery-results .result-card")];
const orderAlert = document.querySelector("#order-alert");
const closingLine = document.querySelector("#closing-line");

let timers = [];

function clearTimers() {
  timers.forEach((timer) => clearTimeout(timer));
  timers = [];
}

function resetResults() {
  clearTimers();
  loadingState.hidden = true;
  identityResults.hidden = true;
  identityActions.hidden = true;
  statusPill.textContent = "Ready / 准备就绪";
  skillTags.replaceChildren();
  [...identityCards, ...deliveryCards, orderAlert, closingLine].forEach((node) =>
    node.classList.remove("show"),
  );
}

function showPage(page) {
  [memoPage, identityPage, deliveryPage].forEach((item) => {
    item.hidden = item !== page;
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function bloomIdentity() {
  if (!storyInput.value.trim()) storyInput.value = example;

  resetResults();
  showPage(identityPage);
  bloomButton.disabled = true;
  statusPill.textContent = "Analyzing / 分析中";
  loadingState.hidden = false;

  timers.push(
    setTimeout(() => {
      loadingState.hidden = true;
      identityResults.hidden = false;
      identityActions.hidden = false;
      statusPill.textContent = "Identity Bloomed / 身份已生成";

      skills.forEach((skill, index) => {
        const tag = document.createElement("span");
        tag.textContent = skill;
        tag.style.animationDelay = `${index * 110}ms`;
        skillTags.append(tag);
      });

      identityCards.forEach((card, index) => {
        timers.push(setTimeout(() => card.classList.add("show"), index * 360));
      });
      timers.push(setTimeout(() => (bloomButton.disabled = false), 1240));
    }, 1400),
  );
}

function showDemandDelivery() {
  clearTimers();
  showPage(deliveryPage);
  [...deliveryCards, orderAlert, closingLine].forEach((node) => node.classList.remove("show"));
  deliveryCards.forEach((card, index) => {
    timers.push(setTimeout(() => card.classList.add("show"), index * 260));
  });
  timers.push(setTimeout(() => orderAlert.classList.add("show"), 520));
  timers.push(setTimeout(() => closingLine.classList.add("show"), 820));
}

exampleButton.addEventListener("click", () => {
  storyInput.value = example;
  storyInput.focus();
});

bloomButton.addEventListener("click", bloomIdentity);
demandButton.addEventListener("click", showDemandDelivery);
homeButton.addEventListener("click", () => {
  resetResults();
  showPage(memoPage);
});
