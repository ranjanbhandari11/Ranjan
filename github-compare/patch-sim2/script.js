const HOSTED_APP_ORIGIN = "https://ranjan-ykso.onrender.com";
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const USE_HOSTED_BACKEND = LOCAL_HOSTS.has(window.location.hostname);
const API_ORIGIN = USE_HOSTED_BACKEND ? HOSTED_APP_ORIGIN : "";
const PUBLIC_CONFIG_URL = `${API_ORIGIN}/api/public-config`;
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
  deleteAccountButton: document.querySelector("#delete-account-button"),
  deleteAccountForm: document.querySelector("#delete-account-form"),
  deleteAccountReason: document.querySelector("#delete-account-reason"),
  cancelDeleteAccountButton: document.querySelector("#cancel-delete-account-button"),
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
  activeShoppingCategory: "Vegetables",
  recipeReturnScreen: "dashboard",
  lastGuestRecommendationSeed: Date.now(),
  authRedirectCompleted: false,
  googleSyncInProgress: false,
  firebaseAuthUnsubscribe: null
};

const thumbImageUrls = {
  "thumb-green": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
  "thumb-red": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80",
  "thumb-fresh": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1200&q=80",
  "thumb-gold": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1200&q=80",
  "thumb-noodles": "https://images.unsplash.com/photo-1617093727343-374698b1b08d?auto=format&fit=crop&w=1400&q=80",
  "thumb-pasta": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1200&q=80",
  "thumb-salad": "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=1200&q=80",
  "thumb-soup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1200&q=80"
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
  if ((id === "pricing" || id === "payment") && state.isGuestSession) {
    showToast("Create a PantryPal account before subscribing.", "info");
    screens.forEach((screen) => {
      screen.classList.toggle("is-active", screen.id === "signup");
    });
    return;
  }

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
  const requestUrl = url.startsWith("/api/") ? `${API_ORIGIN}${url}` : url;
  const response = await fetch(requestUrl, {
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

function getRecipeImageUrl(recipe) {
  if (recipe?.image && !String(recipe.image).startsWith("thumb-")) {
    return String(recipe.image);
  }
  return thumbImageUrls[getThumbClass(recipe)] || thumbImageUrls["thumb-green"];
}

function getThumbStyle(recipe) {
  return `style="background-image: linear-gradient(180deg, rgba(15, 23, 17, 0.08), rgba(15, 23, 17, 0.18)), url('${getRecipeImageUrl(recipe)}'); background-size: cover; background-position: center;"`;
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
    await state.firebaseAuth.setPersistence(window.firebase.auth.Auth.Persistence.LOCAL);

    const googleRedirectPending = window.sessionStorage?.getItem("pantrypal_google_redirect") === "1";
    if (window.location.search.includes("google=redirect") || googleRedirectPending) {
      try {
        const redirectResult = await state.firebaseAuth.getRedirectResult();
        if (redirectResult?.user) {
          await handleGoogleUser(redirectResult.user);
        }
      } catch (error) {
        showToast(error.message || "Google sign-in did not complete.", "error");
      } finally {
        window.sessionStorage?.removeItem("pantrypal_google_redirect");
        clearQueryParams();
      }
    }

    await new Promise((resolve) => {
      let settled = false;
      const finish = async (firebaseUser) => {
        if (settled) return;
        settled = true;
        window.clearTimeout(timeout);
        if (unsubscribe) unsubscribe();
        try {
          if (firebaseUser?.email && !state.currentUser) {
            await handleGoogleUser(firebaseUser);
          }
        } catch (error) {
          showToast(error.message || "Google sign-in could not finish.", "error");
        } finally {
          resolve();
        }
      };
      const timeout = window.setTimeout(() => finish(null), 2400);
      const unsubscribe = state.firebaseAuth.onAuthStateChanged(finish, () => finish(null));
    });

    if (!state.firebaseAuthUnsubscribe) {
      state.firebaseAuthUnsubscribe = state.firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
        if (!firebaseUser?.email || state.currentUser || state.googleSyncInProgress) return;
        try {
          await handleGoogleUser(firebaseUser);
        } catch (error) {
          showToast(error.message || "Google sign-in could not finish.", "error");
        }
      });
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
  if (text.includes("month") || text.includes("30")) return "$0.02/month";
  return "Free";
}

function getDaysLeft(endsAt) {
  if (!endsAt) return "Not active";
  const endDate = new Date(endsAt);
  if (Number.isNaN(endDate.getTime())) return "Not active";
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
  const daysLeft = Math.max(0, Math.ceil((endDay.getTime() - todayStart.getTime()) / 86400000));
  return `${daysLeft} day(s)`;
}

function getSubscriptionEndDate(subscription) {
  if (!subscription || subscription.status !== "active") return null;
  if (subscription.endsAt) return subscription.endsAt;

  const text = String(subscription.plan || "").toLowerCase();
  const durationDays = text.includes("weekly") ? 7 : (text.includes("monthly") || text.includes("30") ? 30 : 0);
  if (!durationDays) return null;

  const started = subscription.startedAt ? new Date(subscription.startedAt) : new Date();
  if (Number.isNaN(started.getTime())) return null;
  const endDate = new Date(started);
  endDate.setDate(endDate.getDate() + durationDays);
  return endDate.toISOString();
}

function updateMembershipChip() {
  if (!refs.membershipChip) return;
  refs.membershipChip.textContent = "";
  refs.membershipChip.classList.add("is-hidden");
}

function getActiveScreenId() {
  return screens.find((screen) => screen.classList.contains("is-active"))?.id || "welcome";
}

function renderSessionChrome() {
  const guest = state.isGuestSession;
  refs.userGreeting.textContent = guest ? `Hi ${state.currentUser?.username || "Guest"}` : `Hi ${state.currentUser?.username || "PantryPal User"}`;
  refs.personalTab.textContent = "Recommendations";
  refs.personalTab.classList.remove("is-hidden");
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
  const auth = state.firebaseAuth;
  if (auth?.currentUser) {
    auth.signOut().catch(() => {});
  }
  state.currentUser = null;
  state.isGuestSession = false;
  state.currentResults = [];
  state.currentRecipe = null;
  state.currentMealPlan = [];
  state.currentPlanDayIndex = 0;
  state.activeShoppingCategory = "Vegetables";
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
  const seenTitles = new Set(pool.map((recipe) => String(recipe.title || "").toLowerCase()));
  recipePool.forEach((recipe) => {
    const key = String(recipe.title || "").toLowerCase();
    if (!seenTitles.has(key)) {
      seenTitles.add(key);
      pool.push(recipe);
    }
  });
  return Array.from({ length: 7 }, (_, dayIndex) => {
    const dayStart = (dayIndex * 3) % pool.length;
    const usedNames = new Set();
    const meals = labels.map((label, labelIndex) => {
      let recipe = pool[(dayStart + labelIndex) % pool.length];
      let offset = 0;
      while (recipe && usedNames.has(recipe.title) && offset < pool.length) {
        offset += 1;
        recipe = pool[(dayStart + labelIndex + offset) % pool.length];
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
  if (/(milk|cheese|butter|cream|yogurt|paneer|mozzarella|parmesan|feta|ricotta|custard)/.test(text)) return "Dairy";
  if (/(chicken|beef|pork|bacon|turkey|lamb|meat|shrimp|prawn|fish|salmon|tuna|egg|tofu|sausage)/.test(text)) return "Protein";
  if (/(frozen|peas|corn|ice cream|berry|berries)/.test(text)) return "Frozen";
  if (/(tomato|spinach|lettuce|onion|garlic|broccoli|pumpkin|cucumber|mushroom|pepper|capsicum|potato|avocado|basil|carrot|celery|zucchini|bean|cabbage|leek)/.test(text)) return "Vegetables";
  if (/(rice|pasta|quinoa|noodle|flour|sugar|bread|oat|cereal|tortilla|crumb|lentil|chickpea|bean)/.test(text)) return "Dry Items";
  if (/(oil|stock|salt|spice|rosemary|olive|curry|peppercorn|paprika|cumin|oregano|thyme|bay leaf|yeast)/.test(text)) return "Pantry";
  if (/(soy sauce|sauce|ketchup|mustard|vinegar|mayo|mayonnaise|dressing|honey|syrup|paste|pesto|salsa)/.test(text)) return "Sauces";
  if (/(chocolate|cocoa|vanilla|sprinkle|jam|jelly|biscuit|cookie|cake|dessert)/.test(text)) return "Desserts";
  if (/(lemon|lime|apple|banana|orange|fruit|mango|grape|pineapple)/.test(text)) return "Fruit";
  return "Other";
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
  if (!state.currentMealPlan?.length) {
    const sourceFavorites = state.currentUser?.favorites?.length
      ? state.currentUser.favorites
      : ["Chicken", "Rice", "Tomato", "Spinach"];
    state.currentMealPlan = groupRecipesForSevenDays(buildLocalResults(sourceFavorites.join(", ")));
  }

  const aggregated = new Map();
  const preferredCategories = [
    "Dairy",
    "Protein",
    "Frozen",
    "Vegetables",
    "Dry Items",
    "Pantry",
    "Sauces",
    "Desserts",
    "Fruit",
    "Other"
  ];

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
  const presentCategories = new Set(allItems.map((item) => item.category));
  const categories = preferredCategories.filter((category) => presentCategories.has(category));
  if (!categories.includes(state.activeShoppingCategory)) {
    state.activeShoppingCategory = categories[0] || "Vegetables";
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
    .filter((item) => item.category === state.activeShoppingCategory)
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
        <p>${dayPlan.meals.slice(0, 3).map((meal) => `${meal.label}: ${meal.recipe.title}`).join(" | ")}</p>
      </div>
    `)
    .join("");

  refs.shoppingGrid.innerHTML = `
    <section class="shopping-card">
      <h3>This Week</h3>
      <div class="shopping-week-grid">
        <div>
          <h4>${state.activeShoppingCategory || "Shopping"} Items</h4>
          <div class="shopping-list">${shoppingItems || "<p>No shopping items available.</p>"}</div>
        </div>
        <div>
          <h4>7 Day Plan</h4>
          <div class="weekly-plan-mini shopping-day-list">${weeklyDays || "<p>No weekly plan available.</p>"}</div>
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
          <div class="thumb ${getThumbClass(recipe)}" ${getThumbStyle(recipe)}></div>
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
  return `
    <button class="meal-slot meal-slot-card" type="button" data-plan-recipe="${recipe.id}">
      <div class="meal-slot-photo">
        <img src="${getRecipeImageUrl(recipe)}" alt="Recipe photo">
      </div>
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

  refs.recommendationGrid.className = "meal-plan-grid weekly-card-grid";
  refs.recommendationGrid.innerHTML = plan.map((dayPlan) => `
    <article class="day-plan-card week-plan-card">
      <h3>Day ${dayPlan.day}</h3>
      <div class="meal-slot-list">
        ${dayPlan.meals.map((meal) => renderMealSlot(meal)).join("")}
      </div>
    </article>
  `).join("");
}

function renderRecipeDetail(recipe) {
  state.currentRecipe = recipe;
  const title = recipe.title || "Recipe";
  const match = recipe.match ? ` <span>(${recipe.match}% match)</span>` : "";
  refs.recipeTitle.innerHTML = `${title}${match}`;
  refs.recipeHero.className = `hero-dish thumb ${getThumbClass(recipe)}`;
  refs.recipeHero.style.backgroundImage = `linear-gradient(180deg, rgba(15, 23, 17, 0.08), rgba(15, 23, 17, 0.18)), url("${getRecipeImageUrl(recipe)}")`;
  refs.recipeHero.style.backgroundSize = "cover";
  refs.recipeHero.style.backgroundPosition = "center";

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
  const activeScreen = getActiveScreenId();
  state.recipeReturnScreen = ["results", "recommendations", "profile", "shopping", "pricing", "dashboard"].includes(activeScreen)
    ? activeScreen
    : "dashboard";
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
        <div class="thumb ${getThumbClass(recipe)}" ${getThumbStyle(recipe)}>
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
  if (refs.recommendationPreview) {
    refs.recommendationPreview.innerHTML = "";
  }

  if (state.isGuestSession) {
    state.currentMealPlan = [];
    refs.recommendationHeading.textContent = "Guest Recipe Recommendations";
    refs.dashboardNote.textContent = "These guest recommendations are shaped by the favourite ingredients you entered for this session, plus a rotating mix of broader recipe ideas.";
    const guestFallback = buildLocalResults((state.currentUser?.favorites || []).join(", ") || "Chicken, Rice, Tomato");
    let guestResults = guestFallback;
    state.currentResults = guestResults;
    refs.recommendationGrid.className = "card-row";
    refs.recommendationGrid.innerHTML = guestResults.map((recipe) => `
      <article class="recipe-card">
        <div class="thumb ${getThumbClass(recipe)}" ${getThumbStyle(recipe)}></div>
        <div class="recipe-card-body">
          <h3>${recipe.title}</h3>
          <p>Guest recommendation</p>
          <button class="primary-button guest-recipe-button" type="button" data-recipe-id="${recipe.id}">View Recipe</button>
        </div>
      </article>
    `).join("");
    attachRecipeCardActions(refs.recommendationGrid);

    try {
      guestResults = await fetchGuestRecommendations();
    } catch (_error) {
      guestResults = guestFallback;
    }

    state.currentResults = guestResults;
    if (refs.recommendationPreview) {
      refs.recommendationPreview.innerHTML = "";
    }

    refs.recommendationGrid.className = "card-row";
    refs.recommendationGrid.innerHTML = guestResults.map((recipe) => `
      <article class="recipe-card">
        <div class="thumb ${getThumbClass(recipe)}" ${getThumbStyle(recipe)}></div>
        <div class="recipe-card-body">
          <h3>${recipe.title}</h3>
          <p>Guest recommendation</p>
          <button class="primary-button guest-recipe-button" type="button" data-recipe-id="${recipe.id}">View Recipe</button>
        </div>
      </article>
    `).join("");

    attachRecipeCardActions(refs.recommendationGrid);
    renderShoppingList();
    return;
  }

  refs.recommendationHeading.textContent = "Your 7 Day Recommendation Plan";
  const favorites = state.currentUser?.favorites?.length ? state.currentUser.favorites : ["Chicken", "Rice", "Tomato"];
  refs.dashboardNote.textContent = `Built from your saved ingredients (${favorites.join(", ")}) and favourite recipes so the week stays practical, varied, and easier to shop for.`;

  let pool = buildLocalResults(favorites.join(", "));
  if (state.currentUser?.savedRecipes?.length) {
    const savedTitles = new Set(state.currentUser.savedRecipes.map((recipe) => String(recipe.title || "").toLowerCase()));
    pool = [
      ...state.currentUser.savedRecipes.map((recipe) => ({ ...recipe, match: Math.max(recipe.match || 88, 92) })),
      ...pool.filter((recipe) => !savedTitles.has(String(recipe.title || "").toLowerCase()))
    ];
  }
  state.currentMealPlan = groupRecipesForSevenDays(pool);
  state.currentPlanDayIndex = 0;
  state.currentResults = state.currentMealPlan.flatMap((day) => day.meals.map((meal) => meal.recipe));
  renderWeeklySlider(state.currentMealPlan);
  attachPlanRecipeActions();
  renderShoppingList();

  try {
    pool = await fetchFavoriteIngredientPool(favorites, 10);
  } catch (_error) {
    pool = state.currentResults;
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
  if (refs.recommendationPreview) {
    refs.recommendationPreview.innerHTML = "";
  }

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
    ? "This PantryPal account is not currently available for sign-in."
    : "Your PantryPal account is active and available for sign-in.";
  refs.deleteAccountForm?.classList.add("is-hidden");
  if (refs.deleteAccountReason) {
    refs.deleteAccountReason.value = "";
  }

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
    const endsAt = getSubscriptionEndDate(subscription);
    refs.subscriptionStatusBadge.textContent = "Active subscription";
    refs.subscriptionActivePlan.textContent = subscription.plan;
    refs.subscriptionManageNote.textContent = "Your PantryPal subscription is active and ready for premium recommendations and planning.";
    refs.subscriptionCurrentPlan.textContent = subscription.plan;
    refs.subscriptionCurrentStatus.textContent = subscription.status;
    refs.subscriptionCurrentBilling.textContent = getPlanPriceLabel(subscription.plan);
    refs.subscriptionDaysLeft.textContent = getDaysLeft(endsAt);
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
  if (!firebaseUser?.email) {
    throw new Error("Google did not return an email address.");
  }
  if (state.googleSyncInProgress) return;
  const googleEmail = normalizeTerm(firebaseUser.email);
  if (state.currentUser?.email && normalizeTerm(state.currentUser.email) === googleEmail) {
    state.authRedirectCompleted = true;
    activateScreen("dashboard");
    return;
  }

  state.googleSyncInProgress = true;
  const displayName = firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "PantryPal User";
  try {
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
    state.authRedirectCompleted = true;
    unlockApp(sync.user, false);
    showToast(sync.notificationEmailSent ? "Google sign-in complete. PantryPal sent a sign-in email." : "Google sign-in complete.", "success");
  } finally {
    state.googleSyncInProgress = false;
  }
}

async function beginGoogleRedirectFlow() {
  if (!state.firebaseAuth || !window.firebase) {
    throw new Error("Google authentication is not ready yet.");
  }

  const provider = new window.firebase.auth.GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  window.sessionStorage?.setItem("pantrypal_google_redirect", "1");
  await state.firebaseAuth.signInWithRedirect(provider);
}

async function continueWithGoogle() {
  if (USE_HOSTED_BACKEND) {
    window.location.href = `${HOSTED_APP_ORIGIN}/?start=google`;
    return;
  }

  if (isHostedAuthEnabled() && state.firebaseAuth) {
    try {
      const provider = new window.firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      try {
        const result = await state.firebaseAuth.signInWithPopup(provider);
        await handleGoogleUser(result.user);
      } catch (popupError) {
        if (popupError.code === "auth/popup-blocked" || popupError.code === "auth/popup-closed-by-user") {
          await beginGoogleRedirectFlow();
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
        ? `Sign up successful. Welcome email sent to ${email}.`
        : "Sign up successful, but PantryPal could not confirm the welcome email delivery.",
      result.notificationEmailSent ? "success" : "warning"
    );
    refs.signupForm.reset();
    unlockApp(result.user, false);
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

    if (!result.notificationEmailSent && state.firebaseAuth && result.email) {
      try {
        await state.firebaseAuth.sendPasswordResetEmail(result.email);
        result.notificationEmailSent = true;
        result.delivery = "firebase-client";
      } catch (firebaseError) {
        result.emailDeliveryReason = firebaseError.message || result.emailDeliveryReason;
      }
    }

    setHelperText(
      refs.forgotPasswordNote,
      result.notificationEmailSent
        ? `Email sent to ${result.email}. The secure reset link expires in 60 minutes.`
        : `Reset link prepared for ${result.email}, but PantryPal could not confirm email delivery.`,
      result.notificationEmailSent ? "success" : "warning"
    );
    showToast(
      result.notificationEmailSent
        ? `Password reset email sent to ${result.email}.`
        : "Password reset link was created, but email delivery could not be confirmed.",
      result.notificationEmailSent ? "success" : "warning"
    );
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

function openDeleteAccountForm() {
  if (state.isGuestSession || !state.currentUser?.email) return;
  refs.deleteAccountForm?.classList.remove("is-hidden");
  refs.deleteAccountReason?.focus();
}

function closeDeleteAccountForm() {
  refs.deleteAccountForm?.classList.add("is-hidden");
  if (refs.deleteAccountReason) {
    refs.deleteAccountReason.value = "";
  }
}

async function handleDeleteAccount(event) {
  event?.preventDefault();
  if (state.isGuestSession || !state.currentUser?.email) return;
  const reason = refs.deleteAccountReason?.value.trim() || "";
  if (reason.length < 8) {
    showToast("Please enter a short reason before deleting the account.", "error");
    return;
  }
  try {
    await fetchJson(`/api/users/${encodeURIComponent(state.currentUser.email)}`, {
      method: "DELETE",
      body: JSON.stringify({ reason })
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
  if (state.isGuestSession) {
    showToast("Create a PantryPal account before subscribing.", "info");
    activateScreen("signup");
    return;
  }

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
  refs.deleteAccountButton?.addEventListener("click", openDeleteAccountForm);
  refs.cancelDeleteAccountButton?.addEventListener("click", closeDeleteAccountForm);
  refs.deleteAccountForm?.addEventListener("submit", handleDeleteAccount);
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

  if (getQueryParam("start") === "google" && isHostedAuthEnabled() && state.firebaseAuth) {
    try {
      clearQueryParams();
      await beginGoogleRedirectFlow();
      return;
    } catch (error) {
      showToast(error.message || "Google sign-in could not start.", "error");
    }
  }

  const resetHandled = await handleResetToken();
  if (!resetHandled) {
    await handleCheckoutStatus();
    if (!state.authRedirectCompleted && !state.currentUser) {
      activateScreen("welcome");
    }
  }
}


// PantryPal email timeout patch 20260506final
/* PantryPal live reliability patch 20260506c */
(function () {
  if (window.__pantryPalLiveReliabilityPatch) return;
  window.__pantryPalLiveReliabilityPatch = true;

  function asList(value) {
    return Array.isArray(value) ? value.filter(Boolean) : [];
  }

  function fallbackRecipes() {
    var favorites = asList(state.currentUser && state.currentUser.favorites);
    var guest = asList(state.guestProfile && state.guestProfile.favorites);
    var seed = (favorites.length ? favorites : guest.length ? guest : ["Chicken", "Rice", "Tomato", "Spinach"]).join(", ");
    if (typeof buildLocalResults === "function") {
      return buildLocalResults(seed);
    }
    return [
      { id: "live-fallback-1", title: "Chicken Rice Bowl", match: 92, image: "thumb-green", ingredients: ["Chicken", "Rice", "Tomato", "Spinach"], ingredientDetails: [{ name: "Chicken", measure: "300 g" }, { name: "Rice", measure: "2 cups" }, { name: "Tomato", measure: "2" }, { name: "Spinach", measure: "2 cups" }], instructions: ["Cook rice until tender.", "Cook chicken until golden.", "Add tomato and spinach, then serve together."] },
      { id: "live-fallback-2", title: "Creamy Garlic Pasta", match: 89, image: "thumb-pasta", ingredients: ["Pasta", "Cream", "Garlic", "Cheese"], ingredientDetails: [{ name: "Pasta", measure: "200 g" }, { name: "Cream", measure: "1 cup" }, { name: "Garlic", measure: "3 cloves" }, { name: "Cheese", measure: "1/2 cup" }], instructions: ["Boil pasta.", "Simmer cream with garlic.", "Toss pasta through sauce and finish with cheese."] },
      { id: "live-fallback-3", title: "Mediterranean Salad Bowl", match: 87, image: "thumb-salad", ingredients: ["Lettuce", "Tomato", "Cucumber", "Olive Oil"], ingredientDetails: [{ name: "Lettuce", measure: "2 cups" }, { name: "Tomato", measure: "2" }, { name: "Cucumber", measure: "1" }, { name: "Olive Oil", measure: "2 tbsp" }], instructions: ["Chop vegetables.", "Toss with olive oil and seasoning.", "Serve chilled."] }
    ];
  }

  function ensurePlan() {
    if (state.currentMealPlan && state.currentMealPlan.length) return state.currentMealPlan;
    var source = fallbackRecipes();
    if (typeof groupRecipesForSevenDays === "function") {
      state.currentMealPlan = groupRecipesForSevenDays(source);
    } else {
      var labels = ["Breakfast", "Morning Tea", "Lunch", "Afternoon Tea", "Dinner", "Supper"];
      state.currentMealPlan = Array.from({ length: 7 }, function (_, index) {
        return { day: index + 1, meals: labels.map(function (label, mealIndex) {
          return { label: label, recipe: source[(index + mealIndex) % source.length] };
        }) };
      });
    }
    state.currentResults = state.currentMealPlan.flatMap(function (day) {
      return day.meals.map(function (meal) { return meal.recipe; });
    });
    return state.currentMealPlan;
  }

  function revealOverview() {
    document.querySelectorAll(".dashboard-hero-grid, .dashboard-action-grid, .dashboard-search-section, .dashboard-intro-card, .dashboard-insight-card").forEach(function (element) {
      element.style.display = "";
      element.style.visibility = "visible";
      element.style.opacity = "1";
    });
  }

  if (typeof handleGoogleUser === "function") {
    var originalHandleGoogleUser = handleGoogleUser;
    handleGoogleUser = async function pantryPalGoogleUserPatched(firebaseUser) {
      try {
        var result = await originalHandleGoogleUser(firebaseUser);
        state.authRedirectCompleted = true;
        if (state.currentUser) {
          activateScreen("dashboard");
          revealOverview();
        }
        return result;
      } catch (error) {
        state.authRedirectCompleted = true;
        if (firebaseUser && firebaseUser.email) {
          var fallbackUser = {
            username: firebaseUser.displayName || firebaseUser.email.split("@")[0] || "Google User",
            email: firebaseUser.email,
            password: "",
            favorites: ["Chicken", "Rice", "Tomato"],
            savedRecipes: [],
            subscription: { plan: "free", status: "inactive" }
          };
          unlockApp(fallbackUser, false);
          showToast("Google sign-in opened PantryPal. Account sync will retry when the database is available.", "warning");
          return;
        }
        throw error;
      }
    };
  }

  if (typeof continueWithGoogle === "function") {
    continueWithGoogle = async function pantryPalContinueWithGooglePatched() {
      if (typeof isHostedAuthEnabled === "function" && isHostedAuthEnabled() && state.firebaseAuth && window.firebase) {
        try {
          var provider = new window.firebase.auth.GoogleAuthProvider();
          provider.setCustomParameters({ prompt: "select_account" });
          try {
            var popupResult = await state.firebaseAuth.signInWithPopup(provider);
            await handleGoogleUser(popupResult.user);
          } catch (popupError) {
            if (["auth/popup-blocked", "auth/popup-closed-by-user", "auth/cancelled-popup-request", "auth/operation-not-supported-in-this-environment"].indexOf(popupError.code) !== -1) {
              if (window.sessionStorage) window.sessionStorage.setItem("pantrypal_google_redirect", "1");
              await state.firebaseAuth.signInWithRedirect(provider);
              return;
            }
            throw popupError;
          }
        } catch (error) {
          showToast(error.message || "Google authentication failed. Check Firebase authorized domains.", "error");
        }
        return;
      }
      activateScreen("google-auth");
    };
  }

  if (typeof unlockApp === "function") {
    var originalUnlockApp = unlockApp;
    unlockApp = function pantryPalUnlockPatched(user, isGuest) {
      var result = originalUnlockApp(user, isGuest);
      revealOverview();
      window.setTimeout(function () {
        try {
          if (!state.isGuestSession) {
            ensurePlan();
            if (typeof renderWeeklySlider === "function") renderWeeklySlider(state.currentMealPlan);
            if (typeof attachPlanRecipeActions === "function") attachPlanRecipeActions();
            if (typeof renderShoppingList === "function") renderShoppingList();
          }
        } catch (error) {
          console.warn("PantryPal plan refresh failed:", error);
        }
      }, 150);
      return result;
    };
  }

  if (typeof renderRecommendations === "function") {
    var originalRenderRecommendations = renderRecommendations;
    renderRecommendations = async function pantryPalRecommendationsPatched() {
      if (!state.isGuestSession) {
        var saved = asList(state.currentUser && state.currentUser.savedRecipes);
        var pool = saved.concat(fallbackRecipes());
        state.currentMealPlan = typeof groupRecipesForSevenDays === "function" ? groupRecipesForSevenDays(pool) : ensurePlan();
        state.currentResults = state.currentMealPlan.flatMap(function (day) {
          return day.meals.map(function (meal) { return meal.recipe; });
        });
        if (refs.recommendationHeading) refs.recommendationHeading.textContent = "7 Day Recommendation Plan";
        if (refs.dashboardNote) refs.dashboardNote.textContent = "Based on your saved ingredients and favourite recipes, with varied meals for each part of the day.";
        if (typeof renderWeeklySlider === "function") renderWeeklySlider(state.currentMealPlan);
        if (typeof attachPlanRecipeActions === "function") attachPlanRecipeActions();
        if (typeof renderShoppingList === "function") renderShoppingList();
      }
      try {
        await originalRenderRecommendations();
      } catch (error) {
        if (!state.currentMealPlan || !state.currentMealPlan.length) {
          ensurePlan();
          if (typeof renderWeeklySlider === "function") renderWeeklySlider(state.currentMealPlan);
        }
      }
    };
  }

  if (typeof renderShoppingList === "function") {
    var originalShopping = renderShoppingList;
    renderShoppingList = function pantryPalShoppingPatched() {
      ensurePlan();
      originalShopping();
      if (refs.shoppingGrid && !refs.shoppingGrid.textContent.trim()) {
        refs.shoppingGrid.innerHTML = '<section class="shopping-card"><h3>Vegetables</h3><div class="shopping-list"><div class="shopping-item"><strong>Tomato</strong><span>6</span></div><div class="shopping-item"><strong>Spinach</strong><span>2 bunches</span></div></div></section><section class="shopping-card"><h3>Protein</h3><div class="shopping-list"><div class="shopping-item"><strong>Chicken</strong><span>900 g</span></div></div></section><section class="shopping-card"><h3>Pantry</h3><div class="shopping-list"><div class="shopping-item"><strong>Rice</strong><span>4 cups</span></div><div class="shopping-item"><strong>Pasta</strong><span>500 g</span></div></div></section>';
      }
    };
  }

  if (typeof handleForgotPassword === "function") {
    handleForgotPassword = async function pantryPalForgotPasswordPatched(event) {
      event.preventDefault();
      var identity = refs.forgotIdentity.value.trim();
      if (!identity) {
        setHelperText(refs.forgotPasswordNote, "Enter your username or email first.", "error");
        return;
      }
      try {
        var payload = await fetchJson("/api/auth/request-password-reset", {
          method: "POST",
          body: JSON.stringify({ identity: identity })
        });
        if (payload.notificationEmailSent) {
          setHelperText(refs.forgotPasswordNote, "Reset email sent to " + payload.email + ". Please check inbox and spam.", "success");
          showToast("Password reset email sent.", "success");
        } else {
          setHelperText(refs.forgotPasswordNote, "Reset link was created, but email delivery could not be confirmed. Check SMTP settings in Render.", "warning");
          showToast("Password reset link was created, but email delivery could not be confirmed.", "warning");
        }
      } catch (error) {
        setHelperText(refs.forgotPasswordNote, error.message || "Password reset failed.", "error");
        showToast(error.message || "Password reset failed.", "error");
      }
    };
  }

  window.addEventListener("load", revealOverview);
}());


initialize().catch((error) => {
  showToast(error.message || "PantryPal could not start.", "error");
});
