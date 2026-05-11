const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const root = __dirname;
const scriptPath = path.join(root, "script.js");
const serverPath = path.join(root, "server.js");
const stylesPath = path.join(root, "styles.css");
const indexPath = path.join(root, "index.html");

function text(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function save(file, value) {
  fs.writeFileSync(file, value, "utf8");
}

function patchServer() {
  let source = text(serverPath);
  if (!source) return false;
  const before = source;

  source = source.replace(/if \(user\.signupNotificationSentAt\) return \{ sent: false, reason: "already-sent" \};\s*/g, "");

  source = source.replace(
    /function getPlanDurationDays\(planName\) \{[\s\S]*?\n\}/,
    `function getPlanDurationDays(planName) {
  const plan = String(planName || "").toLowerCase();
  if (plan.includes("7") || plan.includes("weekly") || plan.includes("week")) return 7;
  if (plan.includes("30") || plan.includes("monthly") || plan.includes("month")) return 30;
  return 7;
}`
  );

  const resetBlock = `const resetNotice = await sendPasswordResetNotice(updatedUser, resetUrl);
    const firebaseReset = resetNotice.sent
      ? { sent: false, reason: "pantrypal-smtp-sent" }
      : await sendFirebasePasswordResetEmail(updatedUser);`;

  source = source.replace(
    /const firebaseReset = await sendFirebasePasswordResetEmail\(updatedUser\);\s*const resetNotice = firebaseReset\.sent\s*\?\s*\{ sent: false, reason: "firebase-sent" \}\s*:\s*await sendPasswordResetNotice\(updatedUser, resetUrl\);/,
    resetBlock
  );

  if (!source.includes("pantrypal-smtp-sent")) {
    source = source.replace("const firebaseReset = await sendFirebasePasswordResetEmail(updatedUser);", resetBlock);
  }

  source = source.replace(/const emailAccepted = firebaseReset\.sent;/g, "const emailAccepted = resetNotice.sent || firebaseReset.sent;");
  source = source.replace(/emailProvider: firebaseReset\.sent \? "firebase" : null,/g, `emailProvider: resetNotice.sent ? "smtp" : (firebaseReset.sent ? "firebase" : null),`);

  const signupBlock = `const signupNotice = await sendSignupNotification(createdUser);
    const firebaseBootstrap = await bootstrapFirebaseAccount(createdUser);
    const firebaseVerification = signupNotice.sent
      ? { sent: false, reason: "pantrypal-smtp-sent" }
      : await sendFirebaseEmailVerification(createdUser);`;

  source = source.replace(
    /const firebaseBootstrap = await bootstrapFirebaseAccount\(createdUser\);\s*const firebaseVerification = await sendFirebaseEmailVerification\(createdUser\);\s*const signupNotice = await sendSignupNotification\(createdUser\);/,
    signupBlock
  );

  if (!source.includes("const signupNotice = await sendSignupNotification(createdUser);")) {
    source = source.replace(
      "const firebaseBootstrap = await bootstrapFirebaseAccount(createdUser);\n    const firebaseVerification = await sendFirebaseEmailVerification(createdUser);",
      signupBlock
    );
  }

  source = source.replace(/signupEmailSent: firebaseVerification\.sent,/g, "signupEmailSent: signupNotice.sent || firebaseVerification.sent,");
  source = source.replace(/signupEmailProvider: firebaseVerification\.sent \? "firebase" : null,/g, `signupEmailProvider: signupNotice.sent ? "smtp" : (firebaseVerification.sent ? "firebase" : null),`);
  source = source.replace(/const priceId = String\(plan \|\| ""\)\.toLowerCase\(\)\.includes\("weekly"\)/g, `const priceId = /weekly|week|7/.test(String(plan || "").toLowerCase())`);
  source = source.replace(/"Weekly Plan"/g, `"7 Day Plan"`).replace(/"Monthly Plan"/g, `"30 Day Plan"`);

  if (source !== before) {
    save(serverPath, source);
    try {
      childProcess.execFileSync(process.execPath, ["--check", serverPath], { stdio: "pipe" });
    } catch (error) {
      save(serverPath, before);
      console.error("PantryPal render-hotfix restored server.js after syntax check failure.");
      return false;
    }
  }
  return source !== before;
}

function patchScript() {
  let source = text(scriptPath);
  if (!source) return false;
  const before = source;

  if (!source.includes("function hasPremiumPlanningAccess(")) {
    source = source.replace(
      "function getSubscriptionEndDate(user) {",
      `function hasPremiumPlanningAccess(user = state.currentUser) {
  if (!user || state.isGuestSession) return false;
  const planName = String(user.subscriptionPlan || "").toLowerCase();
  const status = String(user.subscriptionStatus || "").toLowerCase();
  const isActive = status === "active" || status === "trialing";
  const end = getSubscriptionEndDate(user);
  return isActive && (!end || end.getTime() >= Date.now()) && (planName.includes("7") || planName.includes("30") || planName.includes("monthly") || planName.includes("weekly") || planName.includes("day"));
}

function getSubscriptionEndDate(user) {`
    );
  }

  source = source.replace(/(?<!async )function renderRecommendations\(\) \{/g, "async function renderRecommendations() {");

  if (!source.includes("function renderFreeAccountRecommendations(")) {
    source = source.replace(
      "function renderRecommendations() {",
      `async function renderFreeAccountRecommendations() {
  const savedIngredients = normalizeIngredientList([
    ...(state.currentUser?.favoriteIngredients || []),
    ...(state.currentUser?.favorites || [])
  ]);
  const savedRecipes = state.currentUser?.savedRecipes || [];
  const seeds = savedIngredients.length
    ? savedIngredients
    : savedRecipes.flatMap((recipe) => getRecipeIngredientNames(recipe)).slice(0, 5);
  const fallbackSeeds = seeds.length ? seeds : ["chicken", "rice", "tomato", "spinach", "egg", "pasta"];
  const savedTitles = new Set(savedRecipes.map((recipe) => normalizeIngredientKey(recipe.title || recipe.name || "")));

  let cards = uniqueRecipesByName([
    ...savedRecipes.map((recipe) => ({ ...recipe, match: Math.max(recipe.match || 0, 96) })),
    ...recipePool.filter((recipe) => {
      const title = normalizeIngredientKey(recipe.title || recipe.name || "");
      const ingredients = getRecipeIngredientNames(recipe).map((item) => normalizeIngredientKey(item));
      return fallbackSeeds.some((seed) => title.includes(normalizeIngredientKey(seed)) || ingredients.includes(normalizeIngredientKey(seed)))
        || [...savedTitles].some((savedTitle) => savedTitle && title.includes(savedTitle.split(" ")[0]));
    }),
    ...buildLocalResults(fallbackSeeds.join(", ")),
    ...recipePool
  ]).slice(0, 12);

  try {
    const liveResults = seeds.length
      ? await fetchFavoriteIngredientPool(seeds, 10)
      : await fetchGuestRecommendations();
    cards = uniqueRecipesByName([
      ...savedRecipes.map((recipe) => ({ ...recipe, match: Math.max(recipe.match || 0, 96) })),
      ...liveResults,
      ...cards
    ]).slice(0, 12);
  } catch (_error) {
  }

  state.currentMealPlan = [];
  state.currentResults = cards;
  refs.recommendationHeading.textContent = "Personal Recipe Recommendations";
  refs.dashboardNote.textContent = savedIngredients.length || savedRecipes.length
    ? "Recipe ideas based on your saved ingredients and favourite meals. Subscribe to unlock the full 7-day plan and weekly shopping list."
    : "General recipe ideas for your free account. Save favourite ingredients or recipes to personalise this list.";
  if (refs.recommendationPreview) {
    refs.recommendationPreview.innerHTML = "";
  }
  refs.recommendationGrid.className = "card-row";
  refs.recommendationGrid.innerHTML = cards.map((recipe) => \`
    <article class="recipe-card">
      <div class="thumb \${getThumbClass(recipe)}" \${getThumbStyle(recipe)}></div>
      <div class="recipe-card-body">
        <h3>\${escapeHtml(recipe.title || recipe.name)}</h3>
        <p>\${savedTitles.has(normalizeIngredientKey(recipe.title || recipe.name || "")) ? "Saved favourite recipe" : getRecipeMatchScore(recipe, fallbackSeeds) + "% match"}</p>
        <button class="primary-button guest-recipe-button" type="button" data-recipe-id="\${recipe.id}">View Recipe</button>
      </div>
    </article>\`
  ).join("");
  attachRecipeCardActions(refs.recommendationGrid);
  renderShoppingList();
}

async function renderRecommendations() {`
    );
  }

  if (!source.includes("renderFreeAccountRecommendations();")) {
    source = source.replace(
      "function renderRecommendations() {",
      `function renderRecommendations() {
  if (!state.isGuestSession && state.currentUser && !hasPremiumPlanningAccess()) {
    renderFreeAccountRecommendations();
    return;
  }`
    );
  }

  source = source.replace(
    `if ((id === "recommendations" || id === "shopping") && !state.isGuestSession && state.currentUser && !hasPremiumPlanningAccess()) {
    showToast("Subscribe to unlock 7-day recommendations and the weekly shopping list.", "info");
    id = "pricing";
  }`,
    `if (id === "shopping" && !state.isGuestSession && state.currentUser && !hasPremiumPlanningAccess()) {
    showToast("Subscribe to unlock the weekly shopping list.", "info");
    id = "pricing";
  }`
  );

  source = source.replace(
    `if (refs.shoppingTab) refs.shoppingTab.classList.toggle("hidden", state.isGuestSession);`,
    `if (refs.shoppingTab) refs.shoppingTab.classList.toggle("hidden", state.isGuestSession || (!state.isGuestSession && state.currentUser && !hasPremiumPlanningAccess()));`
  );

  if (!source.includes("shopping-list-locked")) {
    source = source.replace(
      "function renderShoppingList() {",
      `function renderShoppingList() {
  if (!state.isGuestSession && state.currentUser && !hasPremiumPlanningAccess()) {
    if (refs.shoppingCategories) refs.shoppingCategories.innerHTML = "";
    if (refs.shoppingListContent) {
      refs.shoppingListContent.innerHTML = \`
        <section class="premium-lock-card shopping-list-locked">
          <p class="eyebrow">Premium planning</p>
          <h2>Subscribe to unlock the weekly shopping list.</h2>
          <p>Recipe recommendations stay available on free accounts. Shopping lists are generated from the subscribed 7-day plan.</p>
          <button type="button" class="btn primary" data-screen="pricing">View Plans</button>
        </section>\`;
    }
    return;
  }`
    );
  }

  source = source.replace(/Weekly Plan/g, "7 Day Plan").replace(/\$0\.01\/week/g, "$0.01 / 7 days");
  source = source.replace(/Monthly Plan/g, "30 Day Plan").replace(/\$0\.02\/month/g, "$0.02/month");

  if (source !== before) save(scriptPath, source);
  return source !== before;
}

function patchIndex() {
  let source = text(indexPath);
  if (!source) return false;
  const before = source;
  source = source.replace(/Weekly Plan/g, "7 Day Plan").replace(/\$0\.01\/week/g, "$0.01 / 7 days");
  source = source.replace(/Monthly Plan/g, "30 Day Plan").replace(/\$0\.02\/month/g, "$0.02/month");
  if (source !== before) save(indexPath, source);
  return source !== before;
}

function patchStyles() {
  let source = text(stylesPath);
  if (!source) return false;
  const before = source;
  if (!source.includes("render-hotfix premium access polish")) {
    source += `

/* render-hotfix premium access polish */
.quick-action-panel,
.quick-action-panel * {
  color: #102116 !important;
}
.quick-action-panel .eyebrow {
  color: #198c43 !important;
}
.overview-panel,
.detail-card,
.profile-panel,
.shopping-category-panel,
.subscription-panel,
.checkout-card,
.premium-lock-card {
  color: #102116;
}
.meal-card,
.plan-meal-card {
  padding: 22px;
  gap: 18px;
}
.shopping-list-locked,
.subscription-ended-page {
  max-width: 920px;
  margin: 0 auto;
  text-align: left;
}
`;
  }
  if (source !== before) save(stylesPath, source);
  return source !== before;
}

const result = {
  scriptChanged: patchScript(),
  serverChanged: patchServer(),
  indexChanged: patchIndex(),
  stylesChanged: patchStyles(),
};

console.log(
  `PantryPal render-hotfix applied. scriptChanged=${result.scriptChanged}; stylesChanged=${result.stylesChanged}; serverChanged=${result.serverChanged}; indexChanged=${result.indexChanged}`
);
