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
  recipeMatchBadge: document.querySelector("#recipe-match-badge"),
  recipeDescription: document.querySelector("#recipe-description"),
  recipeTags: document.querySelector("#recipe-tags"),
  recipeHero: document.querySelector("#recipe-hero"),
  recipeBackButton: document.querySelector("#recipe-back-button"),
  recipeReturnButton: document.querySelector("#recipe-return-button"),
  recipeIngredients: document.querySelector("#recipe-ingredients"),
  recipeIngredientCount: document.querySelector("#recipe-ingredient-count"),
  recipePrepTime: document.querySelector("#recipe-prep-time"),
  recipeReady: document.querySelector("#recipe-ready"),
  recipeDifficulty: document.querySelector("#recipe-difficulty"),
  recipeServings: document.querySelector("#recipe-servings"),
  recipeInstructions: document.querySelector("#recipe-instructions"),
  recipeStepCount: document.querySelector("#recipe-step-count"),
  recipeTip: document.querySelector("#recipe-tip"),
  saveRecipeButton: document.querySelector("#save-recipe-button"),
  recipePrintButton: document.querySelector("#recipe-print-button"),
  recipeShareButton: document.querySelector("#recipe-share-button"),
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
  activePlanWeekIndex: 0,
  activeShoppingWeekIndex: 0,
  activeShoppingCategory: "Vegetables",
  recipeReturnScreen: "dashboard",
  lastGuestRecommendationSeed: Date.now(),
  recommendationRefreshCount: 0,
  recommendationCardLimit: 12,
  currentRecommendationCards: [],
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

const recipeImageOverrides = {
  "slot-breakfast-1": "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1400&q=80",
  "berry oat breakfast bowl": "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?auto=format&fit=crop&w=1400&q=80",
  "slot-breakfast-2": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1400&q=80",
  "spinach mushroom omelette": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1400&q=80",
  "slot-breakfast-3": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1400&q=80",
  "avocado egg toast": "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=1400&q=80",
  "slot-light-1": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1400&q=80",
  "fruit yogurt parfait": "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=1400&q=80",
  "slot-light-2": "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=1400&q=80",
  "tomato cucumber snack plate": "https://images.unsplash.com/photo-1546793665-c74683f339c1?auto=format&fit=crop&w=1400&q=80",
  "slot-light-3": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1400&q=80",
  "pumpkin soup cup": "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1400&q=80",
  "slot-main-1": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1400&q=80",
  "chicken rice dinner bowl": "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=1400&q=80",
  "slot-main-2": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1400&q=80",
  "salmon potato plate": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1400&q=80",
  "slot-main-3": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1400&q=80",
  "creamy tomato pasta": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?auto=format&fit=crop&w=1400&q=80",
  "local-1": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1400&q=80",
  "chicken spinach stir fry": "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1400&q=80",
  "local-9": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1400&q=80",
  "garlic butter salmon": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1400&q=80"
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
  },
  {
    id: "local-7",
    title: "Lemon Herb Chicken Wrap",
    match: 90,
    image: "thumb-gold",
    ingredients: ["2 chicken fillets", "4 wraps", "1 cup lettuce", "1 tomato", "2 tbsp yogurt", "1 lemon"],
    ingredientDetails: [
      { name: "Chicken fillets", measure: "2" },
      { name: "Wraps", measure: "4" },
      { name: "Lettuce", measure: "1 cup" },
      { name: "Tomato", measure: "1" },
      { name: "Yogurt", measure: "2 tbsp" },
      { name: "Lemon", measure: "1" }
    ],
    instructions: [
      "Cook the chicken with lemon juice, salt, and herbs until golden.",
      "Slice the chicken into strips.",
      "Warm the wraps and layer with lettuce, tomato, and yogurt.",
      "Add the chicken and roll tightly before serving."
    ]
  },
  {
    id: "local-8",
    title: "Tomato Basil Rice Bowl",
    match: 86,
    image: "thumb-green",
    ingredients: ["2 cups cooked rice", "2 tomatoes", "1/2 onion", "1 tbsp olive oil", "1 handful basil"],
    ingredientDetails: [
      { name: "Cooked rice", measure: "2 cups" },
      { name: "Tomatoes", measure: "2" },
      { name: "Onion", measure: "1/2" },
      { name: "Olive oil", measure: "1 tbsp" },
      { name: "Basil", measure: "1 handful" }
    ],
    instructions: [
      "Saute onion in olive oil until soft.",
      "Add chopped tomatoes and cook until slightly reduced.",
      "Fold through rice and basil.",
      "Serve warm as a quick bowl meal."
    ]
  },
  {
    id: "local-9",
    title: "Garlic Butter Salmon",
    match: 91,
    image: "thumb-red",
    ingredients: ["2 salmon fillets", "2 cloves garlic", "1 tbsp butter", "1 lemon", "1 cup broccoli"],
    ingredientDetails: [
      { name: "Salmon fillets", measure: "2" },
      { name: "Garlic", measure: "2 cloves" },
      { name: "Butter", measure: "1 tbsp" },
      { name: "Lemon", measure: "1" },
      { name: "Broccoli", measure: "1 cup" }
    ],
    instructions: [
      "Pan-sear the salmon until nearly cooked through.",
      "Add butter and garlic to the pan.",
      "Spoon the garlic butter over the salmon and finish with lemon.",
      "Serve with steamed broccoli."
    ]
  },
  {
    id: "local-10",
    title: "Mushroom Spinach Omelette",
    match: 84,
    image: "thumb-fresh",
    ingredients: ["3 eggs", "1 cup spinach", "1/2 cup mushrooms", "1 tbsp butter", "1 tbsp milk"],
    ingredientDetails: [
      { name: "Eggs", measure: "3" },
      { name: "Spinach", measure: "1 cup" },
      { name: "Mushrooms", measure: "1/2 cup" },
      { name: "Butter", measure: "1 tbsp" },
      { name: "Milk", measure: "1 tbsp" }
    ],
    instructions: [
      "Cook mushrooms in butter until softened.",
      "Whisk eggs with milk and pour into the pan.",
      "Add spinach and fold the omelette once set.",
      "Serve immediately."
    ]
  },
  {
    id: "local-11",
    title: "Chicken Noodle Soup",
    match: 88,
    image: "thumb-soup",
    ingredients: ["200 g chicken", "100 g noodles", "1 carrot", "1 celery stalk", "3 cups stock"],
    ingredientDetails: [
      { name: "Chicken", measure: "200 g" },
      { name: "Noodles", measure: "100 g" },
      { name: "Carrot", measure: "1" },
      { name: "Celery", measure: "1 stalk" },
      { name: "Stock", measure: "3 cups" }
    ],
    instructions: [
      "Simmer chicken, carrot, and celery in stock until tender.",
      "Shred the chicken and return it to the pot.",
      "Add noodles and cook until soft.",
      "Serve hot."
    ]
  },
  {
    id: "local-12",
    title: "Creamy Potato Bake",
    match: 87,
    image: "thumb-pasta",
    ingredients: ["3 potatoes", "1 cup cream", "1/2 onion", "1/2 cup cheese", "1 tbsp butter"],
    ingredientDetails: [
      { name: "Potatoes", measure: "3" },
      { name: "Cream", measure: "1 cup" },
      { name: "Onion", measure: "1/2" },
      { name: "Cheese", measure: "1/2 cup" },
      { name: "Butter", measure: "1 tbsp" }
    ],
    instructions: [
      "Slice potatoes thinly and layer into a baking dish.",
      "Scatter onion between the layers and pour over cream.",
      "Top with cheese and bake until golden and tender.",
      "Rest briefly before serving."
    ]
  }
];

const imageClasses = ["thumb-green", "thumb-red", "thumb-fresh", "thumb-pasta", "thumb-salad", "thumb-soup", "thumb-gold", "thumb-noodles"];

const mealSlotFallbackRecipes = [
  {
    id: "slot-breakfast-1",
    title: "Berry Oat Breakfast Bowl",
    match: 90,
    image: "thumb-fresh",
    category: "Breakfast",
    mealTags: ["breakfast", "light"],
    ingredients: ["1 cup oats", "1/2 cup yogurt", "1/2 cup berries", "1 tbsp honey"],
    ingredientDetails: [
      { name: "Oats", measure: "1 cup" },
      { name: "Yogurt", measure: "1/2 cup" },
      { name: "Berries", measure: "1/2 cup" },
      { name: "Honey", measure: "1 tbsp" }
    ],
    instructions: ["Spoon yogurt into a bowl.", "Add oats and berries.", "Drizzle with honey and serve chilled."]
  },
  {
    id: "slot-breakfast-2",
    title: "Spinach Mushroom Omelette",
    match: 89,
    image: "thumb-gold",
    category: "Breakfast",
    mealTags: ["breakfast"],
    ingredients: ["3 eggs", "1/2 cup mushrooms", "1 cup spinach", "1 tbsp milk"],
    ingredientDetails: [
      { name: "Eggs", measure: "3" },
      { name: "Mushrooms", measure: "1/2 cup" },
      { name: "Spinach", measure: "1 cup" },
      { name: "Milk", measure: "1 tbsp" }
    ],
    instructions: ["Whisk eggs with milk.", "Cook mushrooms and spinach in a pan.", "Pour in eggs and fold once set."]
  },
  {
    id: "slot-breakfast-3",
    title: "Avocado Egg Toast",
    match: 88,
    image: "thumb-salad",
    category: "Breakfast",
    mealTags: ["breakfast", "light"],
    ingredients: ["2 slices bread", "1 avocado", "2 eggs", "1 lemon"],
    ingredientDetails: [
      { name: "Bread", measure: "2 slices" },
      { name: "Avocado", measure: "1" },
      { name: "Eggs", measure: "2" },
      { name: "Lemon", measure: "1" }
    ],
    instructions: ["Toast the bread.", "Mash avocado with lemon.", "Top toast with avocado and cooked eggs."]
  },
  {
    id: "slot-light-1",
    title: "Fruit Yogurt Parfait",
    match: 87,
    image: "thumb-fresh",
    category: "Snack",
    mealTags: ["light", "dessert"],
    ingredients: ["1 cup yogurt", "1 banana", "1/2 cup berries", "2 tbsp granola"],
    ingredientDetails: [
      { name: "Yogurt", measure: "1 cup" },
      { name: "Banana", measure: "1" },
      { name: "Berries", measure: "1/2 cup" },
      { name: "Granola", measure: "2 tbsp" }
    ],
    instructions: ["Layer yogurt, fruit, and granola in a glass.", "Serve cold."]
  },
  {
    id: "slot-light-2",
    title: "Tomato Cucumber Snack Plate",
    match: 86,
    image: "thumb-salad",
    category: "Side",
    mealTags: ["light"],
    ingredients: ["1 cucumber", "1 tomato", "2 tbsp feta", "1 tbsp olive oil"],
    ingredientDetails: [
      { name: "Cucumber", measure: "1" },
      { name: "Tomato", measure: "1" },
      { name: "Feta", measure: "2 tbsp" },
      { name: "Olive oil", measure: "1 tbsp" }
    ],
    instructions: ["Slice cucumber and tomato.", "Top with feta and olive oil.", "Serve as a light plate."]
  },
  {
    id: "slot-light-3",
    title: "Pumpkin Soup Cup",
    match: 86,
    image: "thumb-soup",
    category: "Starter",
    mealTags: ["light", "supper"],
    ingredients: ["250 g pumpkin", "1 cup stock", "1/2 onion", "1 tbsp cream"],
    ingredientDetails: [
      { name: "Pumpkin", measure: "250 g" },
      { name: "Stock", measure: "1 cup" },
      { name: "Onion", measure: "1/2" },
      { name: "Cream", measure: "1 tbsp" }
    ],
    instructions: ["Simmer pumpkin, onion, and stock until tender.", "Blend smooth.", "Finish with cream."]
  },
  {
    id: "slot-main-1",
    title: "Chicken Rice Dinner Bowl",
    match: 91,
    image: "thumb-green",
    category: "Main",
    mealTags: ["main"],
    ingredients: ["300 g chicken", "2 cups rice", "1 cup spinach", "1 tomato"],
    ingredientDetails: [
      { name: "Chicken", measure: "300 g" },
      { name: "Rice", measure: "2 cups" },
      { name: "Spinach", measure: "1 cup" },
      { name: "Tomato", measure: "1" }
    ],
    instructions: ["Cook chicken until golden.", "Warm rice with tomato and spinach.", "Serve chicken over rice."]
  },
  {
    id: "slot-main-2",
    title: "Salmon Potato Plate",
    match: 89,
    image: "thumb-red",
    category: "Main",
    mealTags: ["main"],
    ingredients: ["2 salmon fillets", "3 potatoes", "1 cup broccoli", "1 lemon"],
    ingredientDetails: [
      { name: "Salmon fillets", measure: "2" },
      { name: "Potatoes", measure: "3" },
      { name: "Broccoli", measure: "1 cup" },
      { name: "Lemon", measure: "1" }
    ],
    instructions: ["Roast potatoes.", "Pan-sear salmon.", "Serve with broccoli and lemon."]
  },
  {
    id: "slot-main-3",
    title: "Creamy Tomato Pasta",
    match: 88,
    image: "thumb-pasta",
    category: "Main",
    mealTags: ["main"],
    ingredients: ["200 g pasta", "2 tomatoes", "1/2 cup cream", "2 cloves garlic"],
    ingredientDetails: [
      { name: "Pasta", measure: "200 g" },
      { name: "Tomatoes", measure: "2" },
      { name: "Cream", measure: "1/2 cup" },
      { name: "Garlic", measure: "2 cloves" }
    ],
    instructions: ["Cook pasta.", "Simmer tomato, garlic, and cream.", "Toss pasta through sauce."]
  }
];

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

  if (id === "shopping" && !state.isGuestSession && state.currentUser && !hasPremiumPlanningAccess()) {
    showToast("Subscribe to unlock the weekly shopping list.", "info");
    id = "pricing";
  }

  screens.forEach((screen) => {
    screen.classList.toggle("is-active", screen.id === id);
  });

  if (id === "recommendations" && state.currentUser) {
    const hasRenderedContent = refs.recommendationGrid?.children?.length > 0;
    if (!hasRenderedContent) {
      renderRecommendations().catch((error) => {
        renderRecommendationFallbackCards(error);
      });
    }
  }
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
    const error = new Error(payload.error || `Request failed with ${response.status}`);
    error.payload = payload;
    error.status = response.status;
    throw error;
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

function getRecipeImageUrl(recipe, variant = 0) {
  if (recipe?.imageUrl) {
    return String(recipe.imageUrl);
  }
  if (recipe?.image && !String(recipe.image).startsWith("thumb-")) {
    return String(recipe.image);
  }
  const override = recipeImageOverrides[String(recipe?.id || "").toLowerCase()]
    || recipeImageOverrides[String(recipe?.title || "").toLowerCase()];
  if (override) {
    return override;
  }
  if (recipe?.image && String(recipe.image).startsWith("thumb-") && thumbImageUrls[recipe.image]) {
    const fallbackClasses = Object.keys(thumbImageUrls);
    const currentIndex = Math.max(0, fallbackClasses.indexOf(recipe.image));
    const variantIndex = Math.abs(currentIndex + Number(variant || 0)) % fallbackClasses.length;
    return thumbImageUrls[fallbackClasses[variantIndex]];
  }
  const fallbackClasses = Object.keys(thumbImageUrls);
  const seed = hashRecipeText(`${recipe?.id || ""}|${recipe?.title || ""}|${recipe?.category || ""}`, variant);
  return thumbImageUrls[fallbackClasses[seed % fallbackClasses.length]] || thumbImageUrls["thumb-green"];
}

function getThumbStyle(recipe, variant = 0) {
  return `style="background-image: linear-gradient(180deg, rgba(15, 23, 17, 0.08), rgba(15, 23, 17, 0.18)), url('${getRecipeImageUrl(recipe, variant)}'); background-size: cover; background-position: center;"`;
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
      const timeout = window.setTimeout(() => finish(null), googleRedirectPending ? 9000 : 4200);
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

function normalizeIngredientKey(value) {
  return canonicalIngredientName(value);
}

function normalizeIngredientList(values) {
  const source = Array.isArray(values) ? values : parseFavoriteInput(values);
  const seen = new Set();
  return source
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .filter((item) => {
      const key = normalizeIngredientKey(item);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function normalisedIngredientList(values) {
  return normalizeIngredientList(values);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function uniqueRecipesByName(recipes = []) {
  const seen = new Set();
  return (Array.isArray(recipes) ? recipes : [])
    .filter(Boolean)
    .filter((recipe, index) => {
      const title = String(recipe.title || recipe.name || recipe.strMeal || "").trim();
      const key = title ? title.toLowerCase() : String(recipe.id || recipe.idMeal || `recipe-${index}`);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function getRecipeIdentity(recipe, index = 0) {
  const title = String(recipe?.title || recipe?.name || recipe?.strMeal || "").trim().toLowerCase();
  return title || String(recipe?.id || recipe?.idMeal || `recipe-${index}`);
}

function hashRecipeText(text, salt = 0) {
  const source = String(text || "");
  let hash = 2166136261 + (Number(salt) || 0);
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}

function varyRecipes(recipes = [], salt = 0) {
  const cycle = Number(state.recommendationRefreshCount || 0);
  return uniqueRecipesByName(recipes)
    .map((recipe, index) => ({
      recipe,
      score: hashRecipeText(`${getRecipeIdentity(recipe, index)}-${cycle}-${salt}`, index + cycle + salt)
    }))
    .sort((left, right) => left.score - right.score)
    .map((item) => item.recipe);
}

function rotateRecipes(recipes = [], offset = 0) {
  const list = Array.isArray(recipes) ? recipes.filter(Boolean) : [];
  if (!list.length) return [];
  const safeOffset = ((Number(offset) || 0) % list.length + list.length) % list.length;
  return list.slice(safeOffset).concat(list.slice(0, safeOffset));
}

function nextRecommendationCycle() {
  state.recommendationRefreshCount = (state.recommendationRefreshCount || 0) + 1;
  state.lastGuestRecommendationSeed = Date.now() + state.recommendationRefreshCount;
  return state.recommendationRefreshCount;
}

function getRecipeMatchScore(recipe, preferences = []) {
  const preferred = normalizeIngredientList(preferences);
  const baseMatch = Number(recipe?.match || 0);
  if (!preferred.length) return Math.max(72, Math.min(98, baseMatch || 84));

  const title = normalizeIngredientKey(recipe?.title || recipe?.name || "");
  const ingredients = getRecipeIngredientNames(recipe).map((ingredient) => normalizeIngredientKey(ingredient));
  const hits = preferred.filter((item) => {
    const key = normalizeIngredientKey(item);
    return key && (title.includes(key) || ingredients.some((ingredient) => ingredient.includes(key) || key.includes(ingredient)));
  }).length;

  return Math.max(74, Math.min(99, (baseMatch || 78) + hits * 7));
}

function getUserFavoriteRecipes(user = state.currentUser) {
  return Array.isArray(user?.savedRecipes) ? user.savedRecipes : [];
}

function getCurrentUserEmail() {
  return normalizeTerm(state.currentUser?.email);
}

function getPlanPriceLabel(planName) {
  const text = String(planName || "").toLowerCase();
  if (text.includes("weekly") || text.includes("7")) return "$0.01 / 7 days";
  if (text.includes("month") || text.includes("30")) return "$0.02/month";
  return "Free";
}

function hasPremiumPlanningAccess(user = state.currentUser) {
  if (!user || state.isGuestSession) return false;
  const subscription = user.subscription || {};
  const plan = String(subscription.plan || "").toLowerCase();
  const active = String(subscription.status || "").toLowerCase() === "active";
  const allowedPlan = plan.includes("weekly") || plan.includes("7") || plan.includes("30") || plan.includes("month");
  return active && allowedPlan && plan !== "free plan";
}

function getPlanningDayCount(user = state.currentUser) {
  if (!hasPremiumPlanningAccess(user)) return 0;
  const plan = String(user?.subscription?.plan || "").toLowerCase();
  return plan.includes("30") || plan.includes("month") ? 30 : 7;
}

function getPlanningWeekGroups(plan = state.currentMealPlan) {
  const days = Array.isArray(plan) ? plan : [];
  const groups = [];
  for (let index = 0; index < days.length; index += 7) {
    const weekDays = days.slice(index, index + 7);
    if (!weekDays.length) continue;
    groups.push({
      index: groups.length,
      label: `Week ${groups.length + 1}`,
      range: weekDays.length === 1
        ? `Day ${weekDays[0].day}`
        : `Day ${weekDays[0].day} to Day ${weekDays[weekDays.length - 1].day}`,
      days: weekDays
    });
  }
  return groups;
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
  const durationDays = text.includes("weekly") || text.includes("7") ? 7 : ((text.includes("monthly") || text.includes("30")) ? 30 : 0);
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
  const premium = hasPremiumPlanningAccess();
  refs.userGreeting.textContent = guest ? `Hi ${state.currentUser?.username || "Guest"}` : `Hi ${state.currentUser?.username || "PantryPal User"}`;
  refs.personalTab.textContent = "Recommendations";
  refs.personalTab.classList.remove("is-hidden");
  refs.profileTab.classList.toggle("is-hidden", guest);
  refs.shoppingTab.classList.toggle("is-hidden", guest || !premium);
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
  state.activePlanWeekIndex = 0;
  state.activeShoppingWeekIndex = 0;
  state.activeShoppingCategory = "Vegetables";
  refs.loginForm.reset();
  refs.ingredientInput.value = "";
  activateScreen("welcome");
}

function buildLocalResults(query) {
  const wantedTerms = parseFavoriteInput(query).map((item) => item.toLowerCase());
  const salt = wantedTerms.join("|").length + (wantedTerms.length * 13);
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
  const source = ranked.length ? ranked : recipePool;
  const anchorCount = ranked.length ? Math.min(3, source.length) : 0;
  const anchors = source.slice(0, anchorCount);
  const variedRest = varyRecipes(source.slice(anchorCount), salt);
  return [...anchors, ...variedRest].slice(0, ranked.length ? 18 : 12);
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

function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

async function fetchGuestRecommendations(count = 12) {
  const requestCount = Math.max(count * 2, 16);
  const seed = `${state.lastGuestRecommendationSeed}-${state.recommendationRefreshCount}-${Math.random()}`;
  const requests = Array.from({ length: requestCount }, (_, index) =>
    fetchJson(`${THEMEALDB_BASE}/random.php?cb=${encodeURIComponent(`${seed}-${index}`)}`).catch(() => null)
  );
  const results = await Promise.all(requests);
  const meals = uniqueRecipesByName(
    results
      .map((result, index) => result?.meals?.[0] ? normalizeMealDbMeal(result.meals[0], 80 + (index % 15)) : null)
      .filter((meal) => meal?.id)
  );
  const enriched = await enrichMealDbRecipes(varyRecipes(meals, requestCount).slice(0, count), count);

  if (enriched.length >= count) return enriched;

  const extras = await fetchRecipeVarietyPool(count - enriched.length + 6).catch(() => []);
  return uniqueRecipesByName([...enriched, ...extras]).slice(0, count);
}

async function fetchRecipeVarietyPool(count = 18) {
  const requestCount = Math.max(count * 2, count + 10);
  const requests = Array.from({ length: requestCount }, (_, index) =>
    fetchJson(`${THEMEALDB_BASE}/random.php?cb=${encodeURIComponent(`${Date.now()}-${state.recommendationRefreshCount}-${index}-${Math.random()}`)}`).catch(() => null)
  );
  const results = await Promise.all(requests);
  const unique = [];
  const seen = new Set();

  results.forEach((result, index) => {
    if (!result?.meals?.[0]) return;
    const meal = normalizeMealDbMeal(result.meals[0], 78 + (index % 18));
    const key = getRecipeIdentity(meal, index);
    if (!meal?.id || seen.has(key)) return;
    seen.add(key);
    unique.push(meal);
  });

  return enrichMealDbRecipes(varyRecipes(unique, count).slice(0, count), count);
}

async function fetchMealDbCategoryPool(category, count = 12, match = 84) {
  try {
    const data = await fetchJson(`${THEMEALDB_BASE}/filter.php?c=${encodeURIComponent(category)}`);
    const meals = uniqueRecipesByName(
      (data.meals || [])
        .map((meal, index) => normalizeMealDbMeal(meal, match + (index % 10)))
        .filter((meal) => meal?.id)
    );
    return enrichMealDbRecipes(varyRecipes(meals, category.length).slice(0, count), count);
  } catch (_error) {
    return [];
  }
}

async function fetchMealDbAreaPool(area, count = 10, match = 83) {
  try {
    const data = await fetchJson(`${THEMEALDB_BASE}/filter.php?a=${encodeURIComponent(area)}`);
    const meals = uniqueRecipesByName(
      (data.meals || [])
        .map((meal, index) => ({ ...normalizeMealDbMeal(meal, match + (index % 10)), area }))
        .filter((meal) => meal?.id)
    );
    return enrichMealDbRecipes(varyRecipes(meals, area.length + count).slice(0, count), count);
  } catch (_error) {
    return [];
  }
}

async function fetchMealDbSearchPool(term, count = 8, match = 84) {
  try {
    const data = await fetchJson(`${THEMEALDB_BASE}/search.php?s=${encodeURIComponent(term)}`);
    const meals = uniqueRecipesByName(
      (data.meals || [])
        .map((meal, index) => normalizeMealDbMeal(meal, match + (index % 9)))
        .filter((meal) => meal?.id)
    );
    return enrichMealDbRecipes(varyRecipes(meals, term.length + count).slice(0, count), count);
  } catch (_error) {
    return [];
  }
}

async function fetchBroadRecommendationPool(count = 36) {
  const categoryNames = ["Breakfast", "Starter", "Seafood", "Chicken", "Vegetarian", "Dessert", "Pasta"];
  const areaNames = ["Italian", "Mexican", "Indian", "Chinese", "Japanese", "Thai", "American", "British", "Canadian", "French"];
  const searchTerms = ["egg", "salad", "soup", "rice", "noodle", "curry", "pasta", "chicken", "fish", "vegetable"];
  const perBucket = Math.max(4, Math.ceil(count / 10));

  const [categories, areas, searches, random] = await Promise.all([
    Promise.all(categoryNames.map((category) => fetchMealDbCategoryPool(category, perBucket, 82).catch(() => []))),
    Promise.all(areaNames.map((area) => fetchMealDbAreaPool(area, perBucket, 81).catch(() => []))),
    Promise.all(searchTerms.map((term) => fetchMealDbSearchPool(term, Math.max(3, Math.floor(perBucket / 2)), 80).catch(() => []))),
    fetchRecipeVarietyPool(Math.max(12, Math.floor(count / 2))).catch(() => [])
  ]);

  return uniqueRecipesByName([
    ...categories.flat(),
    ...areas.flat(),
    ...searches.flat(),
    ...random,
    ...mealSlotFallbackRecipes,
    ...recipePool
  ]);
}

async function fetchTypedMealPlanPool(totalDays = 7, seeds = []) {
  const perType = totalDays >= 30 ? 24 : 14;
  const [breakfast, starter, dessert, seafood, chicken, beef, vegetarian, side, pasta, broad] = await Promise.all([
    fetchMealDbCategoryPool("Breakfast", perType, 88),
    fetchMealDbCategoryPool("Starter", perType, 84),
    fetchMealDbCategoryPool("Dessert", perType, 82),
    fetchMealDbCategoryPool("Seafood", perType, 86),
    fetchMealDbCategoryPool("Chicken", perType, 86),
    fetchMealDbCategoryPool("Beef", Math.max(10, Math.round(perType / 2)), 84),
    fetchMealDbCategoryPool("Vegetarian", Math.max(10, Math.round(perType / 2)), 84),
    fetchMealDbCategoryPool("Side", Math.max(8, Math.round(perType / 2)), 82),
    fetchFavoriteIngredientPool(seeds.length ? seeds : ["pasta", "rice", "tomato"], 8).catch(() => []),
    fetchBroadRecommendationPool(totalDays >= 30 ? 90 : 42).catch(() => [])
  ]);

  return uniqueRecipesByName([
    ...breakfast.map((recipe) => ({ ...recipe, mealTags: [...(recipe.mealTags || []), "breakfast"] })),
    ...starter.map((recipe) => ({ ...recipe, mealTags: [...(recipe.mealTags || []), "light"] })),
    ...dessert.map((recipe) => ({ ...recipe, mealTags: [...(recipe.mealTags || []), "light", "dessert"] })),
    ...side.map((recipe) => ({ ...recipe, mealTags: [...(recipe.mealTags || []), "light"] })),
    ...seafood.map((recipe) => ({ ...recipe, mealTags: [...(recipe.mealTags || []), "main"] })),
    ...chicken.map((recipe) => ({ ...recipe, mealTags: [...(recipe.mealTags || []), "main"] })),
    ...beef.map((recipe) => ({ ...recipe, mealTags: [...(recipe.mealTags || []), "main"] })),
    ...vegetarian.map((recipe) => ({ ...recipe, mealTags: [...(recipe.mealTags || []), "main"] })),
    ...pasta,
    ...broad
  ]);
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

function getRecipeIngredientNames(recipe) {
  return (recipe?.ingredientDetails?.length ? recipe.ingredientDetails : recipe?.ingredients || [])
    .map((item) => canonicalIngredientName(item.name || item))
    .filter(Boolean);
}

function canonicalIngredientName(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\b(\d+|\d+\/\d+|\d+\.\d+)\b/g, "")
    .replace(/\b(g|kg|ml|l|cup|cups|tbsp|tsp|teaspoon|tablespoon|slice|slices|clove|cloves|fillet|fillets|breast|strips|cooked|fresh|grated|chopped|diced|sliced|handful|stalk)\b/g, "")
    .replace(/\b(tomatoes)\b/g, "tomato")
    .replace(/\b(potatoes)\b/g, "potato")
    .replace(/\b(mushrooms)\b/g, "mushroom")
    .replace(/\b(berries)\b/g, "berry")
    .replace(/\b(eggs)\b/g, "egg")
    .replace(/\s+/g, " ")
    .trim();
}

function getRecipeMealType(recipe) {
  const title = String(recipe?.title || "").toLowerCase();
  const category = String(recipe?.category || "").toLowerCase();
  const tags = (recipe?.mealTags || []).map((tag) => String(tag).toLowerCase());
  const ingredientText = getRecipeIngredientNames(recipe).join(" ");

  if (tags.includes("breakfast") || category.includes("breakfast") || /(breakfast|omelette|omelet|oat|porridge|toast|pancake|waffle|smoothie|granola|cereal|egg)/.test(title)) {
    return "breakfast";
  }

  if (tags.includes("dessert") || category.includes("dessert") || /(dessert|cake|cookie|pudding|parfait|fruit|yogurt|yoghurt|sweet|banana|berry|berries)/.test(title)) {
    return "light";
  }

  if (tags.includes("light") || tags.includes("supper") || /(starter|side|salad|soup|snack)/.test(category) || /(salad|soup|snack|wrap|toast|plate|cup)/.test(title)) {
    return "light";
  }

  if (/(chicken|beef|pork|lamb|salmon|fish|pasta|rice|noodle|potato|curry|steak|dinner|bowl)/.test(title + " " + ingredientText)) {
    return "main";
  }

  return "main";
}

function getSlotType(label) {
  if (/breakfast/i.test(label)) return "breakfast";
  if (/morning tea|afternoon tea|supper/i.test(label)) return "light";
  return "main";
}

function scoreRecipeForSlot(recipe, label, dayIngredientNames) {
  const slotType = getSlotType(label);
  const recipeType = getRecipeMealType(recipe);
  let score = recipeType === slotType ? 50 : -30;
  const title = String(recipe?.title || "").toLowerCase();
  const ingredients = getRecipeIngredientNames(recipe);
  const overlap = ingredients.filter((ingredient) => dayIngredientNames.has(ingredient)).length;

  score -= overlap * 14;
  if (slotType === "breakfast" && /(omelette|omelet|oat|toast|egg|breakfast|smoothie|yogurt|yoghurt)/.test(title)) score += 18;
  if (slotType === "light" && /(salad|soup|snack|parfait|fruit|yogurt|yoghurt|cup|plate|toast)/.test(title)) score += 18;
  if (slotType === "main" && /(chicken|beef|salmon|fish|pasta|rice|curry|dinner|bowl|potato)/.test(title)) score += 14;
  if ((recipe.match || 0) > 85) score += 4;
  return score;
}

function getSlotCandidates(label, normalizedPool) {
  const slotType = getSlotType(label);
  const typedPool = normalizedPool.filter((recipe) => getRecipeMealType(recipe) === slotType);
  const fallbackPool = mealSlotFallbackRecipes.filter((recipe) => getRecipeMealType(recipe) === slotType);
  const typedCandidates = uniqueRecipesByName([...typedPool, ...fallbackPool]);
  if (typedCandidates.length >= 3) {
    return typedCandidates;
  }

  return uniqueRecipesByName([
    ...typedCandidates,
    ...fallbackPool.map((recipe, index) => ({
      ...recipe,
      id: `${recipe.id}-${slotType}-${index}`,
      title: `${recipe.title} ${index + 1}`
    }))
  ]);
}

function groupRecipesForSevenDays(pool, totalDays = 7) {
  const labels = ["Breakfast", "Morning Tea", "Lunch", "Afternoon Tea", "Dinner", "Supper"];
  const normalizedPool = [];
  const seenTitles = new Set();
  const sourcePool = Array.isArray(pool) ? [...pool] : [];

  if (!sourcePool.length) {
    sourcePool.push(...buildLocalResults((state.currentUser?.favorites || []).join(", ")));
  }

  [
    ...sourcePool,
    ...buildLocalResults("Eggs, Oats, Fruit, Yoghurt"),
    ...buildLocalResults("Pancakes, Toast, Smoothie, Banana"),
    ...buildLocalResults("Tea, Muffin, Fruit, Sandwich"),
    ...buildLocalResults("Chicken, Salad, Rice, Tomato"),
    ...buildLocalResults("Beef, Fish, Pasta, Vegetables"),
    ...buildLocalResults("Pasta, Soup, Potato, Salmon"),
    ...buildLocalResults("Dessert, Pudding, Cake, Berries"),
    ...mealSlotFallbackRecipes,
    ...recipePool
  ].forEach((recipe) => {
    const key = String(recipe?.title || "").trim().toLowerCase();
    if (!key || seenTitles.has(key)) return;
    seenTitles.add(key);
    normalizedPool.push(recipe);
  });

  if (!normalizedPool.length) {
    normalizedPool.push(...recipePool);
  }

  while (normalizedPool.length < labels.length) {
    const base = recipePool[normalizedPool.length % recipePool.length];
    normalizedPool.push({
      ...base,
      id: `${base.id}-weekly-${normalizedPool.length}`,
      title: `${base.title} ${normalizedPool.length + 1}`
    });
  }

  const previousDaySignatures = new Set();
  const previousRecipeByLabel = new Map();
  const globalRecipeUsage = new Map();
  const globalUsedTitles = new Set();
  const variedPool = varyRecipes(normalizedPool, totalDays + labels.length);
  normalizedPool.splice(0, normalizedPool.length, ...variedPool);

  function selectRecipeForSlot(label, dayIndex, labelIndex, usedTitles, dayIngredientNames) {
    const slotSalt = (dayIndex + 1) * 31 + (labelIndex + 1) * 17 + state.recommendationRefreshCount;
    const candidates = rotateRecipes(varyRecipes(getSlotCandidates(label, normalizedPool), slotSalt), slotSalt);
    const ranked = candidates
      .map((recipe, index) => ({
        recipe,
        index,
        score: scoreRecipeForSlot(recipe, label, dayIngredientNames)
          - ((globalRecipeUsage.get(getRecipeIdentity(recipe, index)) || 0) * 60)
          + ((slotSalt + index) % 9)
      }))
      .sort((left, right) => right.score - left.score || left.index - right.index);

    const rotated = rotateRecipes(ranked, slotSalt);
    for (const item of rotated) {
      const candidate = item.recipe;
      const candidateTitle = String(candidate?.title || "").trim();
      if (!candidateTitle) continue;
      if (usedTitles.has(candidateTitle.toLowerCase())) continue;
      if (globalUsedTitles.has(candidateTitle.toLowerCase()) && rotated.length > labels.length * 2) continue;
      if (previousRecipeByLabel.get(labelIndex) === candidateTitle && rotated.length > 2) continue;
      const overlap = getRecipeIngredientNames(candidate).filter((ingredient) => dayIngredientNames.has(ingredient)).length;
      if (overlap > 1 && rotated.length > 4) continue;
      return candidate;
    }

    const unusedForDay = rotated.find((item) => {
      const title = String(item.recipe?.title || "").trim().toLowerCase();
      return title && !usedTitles.has(title);
    });
    return unusedForDay?.recipe || normalizedPool[(dayIndex + labelIndex) % normalizedPool.length] || recipePool[0];
  }

  const dayCount = Math.max(1, Number(totalDays) || 7);
  return Array.from({ length: dayCount }, (_, dayIndex) => {
    const usedTitles = new Set();
    const dayIngredientNames = new Set();
    const meals = [];

    labels.forEach((label, labelIndex) => {
      const recipe = selectRecipeForSlot(label, dayIndex, labelIndex, usedTitles, dayIngredientNames);
      const recipeTitle = String(recipe?.title || "").trim();
      if (recipeTitle) {
        usedTitles.add(recipeTitle.toLowerCase());
        globalUsedTitles.add(recipeTitle.toLowerCase());
        previousRecipeByLabel.set(labelIndex, recipeTitle);
        const key = getRecipeIdentity(recipe, labelIndex);
        globalRecipeUsage.set(key, (globalRecipeUsage.get(key) || 0) + 1);
      }
      getRecipeIngredientNames(recipe).forEach((ingredient) => dayIngredientNames.add(ingredient));
      meals.push({ label, recipe });
    });

    let signature = meals.map((meal) => String(meal.recipe?.title || "")).join("|");
    previousDaySignatures.add(signature);
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

function renderShoppingListLegacy() {
  if (!state.isGuestSession && state.currentUser && !hasPremiumPlanningAccess()) {
    if (refs.shoppingCategories) refs.shoppingCategories.innerHTML = "";
    if (refs.shoppingListContent) {
      refs.shoppingListContent.innerHTML = `
        <section class="premium-lock-card shopping-list-locked">
          <p class="eyebrow">Premium planning</p>
          <h2>Subscribe to unlock the weekly shopping list.</h2>
          <p>Recipe recommendations stay available on free accounts. Shopping lists are generated from the subscribed 7-day plan.</p>
          <button type="button" class="btn primary" data-screen="pricing">View Plans</button>
        </section>`;
    }
    return;
  }
  if (!hasPremiumPlanningAccess()) {
    refs.shoppingTabs.innerHTML = '<span class="shopping-tab is-active">Premium access</span>';
    refs.shoppingGrid.innerHTML = `
      <section class="shopping-card premium-lock-card">
        <h3>Weekly shopping list is for subscribers</h3>
        <p>Active 7-day and 30-day subscribers get the categorized weekly shopping list generated from the meal plan.</p>
        <button class="primary-button" type="button" data-screen-target="pricing">View Subscription Plans</button>
      </section>
    `;
    refs.shoppingGrid.querySelector("[data-screen-target='pricing']")?.addEventListener("click", () => activateScreen("pricing"));
    return;
  }

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
        const key = canonicalIngredientName(normalized.name) || normalized.name.toLowerCase();
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

  refs.shoppingTabs.innerHTML = categories.length
    ? categories
        .map((category) => `
          <span class="shopping-tab is-active">${category}</span>
        `)
        .join("")
    : '<span class="shopping-tab is-active">No categories yet</span>';

  const shoppingSections = categories
    .map((category) => {
      const categoryItems = allItems
        .filter((item) => item.category === category)
        .map((item) => `
          <div class="shopping-item">
            <strong>${item.name}</strong>
            <span>${summarizeMeasures(item.amounts)}</span>
          </div>
        `)
        .join("");

      return `
        <section class="shopping-card">
          <h3>${category}</h3>
          <div class="shopping-list">${categoryItems || "<p>No items in this category.</p>"}</div>
        </section>
      `;
    })
    .join("");

  const weeklyDays = state.currentMealPlan
    .map((dayPlan) => `
      <div class="weekly-plan-day">
        <h4>Day ${dayPlan.day}</h4>
        <ul class="shopping-day-meals">
          ${dayPlan.meals.map((meal) => `<li><strong>${meal.label}</strong><span>${meal.recipe.title}</span></li>`).join("")}
        </ul>
      </div>
    `)
    .join("");

  refs.shoppingGrid.innerHTML = `
    <section class="shopping-card">
      <h3>Category Breakdown</h3>
      <div class="shopping-week-grid">
        ${shoppingSections || "<p>No shopping items available.</p>"}
      </div>
    </section>
    <section class="shopping-card">
      <h3>7 Day Breakdown</h3>
      <div class="weekly-plan-mini shopping-day-list">${weeklyDays || "<p>No weekly plan available.</p>"}</div>
    </section>
    <section class="shopping-card">
      <h3>All Week Items</h3>
      <div class="shopping-list">
        ${allItems.map((item) => `
          <div class="shopping-item">
            <strong>${item.name}</strong>
            <span>${item.category} • ${summarizeMeasures(item.amounts)}</span>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderShoppingList() {
  if (!state.isGuestSession && state.currentUser && !hasPremiumPlanningAccess()) {
    if (refs.shoppingCategories) refs.shoppingCategories.innerHTML = "";
    if (refs.shoppingListContent) {
      refs.shoppingListContent.innerHTML = `
        <section class="premium-lock-card shopping-list-locked">
          <p class="eyebrow">Premium planning</p>
          <h2>Subscribe to unlock weekly shopping lists.</h2>
          <p>Recipe recommendations stay available on free accounts. Shopping lists are generated from active 7-day or 30-day subscription meal plans.</p>
          <button type="button" class="btn primary" data-screen="pricing">View Plans</button>
        </section>`;
    }
    return;
  }
  if (!hasPremiumPlanningAccess()) {
    refs.shoppingTabs.innerHTML = '<span class="shopping-tab is-active">Premium access</span>';
    refs.shoppingGrid.innerHTML = `
      <section class="shopping-card premium-lock-card">
        <h3>Shopping lists are for subscribers</h3>
        <p>Active 7-day subscribers get Week 1. Active 30-day subscribers get Week 1 to Week 5 shopping lists.</p>
        <button class="primary-button" type="button" data-screen-target="pricing">View Subscription Plans</button>
      </section>
    `;
    refs.shoppingGrid.querySelector("[data-screen-target='pricing']")?.addEventListener("click", () => activateScreen("pricing"));
    return;
  }

  if (!state.currentMealPlan?.length) {
    const sourceFavorites = state.currentUser?.favorites?.length
      ? state.currentUser.favorites
      : ["Chicken", "Rice", "Tomato", "Spinach"];
    state.currentMealPlan = groupRecipesForSevenDays(
      buildLocalResults(sourceFavorites.join(", ")),
      getPlanningDayCount() || 7
    );
  }

  const weeks = getPlanningWeekGroups(state.currentMealPlan);
  if (!weeks.length) {
    refs.shoppingTabs.innerHTML = '<span class="shopping-tab is-active">No plan available</span>';
    refs.shoppingGrid.innerHTML = `
      <section class="shopping-card">
        <h3>No shopping list yet</h3>
        <p>Open recommendations first so PantryPal can build your shopping list from the active meal plan.</p>
      </section>
    `;
    return;
  }

  if (state.activeShoppingWeekIndex >= weeks.length) state.activeShoppingWeekIndex = 0;
  const activeWeek = weeks[state.activeShoppingWeekIndex] || weeks[0];

  refs.shoppingTabs.innerHTML = weeks.map((week) => `
    <button class="shopping-tab ${week.index === state.activeShoppingWeekIndex ? "is-active" : ""}" type="button" data-shopping-week="${week.index}">
      ${week.label}
      <span>${week.range}</span>
    </button>
  `).join("");
  refs.shoppingTabs.querySelectorAll("[data-shopping-week]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeShoppingWeekIndex = Number(button.dataset.shoppingWeek) || 0;
      renderShoppingList();
    });
  });

  const aggregated = new Map();
  const preferredCategories = ["Dairy", "Protein", "Frozen", "Vegetables", "Dry Items", "Pantry", "Sauces", "Desserts", "Fruit", "Other"];

  activeWeek.days.forEach((dayPlan) => {
    dayPlan.meals.forEach((meal) => {
      const details = meal.recipe.ingredientDetails?.length
        ? meal.recipe.ingredientDetails
        : (meal.recipe.ingredients || []).map((ingredient) => {
            const match = String(ingredient).match(/^(.+?)\s+([A-Za-z].*)$/);
            if (match) return normalizeIngredientMeasure(match[2], match[1]);
            return normalizeIngredientMeasure(ingredient, "As needed");
          });

      details.slice(0, 6).forEach((item) => {
        const normalized = normalizeIngredientMeasure(item.name, item.measure);
        const key = canonicalIngredientName(normalized.name) || normalized.name.toLowerCase();
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

  const shoppingSections = categories.map((category) => {
    const categoryItems = allItems
      .filter((item) => item.category === category)
      .map((item) => `
        <div class="shopping-item">
          <strong>${item.name}</strong>
          <span>${summarizeMeasures(item.amounts)}</span>
        </div>
      `)
      .join("");

    return `
      <section class="shopping-card">
        <h3>${category}</h3>
        <div class="shopping-list">${categoryItems || "<p>No items in this category.</p>"}</div>
      </section>
    `;
  }).join("");

  const weeklyDays = activeWeek.days.map((dayPlan) => `
    <div class="weekly-plan-day">
      <h4>Day ${dayPlan.day}</h4>
      <ul class="shopping-day-meals">
        ${dayPlan.meals.map((meal) => `<li><strong>${meal.label}</strong><span>${meal.recipe.title}</span></li>`).join("")}
      </ul>
    </div>
  `).join("");

  refs.shoppingGrid.innerHTML = `
    <section class="shopping-card">
      <p class="eyebrow">${activeWeek.label}</p>
      <h3>Category Breakdown</h3>
      <div class="shopping-week-grid">
        ${shoppingSections || "<p>No shopping items available.</p>"}
      </div>
    </section>
    <section class="shopping-card">
      <h3>${activeWeek.range} Meal Breakdown</h3>
      <div class="weekly-plan-mini shopping-day-list">${weeklyDays || "<p>No weekly plan available.</p>"}</div>
    </section>
  `;
}

function renderSavedRecipes() {
  const recipes = state.currentUser?.savedRecipes || [];
  const markup = recipes.length
    ? recipes.map((recipe, index) => `
        <article class="saved-recipe-item">
          <div class="thumb ${getThumbClass(recipe)}" ${getThumbStyle(recipe, index)}></div>
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

function renderMealSlot(meal, variant = 0) {
  const recipe = meal.recipe;
  return `
    <button class="meal-slot meal-slot-card" type="button" data-plan-recipe="${recipe.id}">
      <div class="meal-slot-photo">
        <img src="${getRecipeImageUrl(recipe, variant)}" alt="Recipe photo">
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

  const weekGroups = getPlanningWeekGroups(plan);
  if (state.activePlanWeekIndex >= weekGroups.length) state.activePlanWeekIndex = 0;
  const activeWeek = weekGroups[state.activePlanWeekIndex] || weekGroups[0];
  refs.recommendationGrid.className = weekGroups.length > 1
    ? "meal-plan-grid weekly-card-grid month-plan-grid"
    : "meal-plan-grid weekly-card-grid";

  refs.recommendationGrid.innerHTML = `
    <section class="month-week-section">
      ${weekGroups.length > 1 ? `
        <div class="plan-week-tabs" aria-label="Choose recommendation week">
          ${weekGroups.map((week) => `
            <button class="shopping-tab plan-week-tab ${week.index === state.activePlanWeekIndex ? "is-active" : ""}" type="button" data-plan-week="${week.index}">
              ${week.label}
              <span>${week.range}</span>
            </button>
          `).join("")}
        </div>
      ` : ""}
      <div class="month-week-heading">
        <p class="eyebrow">${activeWeek.label}</p>
        <h3>${activeWeek.range}</h3>
      </div>
      <div class="week-days-grid">
        ${activeWeek.days.map((dayPlan) => `
          <article class="day-plan-card week-plan-card">
            <h4>Day ${dayPlan.day}</h4>
            <div class="meal-slot-list">
              ${dayPlan.meals.map((meal, mealIndex) => renderMealSlot(meal, (dayPlan.day * 10) + mealIndex)).join("")}
            </div>
          </article>
        `).join("")}
      </div>
    </section>
  `;

  refs.recommendationGrid.querySelectorAll("[data-plan-week]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activePlanWeekIndex = Number(button.dataset.planWeek) || 0;
      state.activeShoppingWeekIndex = state.activePlanWeekIndex;
      renderWeeklySlider(plan);
      attachPlanRecipeActions();
      renderShoppingList();
    });
  });
}

function renderRecipeDetail(recipe) {
  state.currentRecipe = recipe;
  const title = recipe.title || "Recipe";
  const match = recipe.match || 88;
  refs.recipeTitle.textContent = title;
  if (refs.recipeMatchBadge) refs.recipeMatchBadge.textContent = `${match}% match`;
  const description = recipe.description
    || recipe.summary
    || `A practical ${recipe.category || "meal"} recipe with clear steps, full ingredients, and PantryPal planning support.`;
  if (refs.recipeDescription) refs.recipeDescription.textContent = stripHtml(description).slice(0, 190);
  refs.recipeHero.className = `hero-dish thumb ${getThumbClass(recipe)}`;
  refs.recipeHero.style.backgroundImage = `linear-gradient(180deg, rgba(15, 23, 17, 0.08), rgba(15, 23, 17, 0.18)), url("${getRecipeImageUrl(recipe)}")`;
  refs.recipeHero.style.backgroundSize = "cover";
  refs.recipeHero.style.backgroundPosition = "center";

  const ingredientDetails = recipe.ingredientDetails?.length
    ? recipe.ingredientDetails
    : (recipe.ingredients || []).map((ingredient) => {
        const match = String(ingredient).match(/^([^a-zA-Z]*[0-9./]+[^a-zA-Z]*)?(.+)$/);
        return {
          name: String(match?.[2] || ingredient).trim(),
          measure: String(match?.[1] || "As needed").trim()
        };
      });

  const ingredients = ingredientDetails.length ? ingredientDetails : [{ name: "Ingredient details unavailable", measure: "" }];
  refs.recipeIngredients.innerHTML = ingredients.map((ingredient) => `
    <li class="ok">
      <span>${ingredient.name || ingredient}</span>
      <strong>${ingredient.measure || ""}</strong>
    </li>
  `).join("");
  if (refs.recipeIngredientCount) refs.recipeIngredientCount.textContent = `${ingredients.length} item${ingredients.length === 1 ? "" : "s"}`;
  const cookTime = recipe.readyInMinutes ? `${recipe.readyInMinutes} mins` : "20 mins";
  const prepTime = recipe.prepTime || (recipe.readyInMinutes ? `${Math.max(10, Math.round(recipe.readyInMinutes / 2))} mins` : "20 mins");
  if (refs.recipePrepTime) refs.recipePrepTime.textContent = prepTime;
  refs.recipeReady.textContent = cookTime;
  if (refs.recipeDifficulty) refs.recipeDifficulty.textContent = recipe.difficulty || (ingredients.length > 10 ? "Medium" : "Easy");
  refs.recipeServings.textContent = recipe.servings || "2";
  if (refs.recipeTags) {
    const tags = [
      ingredients.some((item) => /chicken|beef|fish|salmon|egg|tofu|pork|lamb/i.test(item.name || "")) ? "High Protein" : "Pantry Friendly",
      ingredients.some((item) => /rice|pasta|potato|bread|noodle/i.test(item.name || "")) ? "Comfort Meal" : "Fresh Ingredients",
      (recipe.readyInMinutes || 20) <= 30 ? "Quick & Easy" : "Meal Prep"
    ];
    refs.recipeTags.innerHTML = [...new Set(tags)].map((tag) => `<span>${tag}</span>`).join("");
  }

  const steps = recipe.instructions?.length ? recipe.instructions : buildFallbackInstructions(recipe);
  refs.recipeInstructions.innerHTML = steps.map((step) => `<li><span>${step}</span></li>`).join("");
  if (refs.recipeStepCount) refs.recipeStepCount.textContent = `${steps.length} step${steps.length === 1 ? "" : "s"}`;
  if (refs.recipeTip) {
    refs.recipeTip.textContent = recipe.tip || `Recipe notes: ${recipe.category || "Meal"}${recipe.area ? `, ${recipe.area} style` : ""}.`;
  }

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
    const detailedRecipe = recipe.id && /^\d+$/.test(String(recipe.id))
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
    .map((recipe, index) => `
      <article class="result-card">
        <div class="thumb ${getThumbClass(recipe)}" ${getThumbStyle(recipe, index)}>
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

async function renderFreeAccountRecommendations() {
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
    // Local cards above keep the account recommendations usable if the public recipe API is unavailable.
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
  refs.recommendationGrid.innerHTML = cards.map((recipe, index) => `
    <article class="recipe-card">
      <div class="thumb ${getThumbClass(recipe)}" ${getThumbStyle(recipe, index)}></div>
      <div class="recipe-card-body">
        <h3>${escapeHtml(recipe.title || recipe.name)}</h3>
        <p>${savedTitles.has(normalizeIngredientKey(recipe.title || recipe.name || "")) ? "Saved favourite recipe" : `${getRecipeMatchScore(recipe, fallbackSeeds)}% match`}</p>
        <button class="primary-button guest-recipe-button" type="button" data-recipe-id="${recipe.id}">View Recipe</button>
      </div>
    </article>`
  ).join("");
  attachRecipeCardActions(refs.recommendationGrid);
  renderShoppingList();
}

function renderRecommendationFallbackCards(error = null) {
  if (!refs.recommendationGrid) return;
  const favorites = normalizeIngredientList([
    ...(state.currentUser?.favorites || []),
    ...(state.currentUser?.favoriteIngredients || [])
  ]);
  const query = favorites.length ? favorites.join(", ") : "Chicken, Rice, Tomato, Spinach";
  const cards = uniqueRecipesByName([
    ...(state.currentUser?.savedRecipes || []),
    ...buildLocalResults(query),
    ...recipePool
  ]).slice(0, 12);

  state.currentMealPlan = [];
  state.currentResults = cards;
  refs.recommendationHeading.textContent = state.isGuestSession
    ? "Guest Recipe Recommendations"
    : "Personal Recipe Recommendations";
  refs.dashboardNote.textContent = error?.message
    ? "PantryPal is showing local recommendations while live recipe data refreshes."
    : "Recipe ideas are ready. Open any card to view ingredients and cooking instructions.";
  if (refs.recommendationPreview) {
    refs.recommendationPreview.innerHTML = "";
  }
  refs.recommendationGrid.className = "card-row recommendation-fallback-grid";
  refs.recommendationGrid.innerHTML = cards.map((recipe, index) => `
    <article class="recipe-card">
      <div class="thumb ${getThumbClass(recipe)}" ${getThumbStyle(recipe, index)}></div>
      <div class="recipe-card-body">
        <h3>${escapeHtml(recipe.title || recipe.name || "PantryPal Recipe")}</h3>
        <p>${getRecipeMatchScore(recipe, favorites)}% match</p>
        <button class="primary-button guest-recipe-button" type="button" data-recipe-id="${recipe.id}">View Recipe</button>
      </div>
    </article>
  `).join("");
  attachRecipeCardActions(refs.recommendationGrid);
}

async function renderRecommendationsLegacy() {
  try {
    if (!state.isGuestSession && state.currentUser && !hasPremiumPlanningAccess()) {
      await renderFreeAccountRecommendations();
      return;
    }
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
    refs.recommendationGrid.innerHTML = guestResults.map((recipe, index) => `
      <article class="recipe-card">
        <div class="thumb ${getThumbClass(recipe)}" ${getThumbStyle(recipe, index)}></div>
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
    refs.recommendationGrid.innerHTML = guestResults.map((recipe, index) => `
      <article class="recipe-card">
        <div class="thumb ${getThumbClass(recipe)}" ${getThumbStyle(recipe, index)}></div>
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

  if (!state.isGuestSession && state.currentUser && !hasPremiumPlanningAccess()) {
    const favorites = normalizeIngredientList(state.currentUser.favoriteIngredients || []);
    const favoriteRecipes = getUserFavoriteRecipes();
    const seeds = favorites.length ? favorites : ["chicken", "rice", "tomato", "spinach", "egg", "pasta"];
    const savedNames = favoriteRecipes.map((recipe) => recipe.title || recipe.name).filter(Boolean);
    const selected = uniqueRecipesByName([
      ...recipePool.filter((recipe) => {
        const ingredients = getRecipeIngredientNames(recipe).map((item) => normalizeIngredientKey(item));
        const title = normalizeIngredientKey(recipe.title || recipe.name || "");
        return seeds.some((seed) => ingredients.includes(normalizeIngredientKey(seed)) || title.includes(normalizeIngredientKey(seed)));
      }),
      ...recipePool.filter((recipe) => savedNames.some((name) => normalizeIngredientKey(recipe.title || recipe.name || "").includes(normalizeIngredientKey(name).split(" ")[0]))),
      ...recipePool
    ]).slice(0, 9);

    state.currentMealPlan = [];
    refs.recommendationHeading.textContent = "Personal Recipe Recommendations";
    refs.recommendationNote.textContent = "Free accounts get personalised recipe ideas from saved ingredients and favourite meals. Subscribe to unlock the full 7-day plan and weekly shopping list.";
    refs.planTrack.innerHTML = selected.map((recipe) => `
      <article class="recipe-card">
        <img src="${getRecipeImageUrl(recipe)}" alt="${escapeHtml(recipe.title || recipe.name)}">
        <div class="recipe-card-body">
          <span class="match-pill">${getRecipeMatchScore(recipe, seeds)}% match</span>
          <h3>${escapeHtml(recipe.title || recipe.name)}</h3>
          <p>${escapeHtml((recipe.description || "Saved around your PantryPal preferences.").slice(0, 120))}</p>
          <button type="button" class="btn primary" data-view-recipe="${recipe.id}">View Recipe</button>
        </div>
      </article>`
    ).join("");
    renderShoppingList();
    fetchFavoriteIngredientPool(favorites, 9).then((fresh) => {
      if (!fresh.length || !refs.recommendationScreen.classList.contains("active")) return;
      refs.planTrack.innerHTML = uniqueRecipesByName([...fresh, ...selected]).slice(0, 9).map((recipe) => `
        <article class="recipe-card">
          <img src="${getRecipeImageUrl(recipe)}" alt="${escapeHtml(recipe.title || recipe.name)}">
          <div class="recipe-card-body">
            <span class="match-pill">${getRecipeMatchScore(recipe, seeds)}% match</span>
            <h3>${escapeHtml(recipe.title || recipe.name)}</h3>
            <p>${escapeHtml((recipe.description || "Saved around your PantryPal preferences.").slice(0, 120))}</p>
            <button type="button" class="btn primary" data-view-recipe="${recipe.id}">View Recipe</button>
          </div>
        </article>`
      ).join("");
    }).catch(() => {});
    return;
  }

  const planningDayCount = getPlanningDayCount();
  refs.recommendationHeading.textContent = planningDayCount === 30
    ? "Your 30 Day Recommendation Plan"
    : "Your 7 Day Recommendation Plan";
  const favorites = state.currentUser?.favorites?.length ? state.currentUser.favorites : ["Chicken", "Rice", "Tomato"];
  refs.dashboardNote.textContent = planningDayCount === 30
    ? `Built from your saved ingredients (${favorites.join(", ")}) and favourite recipes, divided into Week 1 to Week 5 so each shopping list stays manageable.`
    : `Built from your saved ingredients (${favorites.join(", ")}) and favourite recipes so the week stays practical, varied, and easier to shop for.`;

  let pool = buildLocalResults(favorites.join(", "));
  if (state.currentUser?.savedRecipes?.length) {
    const savedTitles = new Set(state.currentUser.savedRecipes.map((recipe) => String(recipe.title || "").toLowerCase()));
    pool = [
      ...state.currentUser.savedRecipes.map((recipe) => ({ ...recipe, match: Math.max(recipe.match || 88, 92) })),
      ...pool.filter((recipe) => !savedTitles.has(String(recipe.title || "").toLowerCase()))
    ];
  }
  state.currentMealPlan = groupRecipesForSevenDays(pool, planningDayCount);
  state.currentPlanDayIndex = 0;
  state.activePlanWeekIndex = 0;
  state.activeShoppingWeekIndex = 0;
  state.currentResults = state.currentMealPlan.flatMap((day) => day.meals.map((meal) => meal.recipe));
  renderWeeklySlider(state.currentMealPlan);
  attachPlanRecipeActions();
  renderShoppingList();

  try {
    pool = await fetchFavoriteIngredientPool(favorites, 10);
  } catch (_error) {
    pool = state.currentResults;
  }

  try {
    const varietyPool = await fetchRecipeVarietyPool(18);
    const seenTitles = new Set(pool.map((recipe) => String(recipe.title || "").toLowerCase()));
    varietyPool.forEach((recipe) => {
      const key = String(recipe.title || "").toLowerCase();
      if (!key || seenTitles.has(key)) return;
      seenTitles.add(key);
      pool.push(recipe);
    });
  } catch (_error) {
    // Keep the existing pool if MealDB random variety requests fail.
  }

  if (state.currentUser?.savedRecipes?.length) {
    const savedRecipeTitles = new Set(state.currentUser.savedRecipes.map((recipe) => recipe.title));
    const boostedSaved = state.currentUser.savedRecipes
      .filter((recipe) => !savedRecipeTitles.has(recipe.title) || true)
      .map((recipe) => ({ ...recipe, match: Math.max(recipe.match || 88, 92) }));
    pool = [...boostedSaved, ...pool.filter((recipe) => !savedRecipeTitles.has(recipe.title))];
  }

  state.currentMealPlan = groupRecipesForSevenDays(pool, planningDayCount);
  state.currentPlanDayIndex = 0;
  state.activePlanWeekIndex = 0;
  state.activeShoppingWeekIndex = 0;
  state.currentResults = state.currentMealPlan.flatMap((day) => day.meals.map((meal) => meal.recipe));
  if (refs.recommendationPreview) {
    refs.recommendationPreview.innerHTML = "";
  }

  renderWeeklySlider(state.currentMealPlan);
  attachPlanRecipeActions();
  renderShoppingList();
  } catch (error) {
    renderRecommendationFallbackCards(error);
    throw error;
  }
}

function renderRecommendationCards(cards, label = "Recommendation") {
  const allCards = uniqueRecipesByName(cards);
  state.currentRecommendationCards = allCards;
  const visibleLimit = Math.max(12, Number(state.recommendationCardLimit) || 12);
  const safeCards = allCards.slice(0, visibleLimit);
  state.currentResults = allCards;
  refs.recommendationGrid.className = "card-row recommendation-card-grid";
  refs.recommendationGrid.innerHTML = `
    ${safeCards.map((recipe, index) => `
      <article class="recipe-card">
        <div class="thumb ${getThumbClass(recipe)}" ${getThumbStyle(recipe, index)}></div>
        <div class="recipe-card-body">
          <h3>${escapeHtml(recipe.title || recipe.name || "PantryPal Recipe")}</h3>
          <p>${label === "Personalised" ? `${getRecipeMatchScore(recipe, state.currentUser?.favorites || [])}% match` : label}</p>
          <button class="primary-button guest-recipe-button" type="button" data-recipe-id="${recipe.id}">View Recipe</button>
        </div>
      </article>
    `).join("")}
    ${allCards.length > safeCards.length ? `
      <div class="recommendation-more-row">
        <button class="primary-button recommendation-more-button" type="button" data-show-more-recipes>
          Show more recipes
        </button>
      </div>
    ` : ""}
  `;
  attachRecipeCardActions(refs.recommendationGrid);
  refs.recommendationGrid.querySelector("[data-show-more-recipes]")?.addEventListener("click", () => {
    state.recommendationCardLimit = visibleLimit + 12;
    renderRecommendationCards(state.currentRecommendationCards, label);
  });
}

async function renderRecommendations() {
  try {
    nextRecommendationCycle();
    state.recommendationCardLimit = 12;
    refs.recommendationGrid.innerHTML = "";
    if (refs.recommendationPreview) refs.recommendationPreview.innerHTML = "";
    state.currentMealPlan = [];

    if (state.isGuestSession) {
      const guestSeeds = normalizeIngredientList(state.currentUser?.favorites || []);
      const guestSeedText = guestSeeds.join(", ");
      refs.recommendationHeading.textContent = "Guest Recipe Recommendations";
      refs.dashboardNote.textContent = guestSeeds.length
        ? `General recipe ideas plus extra matches for your guest favourites: ${guestSeedText}.`
        : "General recipe ideas for this guest session. Add favourite ingredients before starting a guest session to personalise this list.";
      const guestFallback = uniqueRecipesByName([
        ...buildLocalResults(guestSeedText || "Chicken, Rice, Tomato, Pasta, Eggs"),
        ...recipePool
      ]);
      const variedGuestFallback = varyRecipes(guestFallback, 101).slice(0, 12);
      renderRecommendationCards(variedGuestFallback, "Guest recommendation");

      try {
        const [favouriteMatches, generalMatches, cuisineMatches] = await Promise.all([
          guestSeeds.length ? fetchFavoriteIngredientPool(guestSeeds, 8).catch(() => []) : Promise.resolve([]),
          fetchGuestRecommendations(36).catch(() => []),
          fetchBroadRecommendationPool(48).catch(() => [])
        ]);
        const guestResults = uniqueRecipesByName([
          ...favouriteMatches,
          ...generalMatches,
          ...cuisineMatches,
          ...variedGuestFallback
        ]);
        renderRecommendationCards(varyRecipes(guestResults, 117), "Guest recommendation");
      } catch (_error) {
        renderRecommendationCards(variedGuestFallback, "Guest recommendation");
      }
      renderShoppingList();
      return;
    }

    const savedIngredients = normalizeIngredientList([
      ...(state.currentUser?.favoriteIngredients || []),
      ...(state.currentUser?.favorites || [])
    ]);
    const savedRecipes = state.currentUser?.savedRecipes || [];
    const savedRecipeIngredients = savedRecipes.flatMap((recipe) => getRecipeIngredientNames(recipe)).slice(0, 8);
    const seeds = savedIngredients.length ? savedIngredients : (savedRecipeIngredients.length ? savedRecipeIngredients : ["Chicken", "Rice", "Tomato", "Spinach", "Pasta", "Eggs"]);
    const seedText = seeds.join(", ");

    const planningDayCount = getPlanningDayCount();
    if (planningDayCount > 0) {
      const planLabel = planningDayCount === 30 ? "30 Day Recommendation Plan" : "7 Day Recommendation Plan";
      refs.recommendationHeading.textContent = `Your ${planLabel}`;
      refs.dashboardNote.textContent = savedIngredients.length || savedRecipes.length
        ? `Built from your saved favourites: ${seedText}. ${planningDayCount === 30 ? "Use the week tabs to move through all 30 days." : "Use this 7-day plan with the linked shopping list."}`
        : `A premium ${planningDayCount}-day meal plan using balanced breakfast, light-meal, lunch, dinner, and supper ideas. Save favourite ingredients to personalise the next refresh.`;
      if (refs.recommendationNote) {
        refs.recommendationNote.textContent = planningDayCount === 30
          ? "30-day subscribers receive Week 1 to Week 5 planning and matching shopping lists."
          : "7-day subscribers receive one weekly plan and a matching shopping list.";
      }

      let planPool = uniqueRecipesByName([
        ...savedRecipes.map((recipe) => ({ ...recipe, match: Math.max(recipe.match || 88, 94) })),
        ...buildLocalResults(seedText),
        ...recipePool,
        ...mealSlotFallbackRecipes
      ]);
      planPool = varyRecipes(planPool, planningDayCount);

      state.currentMealPlan = groupRecipesForSevenDays(planPool, planningDayCount);
      state.currentPlanDayIndex = 0;
      state.activePlanWeekIndex = 0;
      state.activeShoppingWeekIndex = 0;
      state.currentResults = state.currentMealPlan.flatMap((day) => day.meals.map((meal) => meal.recipe));
      renderWeeklySlider(state.currentMealPlan);
      attachPlanRecipeActions();
      renderShoppingList();

      try {
        const [favouriteMatches, typedMealMatches, varietyMatches, broadMatches] = await Promise.all([
          fetchFavoriteIngredientPool(seeds, 16).catch(() => []),
          fetchTypedMealPlanPool(planningDayCount, seeds).catch(() => []),
          fetchRecipeVarietyPool(planningDayCount >= 30 ? 70 : 28).catch(() => []),
          fetchBroadRecommendationPool(planningDayCount >= 30 ? 110 : 50).catch(() => [])
        ]);
        planPool = uniqueRecipesByName([
          ...savedRecipes.map((recipe) => ({ ...recipe, match: Math.max(recipe.match || 88, 94) })),
          ...favouriteMatches,
          ...typedMealMatches,
          ...varietyMatches,
          ...broadMatches,
          ...planPool
        ]);
        planPool = varyRecipes(planPool, planningDayCount + 47);
        state.currentMealPlan = groupRecipesForSevenDays(planPool, planningDayCount);
        state.currentPlanDayIndex = 0;
        state.activePlanWeekIndex = 0;
        state.activeShoppingWeekIndex = 0;
        state.currentResults = state.currentMealPlan.flatMap((day) => day.meals.map((meal) => meal.recipe));
        renderWeeklySlider(state.currentMealPlan);
        attachPlanRecipeActions();
        renderShoppingList();
      } catch (_error) {
        // The local plan above remains usable if the public recipe service is unavailable.
      }
      return;
    }

    const fallbackCards = uniqueRecipesByName([
      ...savedRecipes.map((recipe) => ({ ...recipe, match: Math.max(recipe.match || 88, 93) })),
      ...buildLocalResults(seedText),
      ...recipePool
    ]);
    const variedFallbackCards = varyRecipes(fallbackCards, 211).slice(0, 12);

    refs.recommendationHeading.textContent = "Personal Recipe Recommendations";
    refs.dashboardNote.textContent = savedIngredients.length || savedRecipes.length
      ? `Based on your saved favourites: ${seedText}. Premium meal plans and shopping lists stay in the subscribed planning tools.`
      : "A rotating set of popular recipes. Save ingredients or favourite recipes to make this page more personal.";
    if (refs.recommendationNote) {
      refs.recommendationNote.textContent = hasPremiumPlanningAccess()
        ? "You are subscribed, so shopping and meal-plan tools can use these preferences separately."
        : "Free logged-in users can still browse personalised recipe recommendations.";
    }

    renderRecommendationCards(variedFallbackCards, "Personalised");

    try {
      const [freshByFavorites, variety, cuisineMatches] = await Promise.all([
        fetchFavoriteIngredientPool(seeds, 10).catch(() => []),
        fetchRecipeVarietyPool(36).catch(() => []),
        fetchBroadRecommendationPool(54).catch(() => [])
      ]);
      const liveCards = uniqueRecipesByName([
        ...savedRecipes.map((recipe) => ({ ...recipe, match: Math.max(recipe.match || 88, 93) })),
        ...freshByFavorites,
        ...variety,
        ...cuisineMatches,
        ...variedFallbackCards
      ]);
      renderRecommendationCards(varyRecipes(liveCards, 223), "Personalised");
    } catch (_error) {
      renderRecommendationCards(variedFallbackCards, "Personalised");
    }

    renderShoppingList();
  } catch (error) {
    renderRecommendationFallbackCards(error);
  }
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
      const emailSent = Boolean(result.subscriptionEmail?.sent);
      showToast(
        emailSent
          ? "Subscription activated successfully. Confirmation email sent."
          : `Subscription activated successfully. Email delivery could not be confirmed${result.subscriptionEmail?.reason ? `: ${result.subscriptionEmail.reason}` : "."}`,
        emailSent ? "success" : "warning"
      );
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
    const pantryEmailSent = Boolean(result.confirmedInboxDelivery || result.emailDeliveryDetails?.pantrypalEmail?.sent);
    const firebaseAccepted = Boolean(result.firebaseAccepted || result.emailDeliveryDetails?.firebase?.sent);
    showToast(
      pantryEmailSent
        ? `Sign up successful. Welcome email sent to ${email}.`
        : firebaseAccepted
          ? `Sign up successful. Firebase accepted the verification email for ${email}; check inbox and spam.`
          : `Sign up successful, but email delivery failed: ${result.emailDeliveryReason || "provider timeout"}.`,
      pantryEmailSent || firebaseAccepted ? "success" : "warning"
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
        result.firebaseAccepted = true;
      } catch (firebaseError) {
        result.emailDeliveryReason = firebaseError.message || result.emailDeliveryReason;
      }
    }

    const pantryEmailSent = Boolean(result.confirmedInboxDelivery || result.emailDeliveryDetails?.pantrypalEmail?.sent);
    const firebaseAccepted = Boolean(result.firebaseAccepted || result.emailDeliveryDetails?.firebase?.sent || result.delivery === "firebase-client");
    setHelperText(
      refs.forgotPasswordNote,
      pantryEmailSent
        ? `Password reset email sent to ${result.email}. The secure reset link expires in 60 minutes.`
        : firebaseAccepted
          ? `Firebase accepted the reset request for ${result.email}. Check inbox and spam. PantryPal direct email delivery was not confirmed: ${result.emailDeliveryReason || "provider timeout"}.`
          : `Reset link prepared for ${result.email}, but email delivery failed: ${result.emailDeliveryReason || "provider rejected the message"}.`,
      pantryEmailSent || firebaseAccepted ? "success" : "warning"
    );
    showToast(
      pantryEmailSent
        ? `Password reset email sent to ${result.email}.`
        : firebaseAccepted
          ? "Firebase accepted the reset email. Check inbox and spam."
          : `Email delivery failed: ${result.emailDeliveryReason || "provider rejected the message"}.`,
      pantryEmailSent || firebaseAccepted ? "success" : "warning"
    );
  } catch (error) {
    if (state.firebaseAuth && error.payload?.email) {
      try {
        await state.firebaseAuth.sendPasswordResetEmail(error.payload.email);
        setHelperText(
          refs.forgotPasswordNote,
          `Firebase accepted the reset request for ${error.payload.email}. Check inbox and spam.`,
          "success"
        );
        showToast(`Firebase accepted the reset email for ${error.payload.email}.`, "success");
        return;
      } catch (firebaseError) {
        error.message = `${error.message || "Password reset request failed."} Firebase browser fallback also failed: ${firebaseError.message || firebaseError.code || "unknown error"}`;
      }
    }
    const reason = error.payload?.emailDeliveryReason ? ` (${error.payload.emailDeliveryReason})` : "";
    setHelperText(refs.forgotPasswordNote, `${error.message || "Password reset request failed."}${reason}`, "error");
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

function renderUnsubscribedPage() {
  const user = state.currentUser || {};
  refs.genericScreen.innerHTML = `
    <section class="page-shell subscription-ended-page">
      <button type="button" class="ghost back-btn" data-back>Back</button>
      <div class="brand-lockup"><span class="brand-mark"></span><span>PantryPal</span></div>
      <h1>Your account has been unsubscribed</h1>
      <p>Your subscription has been cancelled. You can still search recipes and use free account recommendations, but 7-day planning and shopping lists are paused.</p>
      <div class="account-status-card">
        <span>Current status</span>
        <strong>${escapeHtml(user.subscriptionStatus || "free")}</strong>
      </div>
      <button type="button" class="btn primary" data-screen="pricing">Renew Subscription</button>
      <button type="button" class="btn ghost" data-screen="overview">Back to Overview</button>
    </section>`;
}

function renderUnsubscribedPage() {
  const user = state.currentUser || {};
  refs.genericScreen.innerHTML = `
    <section class="page-shell subscription-ended-page">
      <button type="button" class="ghost back-btn" data-back>Back</button>
      <div class="brand-lockup"><span class="brand-mark"></span><span>PantryPal</span></div>
      <h1>Your account has been unsubscribed</h1>
      <p>Your subscription has been cancelled. You can still search recipes and use free account recommendations, but 7-day planning and shopping lists are paused.</p>
      <div class="account-status-card">
        <span>Current status</span>
        <strong>${escapeHtml(user.subscriptionStatus || "free")}</strong>
      </div>
      <button type="button" class="btn primary" data-screen="pricing">Renew Subscription</button>
      <button type="button" class="btn ghost" data-screen="overview">Back to Overview</button>
    </section>`;
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
    showToast(
      result.cancellationEmail?.sent
        ? "Subscription removed. Cancellation email sent."
        : `Subscription removed. Cancellation email delivery could not be confirmed${result.cancellationEmail?.reason ? `: ${result.cancellationEmail.reason}` : "."}`,
      result.cancellationEmail?.sent ? "success" : "warning"
    );
    activateScreen("unsubscribed");
  } catch (error) {
    showToast(error.message || "Subscription could not be cancelled.", "error");
  }
}

function bindButtonPressFeedback() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("button, [role='button'], .btn, .primary-button, .secondary-button, .soft-button, .soft-outline, .guest-button, .waste-button, .plan-button, .danger-button, .back-button, .text-button, .icon-button");
    if (!button || button.disabled || button.classList.contains("is-clicking")) return;

    button.classList.add("is-clicking");
    window.setTimeout(() => {
      button.classList.remove("is-clicking");
    }, 180);
  }, true);
}

function bindStaticEvents() {
  bindButtonPressFeedback();

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
  refs.recipeReturnButton?.addEventListener("click", () => {
    if (!state.currentRecipe) return;
    showToast("Recipe added to your weekly list.", "success");
  });
  refs.saveRecipeButton.addEventListener("click", saveCurrentRecipe);
  refs.recipePrintButton?.addEventListener("click", () => window.print());
  refs.recipeShareButton?.addEventListener("click", async () => {
    const title = state.currentRecipe?.title || "PantryPal recipe";
    const text = `PantryPal recipe: ${title}`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(`${text} ${window.location.href}`);
        showToast("Recipe link copied.", "success");
      }
    } catch (_error) {
      showToast("Recipe share cancelled.", "warning");
    }
  });
  refs.guestRefresh.addEventListener("click", async () => {
    nextRecommendationCycle();
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

  if (getQueryParam("start") === "google" && isHostedAuthEnabled() && state.firebaseAuth && !state.currentUser) {
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

initialize().catch((error) => {
  showToast(error.message || "PantryPal could not start.", "error");
});
