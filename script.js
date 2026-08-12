const example =
  `Daily memo - Mrs. Chan
- 7:10 AM: Prepared breakfast and packed school snacks for two children.
- 8:30 AM: Checked the fridge, made a shopping list, and compared prices.
- 10:15 AM: Bought groceries, storage boxes, and breakfast supplies.
- 1:00 PM: Reorganized the kitchen into breakfast, baking, and seasoning zones.
- 4:30 PM: Helped the children find snacks by themselves after school.
- 8:45 PM: Reviewed tomorrow's meal plan and family schedule.`;

const skills = [
  "Meal Planning",
  "Budget Awareness",
  "Procurement",
  "Space Optimization",
  "Child Independence Coaching",
  "Schedule Coordination",
];

const storyInput = document.querySelector("#daily-story");
const exampleButton = document.querySelector("#example-button");
const bloomButton = document.querySelector("#bloom-button");
const demandButton = document.querySelector("#demand-button");
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
  statusPill.textContent = "Ready";
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
  statusPill.textContent = "Analyzing";
  loadingState.hidden = false;

  timers.push(
    setTimeout(() => {
      loadingState.hidden = true;
      identityResults.hidden = false;
      identityActions.hidden = false;
      statusPill.textContent = "Identity Bloomed";

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
