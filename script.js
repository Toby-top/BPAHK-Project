const examples = {
  en: `Daily memo - Mrs. Chan
- 7:10 AM: Prepared breakfast and packed school snacks for two children.
- 8:30 AM: Checked the fridge, made a shopping list, and compared prices.
- 10:15 AM: Bought groceries, storage boxes, and breakfast supplies.
- 1:00 PM: Reorganized the kitchen into breakfast, baking, and seasoning zones.
- 4:30 PM: Helped the children find snacks by themselves after school.
- 8:45 PM: Reviewed tomorrow's meal plan and family schedule.`,
  zh: `陈太一日生活记录
- 早上 7:10：准备早餐，并为两个孩子打包上学小食。
- 早上 8:30：检查冰箱、列购物清单，并比较价格。
- 上午 10:15：购买食材、收纳盒和早餐用品。
- 下午 1:00：把厨房整理成早餐、烘焙和调味分区。
- 下午 4:30：帮助孩子放学后自行找到小食。
- 晚上 8:45：检查明天的餐食计划和家庭日程。`,
};

const statusCopy = {
  en: {
    ready: "Ready",
    analyzing: "Analyzing",
    bloomed: "Identity Bloomed",
  },
  zh: {
    ready: "准备就绪",
    analyzing: "分析中",
    bloomed: "身份已生成",
  },
};

const skills = {
  en: [
    "Meal Planning",
    "Budget Awareness",
    "Procurement",
    "Space Optimization",
    "Child Independence Coaching",
    "Schedule Coordination",
  ],
  zh: ["餐食规划", "预算意识", "采购管理", "空间优化", "儿童独立训练", "日程协调"],
};

const storyInput = document.querySelector("#daily-story");
const exampleButton = document.querySelector("#example-button");
const bloomButton = document.querySelector("#bloom-button");
const demandButton = document.querySelector("#demand-button");
const homeButton = document.querySelector("#home-button");
const languageToggle = document.querySelector("#language-toggle");
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
let currentLang = "en";
let showingExample = false;

function prepareLanguageSwitching() {
  document.querySelectorAll(".zh").forEach((zhNode) => {
    if (zhNode.previousElementSibling?.classList.contains("en")) return;

    const parent = zhNode.parentElement;
    const enNode = document.createElement("span");
    enNode.className = "en";
    const englishNodes = [];
    let node = zhNode.previousSibling;

    while (node) {
      const previous = node.previousSibling;
      englishNodes.unshift(node);
      node = previous;
    }

    englishNodes.forEach((item) => {
      if (item.nodeType === Node.TEXT_NODE && !item.textContent.trim()) {
        item.remove();
      } else {
        enNode.append(item);
      }
    });

    if (!enNode.textContent.trim()) return;

    parent.insertBefore(enNode, zhNode);
  });
}

function clearTimers() {
  timers.forEach((timer) => clearTimeout(timer));
  timers = [];
}

function resetResults() {
  clearTimers();
  loadingState.hidden = true;
  identityResults.hidden = true;
  identityActions.hidden = true;
  statusPill.textContent = statusCopy[currentLang].ready;
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
  resetResults();
  showPage(identityPage);
  bloomButton.disabled = true;
  statusPill.textContent = statusCopy[currentLang].analyzing;
  loadingState.hidden = false;

  timers.push(
    setTimeout(() => {
      loadingState.hidden = true;
      identityResults.hidden = false;
      identityActions.hidden = false;
      statusPill.textContent = statusCopy[currentLang].bloomed;

      skills[currentLang].forEach((skill, index) => {
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

function setLanguage(lang) {
  const shouldSwapExample = showingExample;
  currentLang = lang;
  document.body.dataset.lang = lang;
  document.documentElement.lang = lang === "zh" ? "zh-Hans" : "en";
  languageToggle.textContent = lang === "zh" ? "English" : "中文";
  languageToggle.setAttribute("aria-label", lang === "zh" ? "Switch to English" : "Switch to Chinese");
  if (shouldSwapExample) storyInput.value = examples[lang];
  statusPill.textContent = statusCopy[lang][getStatusKey()];

  if (!identityResults.hidden) {
    skillTags.replaceChildren();
    skills[lang].forEach((skill, index) => {
      const tag = document.createElement("span");
      tag.textContent = skill;
      tag.style.animationDelay = `${index * 80}ms`;
      skillTags.append(tag);
    });
  }
}

function getStatusKey() {
  if (!loadingState.hidden) return "analyzing";
  if (!identityResults.hidden) return "bloomed";
  return "ready";
}

exampleButton.addEventListener("click", () => {
  storyInput.value = examples[currentLang];
  showingExample = true;
  storyInput.focus();
});

storyInput.addEventListener("input", () => {
  showingExample = false;
});

bloomButton.addEventListener("click", bloomIdentity);
demandButton.addEventListener("click", showDemandDelivery);
languageToggle.addEventListener("click", () => setLanguage(currentLang === "en" ? "zh" : "en"));
homeButton.addEventListener("click", () => {
  resetResults();
  showPage(memoPage);
});

prepareLanguageSwitching();
setLanguage(currentLang);
