const PUBLIC_CONFIG_URL = "/api/public-config";
const THEMEALDB_BASE = "https://www.themealdb.com/api/json/v1/1";

const screens = [...document.querySelectorAll(".screen")];
const targetButtons = [...document.querySelectorAll("[data-screen-target]")];
const authButtons = [...document.querySelectorAll("[data-auth-action]")];
const googleFallbackButtons = [...document.querySelectorAll("[data-google-email]")];
const welcomeSlides = [...document.querySelectorAll(".welcome-slide")];

const refs = {
  toast: document.querySelector("#app-toast"),
  environmentBanner: document.querySelector("#environment-banner"),
  loginForm: document.querySelector("#login-form"),
  loginIdentity: document.querySelector("#user-id"),
  loginPassword: document.querySelector("#user-password"),
  forgotPasswordButton: document.querySelector("#forgot-password-button"),
  guestForm: document.querySelector("#guest-form"),
  guestName: document.querySelector("#guest-name"),
  guestFavorites: document.querySelector("#guest-favorites"),
  forgotPasswordForm: document.querySelector("#forgot-password-form"),
  forgotIdentity: document.querySelector("#forgot-identity"),
  forgotPasswordNote: document.querySelector("#forgot-password-note"),
  resetPasswordForm: document.querySelector("#reset-password-form"),
  resetToken: document.querySelector("#reset-token"),
  resetPassword: document.querySelector("#reset-password"),
  resetPasswordConfirm: document.querySelector("#reset-password-confirm"),
  resetPasswordNote: document.querySelector("#reset-password-note"),
  signupForm: document.querySelector("#signup-form"),
  signupUsername: document.querySelector("#signup-username"),
  signupEmail: document.querySelector("#signup-email"),
  signupPassword: document.querySelector("#signup-password"),
  signupConfirmPassword: document.querySelector("#signup-confirm-password"),
  ingredientForm: document.querySelector("#ingredient-form"),
  ingredientInput: document.querySelector("#ingredient-input"),
  resultsTitle: document.querySelector("#results-title"),
  resultsNote: document.querySelector("#results-note"),
  resultsError: document.querySelector("#results-error"),
  resultsGrid: document.querySelector("#results-grid"),
  apiStatus: document.querySelector("#api-status"),
  userGreeting: document.querySelector("#user-greeting"),
  membershipChip: document.querySelector("#membership-chip"),
  sessionAction: document.querySelector("#session-action"),
  personalTab: document.querySelector("#personal-tab"),
  profileTab: document.querySelector("#profile-tab"),
  shoppingTab: document.querySelector("#shopping-tab"),
  recommendationHeading: document.querySelector("#recommendation-heading"),
  dashboardNote: document.querySelector("#dashboard-note"),
  recommendationPreview: document.querySelector("#recommendation-preview"),
  recommendationGrid: document.querySelector("#recommendation-grid"),
  guestRefresh: document.querySelector("#guest-refresh"),
  profileForm: document.querySelector("#profile-form"),
  profileUsername: document.querySelector("#profile-username"),
  profileEmail: document.querySelector("#profile-email"),
  profilePassword: document.querySelector("#profile-password"),
  profileAccountStatus: document.querySelector("#profile-account-status"),
  profileAccountNote: document.querySelector("#profile-account-note"),
  deactivateAccountButton: document.querySelector("#deactivate-account-button"),
  deleteAccountButton: document.querySelector("#delete-account-button"),
  favoriteForm: document.querySelector("#favorite-form"),
  favoriteInput: document.querySelector("#favorite-input"),
  favoriteList: document.querySelector("#favorite-list"),
  shoppingTabs: document.querySelector("#shopping-tabs"),
  shoppingGrid: document.querySelector("#shopping-grid"),
  recipeTitle: document.querySelector("#recipe-title"),
  recipeHero: document.querySelector("#recipe-hero"),
  recipeBackButton: document.querySelector("#recipe-back-button"),
  recipeReturnButton: document.querySelector("#recipe-return-button"),
  recipeIngredients: document.querySelector("#recipe-ingredients"),
  recipeReady: document.querySelector("#recipe-ready"),
  recipeServings: document.querySelector("#recipe-servings"),
  recipeInstructions: document.querySelector("#recipe-instructions"),
  recipeTip: document.querySelector("#recipe-tip"),
  saveRecipeButton: document.querySelector("#save-recipe-button"),
  savedRecipesPanel: document.querySelector("#saved-recipes-panel"),
  savedRecipesList: document.querySelector("#saved-recipes-list"),
  profileSavedRecipes: document.querySelector("#profile-saved-recipes"),
  pricingGrid: document.querySelector("#pricing-grid"),
  pricingFooterNote: document.querySelector("#pricing-footer-note"),
  subscriptionManage: document.querySelector("#subscription-manage"),
  subscriptionStatusBadge: document.querySelector("#subscription-status-badge"),
  subscriptionActivePlan: document.querySelector("#subscription-active-plan"),
  subscriptionManageNote: document.querySelector("#subscription-manage-note"),
  subscriptionCurrentPlan: document.querySelector("#subscription-current-plan"),
  subscriptionCurrentStatus: document.querySelector("#subscription-current-status"),
  subscriptionCurrentBilling: document.querySelector("#subscription-current-billing"),
  subscriptionDaysLeft: document.querySelector("#subscription-days-left"),
  unsubscribeButton: document.querySelector("#unsubscribe-button"),
  paymentForm: document.querySelector("#payment-form"),
  paymentPlanName: document.querySelector("#payment-plan-name"),
  paymentPlanPrice: document.querySelector("#payment-plan-price"),
  paymentSummaryStatus: document.querySelector("#payment-summary-status"),
  paymentNote: document.querySelector("#payment-note"),
  billingEmail: document.querySelector("#billing-email"),
  paymentSubmit: document.querySelector("#payment-submit"),
  paymentStatus: document.querySelector("#payment-status")
};

const state = {
  publicConfig: null,
  stripe: null,
  firebaseAuth: null,
  selectedPlan: null,
  currentUser: null,
  isGuestSession: false,
  currentResults: [],
  currentRecipe: null,
  currentMealPlan: [],
  currentPlanDayIndex: 0,
  activeShoppingCategory: "All",
  recipeReturnScreen: "dashboard",
  lastGuestRecommendationSeed: Date.now()
};

const recipePool = [
  {
    id: "local-1",
    title: "Chicken Spinach Stir Fry",
    match: 92,
    image: "thumb-green",
    ingredients: ["300 g chicken breast", "2 cups spinach", "1 tomato", "2 cups cooked rice", "2 cloves garlic", "1 tbsp soy sauce"],
    ingredientDetails: [
      { name: "Chicken breast", measure: "300 g" },
      { name: "Spinach", measure: "2 cups" },
      { name: "Tomato", measure: "1" },
      { name: "Cooked rice", measure: "2 cups" },
      { name: "Garlic", measure: "2 cloves" },
      { name: "Soy sauce", measure: "1 tbsp" }
    ],
    instructions: [
      "Slice the chicken breast into thin strips and season lightly with salt and pepper.",
      "Heat a pan with a little oil and cook the chicken until golden and fully cooked.",
      "Add chopped garlic and diced tomato, then stir for 2 minutes until fragrant.",
      "Add spinach and soy sauce, tossing until the spinach softens.",
      "Serve hot over cooked rice."
    ]
  },
  {
    id: "local-2",
    title: "Beef and Broccoli",
    match: 88,
    image: "thumb-red",
    ingredients: ["300 g beef strips", "2 cups broccoli", "2 cloves garlic", "1 tbsp soy sauce", "1 tsp sesame oil"],
    ingredientDetails: [
      { name: "Beef strips", measure: "300 g" },
      { name: "Broccoli", measure: "2 cups" },
      { name: "Garlic", measure: "2 cloves" },
      { name: "Soy sauce", measure: "1 tbsp" },
      { name: "Sesame oil", measure: "1 tsp" }
    ],
    instructions: [
      "Blanch the broccoli for 2 minutes, then drain.",
      "Stir-fry beef strips in a hot pan until browned.",
      "Add garlic, soy sauce, and sesame oil.",
      "Return broccoli to the pan and toss until coated and heated through.",
      "Serve immediately."
    ]
  },
  {
    id: "local-3",
    title: "Vegetarian Quinoa Bowl",
    match: 85,
    image: "thumb-fresh",
    ingredients: ["1 cup cooked quinoa", "1 tomato", "1 cup spinach", "1/2 cucumber", "2 tbsp yogurt dressing"],
    ingredientDetails: [
      { name: "Cooked quinoa", measure: "1 cup" },
      { name: "Tomato", measure: "1" },
      { name: "Spinach", measure: "1 cup" },
      { name: "Cucumber", measure: "1/2" },
      { name: "Yogurt dressing", measure: "2 tbsp" }
    ],
    instructions: [
      "Place cooked quinoa in a serving bowl.",
      "Top with chopped tomato, spinach, and cucumber.",
      "Drizzle with yogurt dressing.",
      "Toss lightly and serve chilled or at room temperature."
    ]
  },
  {
    id: "local-4",
    title: "Creamy Garlic Pasta",
    match: 91,
    image: "thumb-pasta",
    ingredients: ["200 g pasta", "3 cloves garlic", "1 cup cream", "1/2 cup grated cheese", "1 tbsp butter"],
    ingredientDetails: [
      { name: "Pasta", measure: "200 g" },
      { name: "Garlic", measure: "3 cloves" },
      { name: "Cream", measure: "1 cup" },
      { name: "Grated cheese", measure: "1/2 cup" },
      { name: "Butter", measure: "1 tbsp" }
    ],
    instructions: [
      "Cook pasta in salted water until al dente.",
      "Melt butter in a pan and saute minced garlic until fragrant.",
      "Pour in cream and simmer gently for 2 minutes.",
      "Add cheese and stir until smooth.",
      "Toss the drained pasta through the sauce and serve warm."
    ]
  },
  {
    id: "local-5",
    title: "Mediterranean Salad Bowl",
    match: 89,
    image: "thumb-salad",
    ingredients: ["1 cucumber", "2 tomatoes", "1/4 cup olives", "2 cups lettuce", "2 tbsp olive oil"],
    ingredientDetails: [
      { name: "Cucumber", measure: "1" },
      { name: "Tomatoes", measure: "2" },
      { name: "Olives", measure: "1/4 cup" },
      { name: "Lettuce", measure: "2 cups" },
      { name: "Olive oil", measure: "2 tbsp" }
    ],
    instructions: [
      "Chop cucumber, tomatoes, and lettuce into bite-sized pieces.",
      "Combine in a bowl with olives.",
      "Dress with olive oil and a pinch of salt.",
      "Toss gently and serve fresh."
    ]
  },
  {
    id: "local-6",
    title: "Roasted Pumpkin Soup",
    match: 87,
    image: "thumb-soup",
    ingredients: ["400 g pumpkin", "1 onion", "1 cup cream", "2 cups stock", "1 tbsp olive oil"],
    ingredientDetails: [
      { name: "Pumpkin", measure: "400 g" },
      { name: "Onion", measure: "1" },
      { name: "Cream", measure: "1 cup" },
      { name: "Stock", measure: "2 cups" },
      { name: "Olive oil", measure: "1 tbsp" }
    ],
    instructions: [
      "Roast the pumpkin with olive oil until tender.",
      "Cook chopped onion in a pot until soft.",
      "Add roasted pumpkin and stock, then simmer for 10 minutes.",
      "Blend until smooth and stir in cream.",
      "Serve hot."
    ]
  }
];

const imageClasses = ["thumb-green", "thumb-red", "thumb-fresh", "thumb-pasta", "thumb-salad", "thumb-soup", "thumb-gold", "thumb-noodles"];

function normalizeTerm(value) {
  return String(value || "").trim().toLowerCase();
}

function showToast(message, type = "info") {
  if (!refs.toast) return;
  refs.toast.textContent = message;
  refs.toast.className = `app-toast is-visible is-${type}`;
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    refs.toast.className = "app-toast";
  }, 4200);
}

function setHelperText(element, message, type = "info") {
  if (!element) return;
  element.textContent = message;
  element.dataset.state = type;
}

function activateScreen(id) {
  screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.id === id);
  });
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function clearQueryParams() {
  const url = new URL(window.location.href);
  url.search = "";
  window.history.replaceState({}, "", url.toString());
}

function buildDefaultUser(overrides = {}) {
  return {
    username: "",
    email: "",
    password: "",
    favorites: [],
    savedRecipes: [],
    recommendationPlan: [],
    shoppingList: { items: [], weeklyDays: [] },
    accountStatus: "active",
    subscription: { plan: "Free Plan", status: "inactive" },
    ...overrides
  };
}

function normalizeUser(user) {
  return buildDefaultUser(user || {});
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch (_error) {
    payload = {};
  }

  if (!response.ok) {
    throw new Error(payload.error || `Request failed with ${response.status}`);
  }

  return payload;
}

function isHostedAuthEnabled() {
  return Boolean(state.publicConfig?.app?.hostedAuthEnabled);
}

function isPasswordResetEnabled() {
  return Boolean(state.publicConfig?.app?.passwordResetEmailEnabled);
}

function isStripeEnabled() {
  return Boolean(state.publicConfig?.stripe?.checkoutEnabled);
}

function isLocalMode() {
  return Boolean(state.publicConfig?.app?.localMode);
}

function getImageClass(seed) {
  const text = String(seed || "pantrypal");
  const sum = [...text].reduce((total, character) => total + character.charCodeAt(0), 0);
  return imageClasses[sum % imageClasses.length];
}

function getThumbClass(recipe) {
  if (typeof recipe.image === "string" && recipe.image.startsWith("thumb-")) {
    return recipe.image;
  }
  return recipe.imageClass || "thumb-green";
}

function setApiStatus(isOnline, label) {
  refs.apiStatus.textContent = label;
  refs.apiStatus.classList.toggle("status-online", Boolean(isOnline));
  refs.apiStatus.classList.toggle("status-offline", !isOnline);
}

function setResultsError(message = "") {
  refs.resultsError.textContent = message;
}

async function initializePublicConfig() {
  state.publicConfig = await fetchJson(PUBLIC_CONFIG_URL);

  if (refs.environmentBanner) {
    if (isLocalMode()) {
      refs.environmentBanner.textContent = "Local mode: PantryPal account login works here, while hosted Google auth, real reset email, and Stripe are designed for the deployed site.";
      refs.environmentBanner.classList.remove("is-hidden");
    } else {
      refs.environmentBanner.classList.add("is-hidden");
    }
  }

  if (isStripeEnabled() && window.Stripe) {
    state.stripe = window.Stripe(state.publicConfig.stripe.publishableKey);
  }

  if (isHostedAuthEnabled() && window.firebase) {
    if (!window.firebase.apps.length) {
      window.firebase.initializeApp({
        apiKey: state.publicConfig.firebase.apiKey,
        authDomain: state.publicConfig.firebase.authDomain,
        projectId: state.publicConfig.firebase.projectId,
        appId: state.publicConfig.firebase.appId,
        messagingSenderId: state.publicConfig.firebase.messagingSenderId
      });
    }
    state.firebaseAuth = window.firebase.auth();
    if (window.location.search.includes("google=redirect")) {
      try {
        const redirectResult = await state.firebaseAuth.getRedirectResult();
        if (redirectResult?.user) {
          await handleGoogleUser(redirectResult.user);
        }
      } catch (error) {
        showToast(error.message || "Google sign-in did not complete.", "error");
      } finally {
        clearQueryParams();
      }
    }
  }

  if (refs.paymentNote && isStripeEnabled()) {
    refs.paymentNote.textContent = "PantryPal sends you to Stripe Checkout for secure real-time payment processing.";
  }
}

function startWelcomeSlideshow() {
  if (!welcomeSlides.length) return;
  let currentSlide = 0;
  window.setInterval(() => {
    welcomeSlides[currentSlide].classList.remove("is-active");
    currentSlide = (currentSlide + 1) % welcomeSlides.length;
    welcomeSlides[currentSlide].classList.add("is-active");
  }, 2800);
}

function parseFavoriteInput(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function getCurrentUserEmail() {
  return normalizeTerm(state.currentUser?.email);
}

function getPlanPriceLabel(planName) {
  const text = String(planName || "").toLowerCase();
  if (text.includes("weekly")) return "$0.01/week";
  if (text.includes("month")) return "$0.02/month";
  return "Free";
}

function getDaysLeft(endsAt) {
  if (!endsAt) return "Not active";
  const diff = new Date(endsAt).getTime() - Date.now();
  if (Number.isNaN(diff)) return "Not active";
  return `${Math.max(0, Math.ceil(diff / 86400000))} day(s)`;
}

function updateMembershipChip() {
  if (!refs.membershipChip) return;
  const plan = state.currentUser?.subscription?.plan || "Free Plan";
  refs.membershipChip.textContent = plan;
}

function renderSessionChrome() {
  const guest = state.isGuestSession;
  refs.userGreeting.textContent = guest ? `Hi ${state.currentUser?.username || "Guest"}` : `Hi ${state.currentUser?.username || "PantryPal User"}`;
  refs.personalTab.classList.toggle("is-hidden", guest);
  refs.profileTab.classList.toggle("is-hidden", guest);
  refs.shoppingTab.classList.toggle("is-hidden", guest);
  refs.sessionAction.textContent = guest ? "Login" : "Logout";
  refs.guestRefresh.classList.toggle("is-hidden", !guest);
  refs.ingredientForm.classList.remove("is-hidden");
  updateMembershipChip();
}

function unlockApp(user, isGuest = false) {
  state.currentUser = normalizeUser(user);
  state.isGuestSession = isGuest;
  renderSessionChrome();
  renderProfile();
  renderSavedRecipes();
  renderPricing();
  renderRecommendations().catch((error) => {
    showToast(error.message || "Recommendations could not be loaded.", "error");
  });
  activateScreen("dashboard");
}

function resetSession() {
  state.currentUser = null;
  state.isGuestSession = false;
  state.currentResults = [];
  state.currentRecipe = null;
  state.currentMealPlan = [];
  state.currentPlanDayIndex = 0;
  state.activeShoppingCategory = "All";
  refs.loginForm.reset();
  refs.ingredientInput.value = "";
  activateScreen("welcome");
}

function buildLocalResults(query) {
  const wantedTerms = parseFavoriteInput(query).map((item) => item.toLowerCase());
  const ranked = recipePool
    .map((recipe) => {
      const matches = recipe.ingredients.filter((ingredient) =>
        wantedTerms.some((term) => ingredient.toLowerCase().includes(term) || recipe.title.toLowerCase().includes(term))
      );
      return {
        ...recipe,
        imageClass: typeof recipe.image === "string" && recipe.image.startsWith("thumb-") ? recipe.image : getImageClass(recipe.id),
        matchedCount: matches.length,
        match: wantedTerms.length ? Math.max(55, Math.min(99, Math.round((matches.length / wantedTerms.length) * 100))) : recipe.match
      };
    })
    .filter((recipe) => wantedTerms.length === 0 || recipe.matchedCount > 0)
    .sort((left, right) => right.matchedCount - left.matchedCount || right.match - left.match);
  return ranked.length ? ranked.slice(0, 12) : recipePool.slice(0, 6);
}

function normalizeMealDbMeal(meal, fallbackMatch = 85) {
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    match: fallbackMatch,
    image: meal.strMealThumb || "",
    imageClass: getImageClass(meal.idMeal),
    ingredients: [],
    ingredientDetails: [],
    category: meal.strCategory || "",
    area: meal.strArea || "",
    instructions: meal.strInstructions ? meal.strInstructions.split(/\r?\n/).map((step) => step.trim()).filter(Boolean) : [],
    readyInMinutes: 25,
    servings: 2
  };
}

function extractMealDbIngredients(meal) {
  const ingredients = [];
  for (let index = 1; index <= 20; index += 1) {
    const ingredient = meal[`strIngredient${index}`]?.trim();
    const measure = meal[`strMeasure${index}`]?.trim();
    if (ingredient) {
      ingredients.push({
        name: ingredient,
        measure: measure || "1 portion"
      });
    }
  }
  return ingredients;
}

function splitInstructions(text) {
  if (!text) return [];
  const normalized = text.replace(/\r/g, "\n").replace(/\n{2,}/g, "\n").trim();
  const lines = normalized.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length > 1) return lines;
  return normalized
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((step) => step.trim())
    .filter(Boolean);
}

function buildFallbackInstructions(recipe) {
  const ingredientNames = recipe.ingredientDetails?.map((item) => item.name) || recipe.ingredients || [];
  const summary = ingredientNames.slice(0, 4).join(", ");
  return [
    `Prepare the main ingredients first: ${summary || "all required ingredients"}.`,
    "Start cooking the ingredients that take the longest first, then layer in the remaining items.",
    "Stir and season gradually so the dish stays balanced and the texture is even.",
    "Taste before serving and adjust salt, sauce, or herbs if needed.",
    "Serve warm and enjoy immediately."
  ];
}

async function fetchMealDbRecipeDetail(mealId, baseRecipe) {
  const data = await fetchJson(`${THEMEALDB_BASE}/lookup.php?i=${encodeURIComponent(mealId)}`);
  const meal = data.meals?.[0];
  if (!meal) return baseRecipe;
  const ingredientDetails = extractMealDbIngredients(meal);
  return {
    ...normalizeMealDbMeal(meal, baseRecipe?.match || 85),
    match: baseRecipe?.match || 85,
    ingredients: ingredientDetails.map((item) => `${item.measure} ${item.name}`.trim()),
    ingredientDetails,
    instructions: splitInstructions(meal.strInstructions),
    tip: meal.strCategory
      ? `Tip: This meal is in the ${meal.strCategory} category${meal.strArea ? ` and inspired by ${meal.strArea} cuisine` : ""}.`
      : "Tip: Keep similar pantry staples on hand so matching meals are easier to repeat."
  };
}

async function enrichMealDbRecipes(recipes, limit = 8) {
  const slice = recipes.slice(0, limit);
  const enriched = await Promise.all(
    slice.map(async (recipe) => {
      if (!recipe?.id) return recipe;
      try {
        return await fetchMealDbRecipeDetail(recipe.id, recipe);
      } catch (_error) {
        return recipe;
      }
    })
  );
  return enriched;
}

async function fetchGuestRecommendations() {
  const requests = Array.from({ length: 6 }, () =>
    fetchJson(`${THEMEALDB_BASE}/random.php?seed=${state.lastGuestRecommendationSeed}`)
  );
  const results = await Promise.all(requests);
  const meals = results
    .map((result, index) => normalizeMealDbMeal(result.meals?.[0], 80 + (index % 15)))
    .filter((meal) => meal.id);
  return enrichMealDbRecipes(meals, meals.length);
}

async function fetchFavoriteIngredientPool(favorites, perIngredient = 8) {
  if (!favorites?.length) return [];
  const results = await Promise.all(
    favorites.map(async (favorite) => {
      try {
        const data = await fetchJson(`${THEMEALDB_BASE}/filter.php?i=${encodeURIComponent(favorite)}`);
        return (data.meals || []).slice(0, perIngredient).map((meal) => normalizeMealDbMeal(meal, 84));
      } catch (_error) {
        return [];
      }
    })
  );

  const unique = [];
  const seen = new Set();
  results.flat().forEach((meal) => {
    if (!seen.has(meal.id)) {
      seen.add(meal.id);
      unique.push(meal);
    }
  });

  const enriched = await enrichMealDbRecipes(unique, unique.length);
  return enriched
    .map((recipe) => {
      const score = (recipe.ingredientDetails || []).filter((item) =>
        favorites.some((favorite) => item.name.toLowerCase().includes(favorite.toLowerCase()))
      ).length;
      return {
        ...recipe,
        score,
        match: Math.max(72, Math.min(99, 70 + score * 8))
      };
    })
    .sort((left, right) => right.score - left.score || right.match - left.match);
}

function groupRecipesForSevenDays(pool) {
  const labels = ["Breakfast", "Morning Tea", "Lunch", "Afternoon Tea", "Dinner", "Supper"];
  if (!pool.length) {
    pool = buildLocalResults((state.currentUser?.favorites || []).join(", "));
  }
  return Array.from({ length: 7 }, (_, dayIndex) => {
    const usedNames = new Set();
    const meals = labels.map((label, labelIndex) => {
      let recipe = pool[(dayIndex + labelIndex) % pool.length];
      let offset = 0;
      while (recipe && usedNames.has(recipe.title) && offset < pool.length) {
        offset += 1;
        recipe = pool[(dayIndex + labelIndex + offset) % pool.length];
      }
      if (recipe) usedNames.add(recipe.title);
      return {
        label,
        recipe: recipe || recipePool[(dayIndex + labelIndex) % recipePool.length]
      };
    });
    return { day: dayIndex + 1, meals };
  });
}

function normalizeIngredientMeasure(name, measure) {
  const cleanName = String(name || "")
    .replace(/\bfor greasing\b/gi, "")
    .replace(/\bto serve\b/gi, "")
    .replace(/\bfor garnish\b/gi, "")
    .trim();
  const cleanMeasure = String(measure || "")
    .replace(/\bfor greasing\b/gi, "")
    .replace(/\bto serve\b/gi, "")
    .replace(/\bfor garnish\b/gi, "")
    .trim();
  return {
    name: cleanName || "Ingredient",
    measure: cleanMeasure || "As needed"
  };
}

function categorizeIngredient(name) {
  const text = String(name || "").toLowerCase();
  if (/(milk|cheese|butter|cream|yogurt|paneer|mozzarella|parmesan|feta)/.test(text)) return "Dairy";
  if (/(tomato|spinach|lettuce|onion|garlic|broccoli|pumpkin|cucumber|mushroom|pepper|potato|avocado|basil)/.test(text)) return "Vegetables";
  if (/(chicken|beef|pork|bacon|turkey|lamb|meat|shrimp|fish)/.test(text)) return "Meat";
  if (/(frozen|peas|ice cream)/.test(text)) return "Frozen";
  if (/(rice|pasta|quinoa|oil|soy sauce|stock|flour|sugar|salt|spice|rosemary|olive|curry)/.test(text)) return "Pantry";
  return "More";
}

function summarizeMeasures(measures) {
  const parts = measures.map((item) => String(item || "").trim()).filter(Boolean);
  if (!parts.length) return "As needed";

  const numeric = new Map();
  const text = new Set();

  parts.forEach((part) => {
    const match = part.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z]+)$/);
    if (match) {
      const amount = Number(match[1]);
      const unit = match[2].toLowerCase();
      numeric.set(unit, (numeric.get(unit) || 0) + amount);
      return;
    }
    text.add(part);
  });

  const summarized = [...numeric.entries()].map(([unit, total]) => `${total}${unit}`);
  return [...summarized, ...text].join(", ") || "As needed";
}

function renderShoppingList() {
  const aggregated = new Map();

  state.currentMealPlan.forEach((dayPlan) => {
    dayPlan.meals.forEach((meal) => {
      const details = meal.recipe.ingredientDetails?.length
        ? meal.recipe.ingredientDetails
        : (meal.recipe.ingredients || []).map((ingredient) => {
            const match = String(ingredient).match(/^(.+?)\s+([A-Za-z].*)$/);
            if (match) {
              return normalizeIngredientMeasure(match[2], match[1]);
            }
            return normalizeIngredientMeasure(ingredient, "As needed");
          });

      details.slice(0, 6).forEach((item) => {
        const normalized = normalizeIngredientMeasure(item.name, item.measure);
        const key = normalized.name.toLowerCase();
        if (!aggregated.has(key)) {
          aggregated.set(key, {
            name: normalized.name,
            amounts: [],
            category: categorizeIngredient(normalized.name)
          });
        }
        aggregated.get(key).amounts.push(normalized.measure);
      });
    });
  });

  const allItems = [...aggregated.values()].sort((left, right) => left.name.localeCompare(right.name));
  const categories = ["All", ...new Set(allItems.map((item) => item.category))];
  if (!categories.includes(state.activeShoppingCategory)) {
    state.activeShoppingCategory = "All";
  }

  refs.shoppingTabs.innerHTML = categories
    .map((category) => `
      <button class="shopping-tab ${category === state.activeShoppingCategory ? "is-active" : ""}" type="button" data-shopping-category="${category}">
        ${category}
      </button>
    `)
    .join("");

  [...refs.shoppingTabs.querySelectorAll("[data-shopping-category]")].forEach((button) => {
    button.addEventListener("click", () => {
      state.activeShoppingCategory = button.dataset.shoppingCategory;
      renderShoppingList();
    });
  });

  const shoppingItems = allItems
    .filter((item) => state.activeShoppingCategory === "All" || item.category === state.activeShoppingCategory)
    .map((item) => `
      <div class="shopping-item">
        <strong>${item.name}</strong>
        <span>${summarizeMeasures(item.amounts)}</span>
      </div>
    `)
    .join("");

  const weeklyDays = state.currentMealPlan
    .map((dayPlan) => `
      <div class="weekly-plan-day">
        <h4>Day ${dayPlan.day}</h4>
        <p>${dayPlan.meals.map((meal) => `${meal.label}: ${meal.recipe.title}`).join(" | ")}</p>
      </div>
    `)
    .join("");

  refs.shoppingGrid.innerHTML = `
    <section class="shopping-card">
      <h3>This Week</h3>
      <div class="shopping-week-grid">
        <div>
          <h4>${state.activeShoppingCategory} Items</h4>
          <div class="shopping-list">${shoppingItems || "<p>No shopping items available.</p>"}</div>
        </div>
        <div>
          <h4>7 Day Plan</h4>
          <div class="weekly-plan-mini">${weeklyDays || "<p>No weekly plan available.</p>"}</div>
        </div>
      </div>
    </section>
  `;
}

function renderSavedRecipes() {
  const recipes = state.currentUser?.savedRecipes || [];
  const markup = recipes.length
    ? recipes.map((recipe) => `
        <article class="saved-recipe-item">
          <div>
            <strong>${recipe.title}</strong>
            <span>${recipe.match ? `${recipe.match}% match` : "Saved recipe"}</span>
          </div>
          <div class="saved-recipe-actions">
            <button class="secondary-button" type="button" data-open-saved="${recipe.id}">Open</button>
            <button class="ghost-link" type="button" data-remove-saved="${recipe.id}">Remove</button>
          </div>
        </article>
      `).join("")
    : `<p class="empty-state">Save recipes you like so they stay available in your account.</p>`;

  refs.savedRecipesList.innerHTML = markup;
  refs.profileSavedRecipes.innerHTML = markup;

  [refs.savedRecipesList, refs.profileSavedRecipes].forEach((container) => {
    [...container.querySelectorAll("[data-open-saved]")].forEach((button) => {
      button.addEventListener("click", () => {
        const recipe = recipes.find((item) => String(item.id) === button.dataset.openSaved);
        if (recipe) openRecipe(recipe);
      });
    });
    [...container.querySelectorAll("[data-remove-saved]")].forEach((button) => {
      button.addEventListener("click", async () => {
        await removeSavedRecipe(button.dataset.removeSaved);
      });
    });
  });
}

function renderMealSlot(meal) {
  const recipe = meal.recipe;
  const thumbStyle = recipe.image && !String(recipe.image).startsWith("thumb-")
    ? `style="background-image: linear-gradient(180deg, rgba(15, 23, 17, 0.08), rgba(15, 23, 17, 0.18)), url('${recipe.image}'); background-size: cover; background-position: center;"`
    : "";

  return `
    <button class="meal-slot meal-slot-card" type="button" data-plan-recipe="${recipe.id}">
      <div class="meal-slot-photo thumb ${getThumbClass(recipe)}" ${thumbStyle}></div>
      <div class="meal-slot-copy">
        <strong>${meal.label}</strong>
        <span>${recipe.title}</span>
        <span>Key ingredients: ${(recipe.ingredientDetails || [])
          .slice(0, 3)
          .map((item) => item.name)
          .join(", ") || (recipe.ingredients || []).slice(0, 3).join(", ")}</span>
      </div>
    </button>
  `;
}

function attachPlanRecipeActions() {
  [...refs.recommendationGrid.querySelectorAll("[data-plan-recipe]")].forEach((button) => {
    button.addEventListener("click", () => {
      const recipe = state.currentMealPlan
        .flatMap((day) => day.meals)
        .find((meal) => String(meal.recipe.id) === button.dataset.planRecipe)?.recipe;
      if (recipe) openRecipe(recipe);
    });
  });
}

function renderWeeklySlider(plan) {
  if (!plan.length) {
    refs.recommendationGrid.innerHTML = "";
    return;
  }

  state.currentPlanDayIndex = Math.min(state.currentPlanDayIndex, plan.length - 1);
  const dayPlan = plan[state.currentPlanDayIndex];

  refs.recommendationGrid.className = "meal-plan-slider";
  refs.recommendationGrid.innerHTML = `
    <button class="slider-nav" type="button" id="plan-prev" ${state.currentPlanDayIndex === 0 ? "disabled" : ""}>&lt;</button>
    <article class="day-plan-card week-plan-card">
      <h3>Day ${dayPlan.day}</h3>
      <div class="meal-slot-list">
        ${dayPlan.meals.map((meal) => renderMealSlot(meal)).join("")}
      </div>
    </article>
    <button class="slider-nav" type="button" id="plan-next" ${state.currentPlanDayIndex === plan.length - 1 ? "disabled" : ""}>&gt;</button>
  `;

  refs.recommendationGrid.querySelector("#plan-prev")?.addEventListener("click", () => {
    if (state.currentPlanDayIndex > 0) {
      state.currentPlanDayIndex -= 1;
      renderWeeklySlider(plan);
      attachPlanRecipeActions();
    }
  });

  refs.recommendationGrid.querySelector("#plan-next")?.addEventListener("click", () => {
    if (state.currentPlanDayIndex < plan.length - 1) {
      state.currentPlanDayIndex += 1;
      renderWeeklySlider(plan);
      attachPlanRecipeActions();
    }
  });
}

function renderRecipeDetail(recipe) {
  state.currentRecipe = recipe;
  const title = recipe.title || "Recipe";
  const match = recipe.match ? ` <span>(${recipe.match}% match)</span>` : "";
  refs.recipeTitle.innerHTML = `${title}${match}`;
  refs.recipeHero.className = `hero-dish thumb ${getThumbClass(recipe)}`;
  if (recipe.image && !recipe.image.startsWith("thumb-")) {
    refs.recipeHero.style.backgroundImage = `linear-gradient(180deg, rgba(15, 23, 17, 0.08), rgba(15, 23, 17, 0.18)), url("${recipe.image}")`;
    refs.recipeHero.style.backgroundSize = "cover";
    refs.recipeHero.style.backgroundPosition = "center";
  } else {
    refs.recipeHero.style.backgroundImage = "";
  }

  const ingredients = recipe.ingredients?.length
    ? recipe.ingredients
    : recipe.ingredientDetails?.map((item) => `${item.measure} ${item.name}`)
    || ["Ingredient details unavailable"];

  refs.recipeIngredients.innerHTML = ingredients.map((ingredient) => `<li class="ok">${ingredient}</li>`).join("");
  refs.recipeReady.textContent = recipe.readyInMinutes ? `${recipe.readyInMinutes} mins` : "20 mins";
  refs.recipeServings.textContent = recipe.servings || "2";

  const steps = recipe.instructions?.length ? recipe.instructions : buildFallbackInstructions(recipe);
  refs.recipeInstructions.innerHTML = steps.map((step) => `<li>${step}</li>`).join("");
  refs.recipeTip.textContent = recipe.tip || `Recipe notes: ${recipe.category || "Meal"}${recipe.area ? `, ${recipe.area} style` : ""}.`;

  refs.saveRecipeButton.disabled = state.isGuestSession;
  refs.saveRecipeButton.textContent = state.isGuestSession ? "Login to save recipes" : "Save to Favourites";
}

async function openRecipe(recipe) {
  if (!recipe) return;
  state.recipeReturnScreen = state.currentMealPlan.length ? "dashboard" : "results";
  try {
    const detailedRecipe = recipe.id && !String(recipe.id).startsWith("local-")
      ? await fetchMealDbRecipeDetail(recipe.id, recipe)
      : recipe;
    renderRecipeDetail(detailedRecipe);
  } catch (_error) {
    renderRecipeDetail(recipe);
  }
  activateScreen("recipe");
}

function attachRecipeCardActions(scope) {
  [...scope.querySelectorAll("[data-recipe-id]")].forEach((button) => {
    button.addEventListener("click", () => {
      const recipe = state.currentResults.find((item) => String(item.id) === button.dataset.recipeId);
      if (recipe) openRecipe(recipe);
    });
  });
}

function renderResults(recipes, label) {
  state.currentResults = recipes;
  refs.resultsTitle.textContent = `Results for ${label}`;
  refs.resultsNote.textContent = `Showing recipe matches for ${label}.`;
  setResultsError("");

  refs.resultsGrid.innerHTML = recipes
    .map((recipe) => `
      <article class="result-card">
        <div class="thumb ${getThumbClass(recipe)}">
          <span class="match-pill">${recipe.match}% Match</span>
        </div>
        <div class="result-card-body">
          <h3>${recipe.title}</h3>
          <ul class="ingredient-list">
            ${(recipe.ingredients || recipe.ingredientDetails?.map((item) => item.name) || []).slice(0, 4).map((ingredient) => `<li>${ingredient}</li>`).join("")}
          </ul>
          <button class="primary-button" type="button" data-recipe-id="${recipe.id}">View Recipe</button>
        </div>
      </article>
    `)
    .join("");

  [...refs.resultsGrid.querySelectorAll(".thumb")].forEach((thumb, index) => {
    const recipe = recipes[index];
    if (recipe?.image && !String(recipe.image).startsWith("thumb-")) {
      thumb.style.backgroundImage = `linear-gradient(180deg, rgba(15, 23, 17, 0.08), rgba(15, 23, 17, 0.18)), url("${recipe.image}")`;
      thumb.style.backgroundSize = "cover";
      thumb.style.backgroundPosition = "center";
    }
  });

  attachRecipeCardActions(refs.resultsGrid);
}

async function searchRecipes(query) {
  const trimmed = String(query || "").trim();
  if (!trimmed) {
    const guestResults = await fetchGuestRecommendations();
    return guestResults;
  }

  const terms = parseFavoriteInput(trimmed);
  try {
    if (terms.length <= 1) {
      const search = await fetchJson(`${THEMEALDB_BASE}/search.php?s=${encodeURIComponent(trimmed)}`);
      if (search.meals?.length) {
        const results = search.meals.map((meal, index) => normalizeMealDbMeal(meal, 85 + (index % 12)));
        return enrichMealDbRecipes(results, results.length);
      }
    }

    const ingredientSearch = await fetchJson(`${THEMEALDB_BASE}/filter.php?i=${encodeURIComponent(trimmed)}`);
    const meals = (ingredientSearch.meals || []).map((meal, index) => normalizeMealDbMeal(meal, 82 + (index % 14)));
    if (meals.length) {
      return enrichMealDbRecipes(meals, meals.length);
    }
  } catch (error) {
    setResultsError(`Recipe search fell back to local results: ${error.message}`);
  }

  return buildLocalResults(trimmed);
}

async function renderRecommendations() {
  refs.recommendationGrid.innerHTML = "";
  refs.recommendationPreview.innerHTML = "";

  if (state.isGuestSession) {
    refs.recommendationHeading.textContent = "Guest Recommendations";
    refs.dashboardNote.textContent = "Guest mode shows a fresh selection shaped by your temporary favourite ingredients, plus broader general recommendations.";
    let guestResults;
    try {
      guestResults = await fetchGuestRecommendations();
    } catch (_error) {
      guestResults = buildLocalResults((state.currentUser?.favorites || []).join(", "));
    }

    state.currentResults = guestResults;
    refs.recommendationPreview.innerHTML = `
      <div class="preview-card">
        <strong>Session ingredients</strong>
        <span>${(state.currentUser?.favorites || []).join(", ") || "No guest favourites selected"}.</span>
      </div>
    `;

    refs.recommendationGrid.className = "card-row";
    refs.recommendationGrid.innerHTML = guestResults.map((recipe) => `
      <article class="recipe-card">
        <div class="thumb ${getThumbClass(recipe)}"></div>
        <div class="recipe-card-body">
          <h3>${recipe.title}</h3>
          <p>Guest recommendation</p>
          <button class="primary-button guest-recipe-button" type="button" data-recipe-id="${recipe.id}">View Recipe</button>
        </div>
      </article>
    `).join("");

    [...refs.recommendationGrid.querySelectorAll(".thumb")].forEach((thumb, index) => {
      const recipe = guestResults[index];
      if (recipe?.image && !String(recipe.image).startsWith("thumb-")) {
        thumb.style.backgroundImage = `linear-gradient(180deg, rgba(15, 23, 17, 0.08), rgba(15, 23, 17, 0.18)), url("${recipe.image}")`;
        thumb.style.backgroundSize = "cover";
        thumb.style.backgroundPosition = "center";
      }
    });

    attachRecipeCardActions(refs.recommendationGrid);
    renderShoppingList();
    return;
  }

  refs.recommendationHeading.textContent = "Your 7 Day Personal Recommendation Plan";
  const favorites = state.currentUser?.favorites?.length ? state.currentUser.favorites : ["Chicken", "Rice", "Tomato"];
  refs.dashboardNote.textContent = `Using your saved ingredients (${favorites.join(", ")}) and favourite recipes to keep each week practical and consistent.`;

  let pool;
  try {
    pool = await fetchFavoriteIngredientPool(favorites, 10);
  } catch (_error) {
    pool = buildLocalResults(favorites.join(", "));
  }

  if (state.currentUser?.savedRecipes?.length) {
    const savedRecipeTitles = new Set(state.currentUser.savedRecipes.map((recipe) => recipe.title));
    const boostedSaved = state.currentUser.savedRecipes
      .filter((recipe) => !savedRecipeTitles.has(recipe.title) || true)
      .map((recipe) => ({ ...recipe, match: Math.max(recipe.match || 88, 92) }));
    pool = [...boostedSaved, ...pool.filter((recipe) => !savedRecipeTitles.has(recipe.title))];
  }

  state.currentMealPlan = groupRecipesForSevenDays(pool);
  state.currentPlanDayIndex = 0;
  state.currentResults = state.currentMealPlan.flatMap((day) => day.meals.map((meal) => meal.recipe));
  const firstDay = state.currentMealPlan[0];
  refs.recommendationPreview.innerHTML = firstDay ? `
    <div class="preview-card">
      <strong>Today&apos;s plan</strong>
      <span>${firstDay.meals.map((meal) => `${meal.label}: ${meal.recipe.title}`).join(" | ")}</span>
    </div>
  ` : "";

  renderWeeklySlider(state.currentMealPlan);
  attachPlanRecipeActions();
  renderShoppingList();
}

function renderProfile() {
  if (!state.currentUser) return;
  refs.profileUsername.value = state.currentUser.username || "";
  refs.profileEmail.value = state.currentUser.email || "";
  refs.profilePassword.value = state.currentUser.password || "";
  refs.profileAccountStatus.textContent = state.currentUser.accountStatus || "active";
  refs.profileAccountNote.textContent = state.currentUser.accountStatus === "deactivated"
    ? "This PantryPal account is currently deactivated."
    : "Your PantryPal account is active and available for sign-in.";

  refs.favoriteList.innerHTML = (state.currentUser.favorites || [])
    .map((favorite, index) => `
      <span class="favorite-chip">
        ${favorite}
        <button type="button" data-remove-favorite="${index}">x</button>
      </span>
    `)
    .join("");

  [...refs.favoriteList.querySelectorAll("[data-remove-favorite]")].forEach((button) => {
    button.addEventListener("click", async () => {
      state.currentUser.favorites.splice(Number(button.dataset.removeFavorite), 1);
      await persistCurrentUser("Favourite ingredient removed.");
      renderProfile();
      renderRecommendations().catch(() => {});
    });
  });
}

function renderPricing() {
  if (!state.currentUser) return;
  const subscription = state.currentUser.subscription || { plan: "Free Plan", status: "inactive" };
  const active = subscription.status === "active" && subscription.plan !== "Free Plan";
  refs.subscriptionManage.classList.toggle("is-hidden", !active);
  refs.pricingGrid.classList.toggle("is-hidden", active);

  if (active) {
    refs.subscriptionStatusBadge.textContent = "Active subscription";
    refs.subscriptionActivePlan.textContent = subscription.plan;
    refs.subscriptionManageNote.textContent = "Your PantryPal subscription is active and ready for premium recommendations and planning.";
    refs.subscriptionCurrentPlan.textContent = subscription.plan;
    refs.subscriptionCurrentStatus.textContent = subscription.status;
    refs.subscriptionCurrentBilling.textContent = getPlanPriceLabel(subscription.plan);
    refs.subscriptionDaysLeft.textContent = getDaysLeft(subscription.endsAt);
  }
}

async function persistCurrentUser(successMessage = "") {
  if (state.isGuestSession || !state.currentUser?.email) return;
  const payload = { user: state.currentUser };
  const result = await fetchJson(`/api/users/${encodeURIComponent(state.currentUser.email)}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
  state.currentUser = normalizeUser(result.user);
  renderSavedRecipes();
  renderPricing();
  if (successMessage) {
    showToast(successMessage, "success");
  }
}

async function removeSavedRecipe(recipeId) {
  if (state.isGuestSession) return;
  state.currentUser.savedRecipes = (state.currentUser.savedRecipes || []).filter((recipe) => String(recipe.id) !== String(recipeId));
  await persistCurrentUser("Favourite recipe removed.");
}

async function saveCurrentRecipe() {
  if (state.isGuestSession) {
    showToast("Login to save favourite recipes.", "error");
    return;
  }
  if (!state.currentRecipe) return;
  const savedRecipes = state.currentUser.savedRecipes || [];
  if (savedRecipes.some((recipe) => String(recipe.id) === String(state.currentRecipe.id))) {
    showToast("This recipe is already saved.", "info");
    return;
  }
  state.currentUser.savedRecipes = [state.currentRecipe, ...savedRecipes].slice(0, 20);
  await persistCurrentUser("Favourite recipe saved.");
}

async function handleCheckoutStatus() {
  const checkoutStatus = getQueryParam("checkout");
  const sessionId = getQueryParam("session_id");
  if (!checkoutStatus) return;

  if (checkoutStatus === "cancelled") {
    showToast("Stripe checkout was cancelled.", "info");
    clearQueryParams();
    activateScreen("pricing");
    return;
  }

  if (checkoutStatus === "success" && sessionId) {
    try {
      const result = await fetchJson(`/api/stripe/session-status?session_id=${encodeURIComponent(sessionId)}`);
      state.currentUser = normalizeUser(result.user);
      renderPricing();
      renderSessionChrome();
      showToast("Subscription activated successfully.", "success");
      clearQueryParams();
      activateScreen("pricing");
    } catch (error) {
      showToast(error.message || "Stripe checkout could not be confirmed.", "error");
    }
  }
}

async function handleResetToken() {
  const resetToken = getQueryParam("reset_token");
  if (!resetToken) return false;
  refs.resetToken.value = resetToken;
  setHelperText(refs.resetPasswordNote, "Use at least 6 characters. This secure reset link expires automatically.", "info");
  activateScreen("reset-password-screen");
  return true;
}

async function handleGoogleUser(firebaseUser) {
  const displayName = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "PantryPal User";
  const sync = await fetchJson("/api/auth/firebase-sync", {
    method: "POST",
    body: JSON.stringify({
      username: displayName,
      email: firebaseUser.email,
      favorites: [],
      authProvider: "google",
      sendLoginEmail: true
    })
  });
  unlockApp(sync.user, false);
  showToast(sync.notificationEmailSent ? "Google sign-in complete. PantryPal sent a sign-in email." : "Google sign-in complete.", "success");
}

async function continueWithGoogle() {
  if (isHostedAuthEnabled() && state.firebaseAuth) {
    try {
      const provider = new window.firebase.auth.GoogleAuthProvider();
      try {
        const result = await state.firebaseAuth.signInWithPopup(provider);
        await handleGoogleUser(result.user);
      } catch (popupError) {
        if (popupError.code === "auth/popup-blocked" || popupError.code === "auth/popup-closed-by-user") {
          await state.firebaseAuth.signInWithRedirect(provider);
          const url = new URL(window.location.href);
          url.searchParams.set("google", "redirect");
          window.location.assign(url.toString());
          return;
        }
        throw popupError;
      }
    } catch (error) {
      showToast(error.message || "Google authentication failed.", "error");
    }
    return;
  }

  activateScreen("google-auth");
}

async function handleLocalGoogleSelection(button) {
  try {
    const endpoint = button.dataset.googleDemo === "true" ? "/api/auth/google-demo" : "/api/auth/google-select";
    const payload = button.dataset.googleDemo === "true"
      ? {
          username: "Alex Google",
          email: button.dataset.googleEmail,
          password: "GoogleAuth"
        }
      : {
          email: button.dataset.googleEmail
        };
    const result = await fetchJson(endpoint, {
      method: "POST",
      body: JSON.stringify(payload)
    });
    unlockApp(result.user, false);
    showToast("Google fallback account selected.", "success");
  } catch (error) {
    showToast(error.message || "Google account could not be opened.", "error");
  }
}

async function handleLogin(event) {
  event.preventDefault();
  try {
    const result = await fetchJson("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        identity: refs.loginIdentity.value.trim(),
        password: refs.loginPassword.value
      })
    });
    unlockApp(result.user, false);
    showToast("Login successful.", "success");
  } catch (error) {
    showToast(error.message || "Login failed.", "error");
  }
}

async function handleSignup(event) {
  event.preventDefault();
  const username = refs.signupUsername.value.trim();
  const email = refs.signupEmail.value.trim();
  const password = refs.signupPassword.value;
  const confirmPassword = refs.signupConfirmPassword.value;

  if (!username || !email || !password) {
    showToast("Username, email, and password are required.", "error");
    return;
  }
  if (password !== confirmPassword) {
    showToast("Passwords do not match.", "error");
    return;
  }

  try {
    const result = await fetchJson("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify({ username, email, password })
    });
    showToast(
      result.notificationEmailSent
        ? "Account created and welcome email sent."
        : "Account created successfully.",
      "success"
    );
    refs.signupForm.reset();
    activateScreen("welcome");
  } catch (error) {
    showToast(error.message || "Sign-up failed.", "error");
  }
}

async function handleGuestStart(event) {
  event.preventDefault();
  const guestName = refs.guestName.value.trim() || "Guest";
  const favorites = parseFavoriteInput(refs.guestFavorites.value);
  unlockApp({
    username: guestName,
    email: "",
    password: "",
    favorites,
    savedRecipes: [],
    subscription: { plan: "Guest", status: "inactive" }
  }, true);
  showToast("Guest session started.", "success");
}

async function handleForgotPassword(event) {
  event.preventDefault();
  const identity = refs.forgotIdentity.value.trim();
  if (!identity) {
    setHelperText(refs.forgotPasswordNote, "Enter your username or email first.", "error");
    return;
  }

  if (!isPasswordResetEnabled()) {
    setHelperText(refs.forgotPasswordNote, "Password reset email is not configured for this environment yet.", "error");
    return;
  }

  try {
    const result = await fetchJson("/api/auth/request-password-reset", {
      method: "POST",
      body: JSON.stringify({ identity })
    });
    setHelperText(
      refs.forgotPasswordNote,
      result.notificationEmailSent
        ? `Reset email sent to ${result.email}. The secure link expires in 60 minutes.`
        : `Reset link prepared for ${result.email}, but PantryPal could not confirm email delivery.`,
      result.notificationEmailSent ? "success" : "warning"
    );
    showToast("Password reset request processed.", "success");
  } catch (error) {
    setHelperText(refs.forgotPasswordNote, error.message || "Password reset request failed.", "error");
  }
}

async function handlePasswordReset(event) {
  event.preventDefault();
  const password = refs.resetPassword.value;
  const confirmPassword = refs.resetPasswordConfirm.value;
  const token = refs.resetToken.value;

  if (!token) {
    setHelperText(refs.resetPasswordNote, "This reset link is invalid.", "error");
    return;
  }
  if (password.length < 6) {
    setHelperText(refs.resetPasswordNote, "Use at least 6 characters.", "error");
    return;
  }
  if (password !== confirmPassword) {
    setHelperText(refs.resetPasswordNote, "Passwords do not match.", "error");
    return;
  }

  try {
    await fetchJson("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password })
    });
    showToast("Password updated. You can sign in now.", "success");
    refs.resetPasswordForm.reset();
    clearQueryParams();
    activateScreen("welcome");
  } catch (error) {
    setHelperText(refs.resetPasswordNote, error.message || "Password reset failed.", "error");
  }
}

async function handleProfileSave(event) {
  event.preventDefault();
  if (state.isGuestSession) {
    showToast("Guest sessions do not save account changes.", "info");
    return;
  }

  state.currentUser.username = refs.profileUsername.value.trim() || state.currentUser.username;
  if (refs.profilePassword.value.trim()) {
    state.currentUser.password = refs.profilePassword.value.trim();
  }

  try {
    await persistCurrentUser("Profile updated.");
    renderSessionChrome();
  } catch (error) {
    showToast(error.message || "Profile update failed.", "error");
  }
}

async function handleFavoriteAdd(event) {
  event.preventDefault();
  const favorite = refs.favoriteInput.value.trim();
  if (!favorite) return;
  state.currentUser.favorites = [...new Set([...(state.currentUser.favorites || []), favorite])];
  refs.favoriteInput.value = "";
  try {
    if (!state.isGuestSession) {
      await persistCurrentUser("Favourite ingredient saved.");
    }
    renderProfile();
    await renderRecommendations();
  } catch (error) {
    showToast(error.message || "Favourite ingredient could not be saved.", "error");
  }
}

async function handleDeactivateAccount() {
  if (state.isGuestSession || !state.currentUser?.email) return;
  try {
    const result = await fetchJson(`/api/users/${encodeURIComponent(state.currentUser.email)}/deactivate`, {
      method: "POST"
    });
    state.currentUser = normalizeUser(result.user);
    renderProfile();
    showToast("Account deactivated.", "success");
    window.setTimeout(() => resetSession(), 1200);
  } catch (error) {
    showToast(error.message || "Account could not be deactivated.", "error");
  }
}

async function handleDeleteAccount() {
  if (state.isGuestSession || !state.currentUser?.email) return;
  if (!window.confirm("Delete this PantryPal account permanently?")) return;
  try {
    await fetchJson(`/api/users/${encodeURIComponent(state.currentUser.email)}`, {
      method: "DELETE"
    });
    showToast("Account deleted.", "success");
    resetSession();
  } catch (error) {
    showToast(error.message || "Account could not be deleted.", "error");
  }
}

async function handleSearch(event) {
  event.preventDefault();
  const query = refs.ingredientInput.value.trim();
  try {
    const results = await searchRecipes(query);
    setApiStatus(true, "Recipe Service Connected");
    renderResults(results, query || "Recommended recipes");
    activateScreen("results");
  } catch (error) {
    setApiStatus(false, "Recipe Service Offline");
    const fallback = buildLocalResults(query);
    renderResults(fallback, query || "Recommended recipes");
    setResultsError(error.message || "Recipe service is currently unavailable.");
    activateScreen("results");
  }
}

function selectPlanFromButton(button) {
  state.selectedPlan = {
    name: button.dataset.planName,
    price: button.dataset.planPrice
  };
  refs.paymentPlanName.textContent = state.selectedPlan.name;
  refs.paymentPlanPrice.textContent = state.selectedPlan.price;
  refs.paymentSummaryStatus.textContent = "Secure checkout";
  refs.billingEmail.value = state.currentUser?.email || "";
  refs.paymentStatus.textContent = "";
  activateScreen("payment");
}

async function handlePaymentSubmit(event) {
  event.preventDefault();
  if (!state.selectedPlan) {
    refs.paymentStatus.textContent = "Choose a plan first.";
    return;
  }
  if (!isStripeEnabled()) {
    refs.paymentStatus.textContent = "Stripe is not configured for this environment.";
    return;
  }

  try {
    refs.paymentSubmit.disabled = true;
    refs.paymentStatus.textContent = "Opening secure Stripe checkout...";
    const result = await fetchJson("/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({
        plan: state.selectedPlan,
        customerEmail: refs.billingEmail.value.trim() || state.currentUser?.email
      })
    });

    if (result.url) {
      window.location.assign(result.url);
      return;
    }

    if (state.stripe && result.sessionId) {
      await state.stripe.redirectToCheckout({ sessionId: result.sessionId });
      return;
    }

    throw new Error("Stripe did not return a checkout URL.");
  } catch (error) {
    refs.paymentStatus.textContent = error.message || "Stripe checkout could not be started.";
  } finally {
    refs.paymentSubmit.disabled = false;
  }
}

async function handleUnsubscribe() {
  if (!state.currentUser?.email) return;
  try {
    const result = await fetchJson("/api/subscription/cancel", {
      method: "POST",
      body: JSON.stringify({ email: state.currentUser.email })
    });
    state.currentUser = normalizeUser(result.user);
    renderPricing();
    updateMembershipChip();
    showToast("Subscription removed. Your account is back on Free Plan.", "success");
  } catch (error) {
    showToast(error.message || "Subscription could not be cancelled.", "error");
  }
}

function bindStaticEvents() {
  targetButtons.forEach((button) => {
    button.addEventListener("click", () => activateScreen(button.dataset.screenTarget));
  });

  authButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.authAction;
      if (action === "google") {
        continueWithGoogle();
        return;
      }
      if (action === "guest") {
        activateScreen("guest-setup");
        return;
      }
      if (action === "signin") {
        activateScreen("signup");
      }
    });
  });

  googleFallbackButtons.forEach((button) => {
    button.addEventListener("click", () => handleLocalGoogleSelection(button));
  });

  refs.loginForm.addEventListener("submit", handleLogin);
  refs.forgotPasswordButton.addEventListener("click", () => activateScreen("forgot-password"));
  refs.guestForm.addEventListener("submit", handleGuestStart);
  refs.forgotPasswordForm.addEventListener("submit", handleForgotPassword);
  refs.resetPasswordForm.addEventListener("submit", handlePasswordReset);
  refs.signupForm.addEventListener("submit", handleSignup);
  refs.profileForm.addEventListener("submit", handleProfileSave);
  refs.favoriteForm.addEventListener("submit", handleFavoriteAdd);
  refs.deactivateAccountButton.addEventListener("click", handleDeactivateAccount);
  refs.deleteAccountButton.addEventListener("click", handleDeleteAccount);
  refs.ingredientForm.addEventListener("submit", handleSearch);
  refs.recipeBackButton.addEventListener("click", () => activateScreen(state.recipeReturnScreen || "dashboard"));
  refs.recipeReturnButton.addEventListener("click", () => activateScreen(state.recipeReturnScreen || "dashboard"));
  refs.saveRecipeButton.addEventListener("click", saveCurrentRecipe);
  refs.guestRefresh.addEventListener("click", async () => {
    state.lastGuestRecommendationSeed = Date.now();
    await renderRecommendations();
  });
  refs.sessionAction.addEventListener("click", () => {
    if (state.isGuestSession) {
      activateScreen("welcome");
      resetSession();
      return;
    }
    resetSession();
  });
  [...document.querySelectorAll(".plan-button[data-plan-name]")].forEach((button) => {
    button.addEventListener("click", () => selectPlanFromButton(button));
  });
  refs.paymentForm.addEventListener("submit", handlePaymentSubmit);
  refs.unsubscribeButton.addEventListener("click", handleUnsubscribe);
}

async function initialize() {
  startWelcomeSlideshow();
  bindStaticEvents();
  setApiStatus(true, "Recipe Service Ready");

  try {
    await initializePublicConfig();
  } catch (error) {
    showToast(error.message || "PantryPal configuration could not be loaded.", "error");
  }

  const resetHandled = await handleResetToken();
  if (!resetHandled) {
    await handleCheckoutStatus();
    activateScreen("welcome");
  }
}

initialize().catch((error) => {
  showToast(error.message || "PantryPal could not start.", "error");
});
