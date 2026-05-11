const fs = require("fs");
const path = require("path");

const root = __dirname;
const filePath = (file) => path.join(root, file);
const read = (file) => fs.existsSync(filePath(file)) ? fs.readFileSync(filePath(file), "utf8") : "";
const write = (file, content) => fs.writeFileSync(filePath(file), content, "utf8");

const wrapperSource = `const fs = require("fs");
const path = require("path");

const root = __dirname;
const source = path.join(root, "server-source.js");
const target = path.join(root, "server.js");
const runtime = path.join(root, "server-runtime.js");

if (!fs.existsSync(source)) {
  throw new Error("server-source.js is missing; PantryPal cannot start safely.");
}

fs.copyFileSync(source, target);
require("./render-patch");
require("./render-hotfix");
fs.copyFileSync(target, runtime);
require(runtime);
`;

function isWrapper(content) {
  return content.includes("server-source.js") && content.includes("server-runtime.js") && !content.includes("const app = express();");
}

function isExpressServer(content) {
  return content.includes("const app = express();") && content.includes("app.listen(");
}

function restoreWrapperIfNeeded() {
  const server = read("server.js");
  if (isWrapper(server)) {
    write("server.js", wrapperSource);
  }
}

function patchScript() {
  let js = read("script.js");
  if (!js || js.includes("PantryPal live reliability patch 20260506c")) return;

  const patch = String.raw`
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
`;

  const marker = "initialize().catch((error) => {";
  js = js.includes(marker) ? js.replace(marker, patch + "\n\n" + marker) : `${js}\n${patch}\n`;
  write("script.js", js);
}

function patchStyles() {
  let css = read("styles.css");
  if (!css || css.includes("PantryPal live professional layout patch 20260506c")) return;

  css += String.raw`

/* PantryPal live professional layout patch 20260506c */
:root{--pp-ink:#101a12;--pp-green:#16833d;--pp-deep:#123b22;--pp-soft:#f5f8ef;--pp-line:rgba(24,72,39,.14);--pp-shadow:0 30px 90px rgba(15,48,24,.16)}
body{background:linear-gradient(135deg,#eef6e8,#f7fbf2)!important;color:var(--pp-ink)!important}.app-shell{width:min(100% - 36px,1500px)!important;margin:0 auto!important}.browser-frame{border-radius:32px!important;overflow:visible!important;background:#fff!important;box-shadow:var(--pp-shadow)!important}.screen-content{box-sizing:border-box!important}
.app-brand,.pricing-brand,.payment-brand{gap:10px!important}.brand-dot{width:15px!important;height:15px!important;box-shadow:0 0 0 8px rgba(28,145,68,.14)!important}
#dashboard .dashboard-layout{min-height:auto!important;padding:clamp(24px,3.2vw,52px)!important;background:linear-gradient(90deg,rgba(10,48,26,.82),rgba(10,48,26,.48)),url("https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1900&q=80") center/cover!important}
.dashboard-topbar{width:min(100%,1320px)!important;margin:0 auto 28px!important;padding:14px 18px!important;border-radius:26px!important;background:rgba(255,255,255,.92)!important;color:var(--pp-ink)!important;border:1px solid rgba(255,255,255,.58)!important;box-shadow:0 20px 70px rgba(7,31,14,.2)!important}.dashboard-topbar .soft-button{color:var(--pp-ink)!important;background:rgba(255,255,255,.72)!important;border:1px solid var(--pp-line)!important}
.dashboard-home-grid,.dashboard-action-grid,.dashboard-search-section,.recommendation-header-clean,.meal-plan-grid.weekly-card-grid{width:min(100%,1320px)!important;max-width:1320px!important;margin-left:auto!important;margin-right:auto!important}
.dashboard-home-grid{display:grid!important;grid-template-columns:minmax(0,1.2fr) minmax(360px,.8fr)!important;gap:24px!important;align-items:stretch!important;margin-bottom:24px!important}.dashboard-intro-card,.dashboard-insight-card,.dashboard-action-card,.dashboard-search-section{background:rgba(255,255,255,.96)!important;color:var(--pp-ink)!important;border:1px solid rgba(255,255,255,.66)!important;border-radius:30px!important;box-shadow:0 22px 70px rgba(7,31,14,.16)!important}.dashboard-intro-card{padding:clamp(30px,4vw,58px)!important}.dashboard-intro-card h2{color:var(--pp-ink)!important;text-shadow:none!important;line-height:.96!important;letter-spacing:-.055em!important}.dashboard-intro-card p,.dashboard-insight-card p{max-width:72ch!important;line-height:1.72!important;text-align:left!important}.dashboard-stat-row,.dashboard-action-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:18px!important}.dashboard-stat-card,.dashboard-action-card{padding:22px!important;text-align:left!important}.dashboard-search-section{padding:26px!important;margin-top:24px!important}.dashboard-search-form{display:grid!important;grid-template-columns:minmax(0,1fr) auto!important;gap:14px!important}.dashboard-search-form input{min-height:58px!important;font-size:1rem!important}
#recommendations .recommendation-layout{min-height:auto!important;padding:clamp(26px,3.4vw,54px)!important;background:linear-gradient(180deg,rgba(13,55,29,.82),rgba(13,55,29,.55)),url("https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1900&q=80") center/cover fixed!important}.recommendation-header-clean{display:grid!important;grid-template-columns:minmax(0,1.05fr) minmax(330px,.95fr)!important;gap:24px!important;margin-bottom:26px!important}.recommendation-intro-card,.recommendation-summary-card{padding:clamp(28px,3vw,44px)!important;border-radius:32px!important;text-align:left!important}.recommendation-screen-title{color:var(--pp-ink)!important;text-shadow:none!important;line-height:.98!important}.recommendation-summary-card{background:rgba(18,61,34,.95)!important;color:#fff!important}.meal-plan-grid.weekly-card-grid{display:grid!important;grid-template-columns:1fr!important;gap:26px!important}.week-plan-card{padding:clamp(28px,3.3vw,46px)!important;border-radius:34px!important;background:rgba(255,255,255,.98)!important;color:var(--pp-ink)!important;box-shadow:var(--pp-shadow)!important}.week-plan-card h3{font-size:clamp(1.6rem,2vw,2.2rem)!important;margin:0 0 22px!important}.meal-slot-list{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:20px!important}.meal-slot-card{display:grid!important;grid-template-columns:118px minmax(0,1fr)!important;gap:16px!important;align-items:center!important;min-height:150px!important;padding:18px!important;border-radius:24px!important;background:#f7faf3!important;text-align:left!important}.meal-slot-photo,.meal-slot-photo img{width:118px!important;height:118px!important;border-radius:20px!important;object-fit:cover!important}.meal-slot-copy strong{display:block!important;color:#26713b!important;font-size:1rem!important;letter-spacing:.12em!important;text-transform:uppercase!important;margin-bottom:8px!important}.meal-slot-copy span{display:block!important;color:#536255!important;line-height:1.55!important}.meal-slot-copy span:nth-child(2){font-size:1.12rem!important;font-weight:850!important;color:var(--pp-ink)!important;margin-bottom:8px!important}
.profile-layout,.shopping-layout,.pricing-layout,.payment-layout,.recipe-layout,.results-layout{min-height:auto!important;padding:clamp(32px,4vw,62px)!important;background:radial-gradient(circle at 12% 18%,rgba(220,241,204,.75),transparent 34%),linear-gradient(135deg,#f6faef,#eef5e8)!important}.profile-shell,.shopping-shell,.pricing-shell,.payment-shell{width:min(100%,1280px)!important;max-width:1280px!important;margin:0 auto!important;padding:clamp(32px,4vw,58px)!important;border-radius:34px!important;background:rgba(255,255,255,.97)!important;border:1px solid var(--pp-line)!important;box-shadow:var(--pp-shadow)!important}.profile-header,.shopping-header,.pricing-brand,.payment-header{padding:0 0 28px!important;text-align:left!important}.profile-header h2,.shopping-shell h2,.pricing-shell h2,.payment-header h2{font-size:clamp(2.8rem,6vw,5.8rem)!important;line-height:.96!important;text-align:left!important;letter-spacing:-.06em!important}.profile-header p,.shopping-shell p,.pricing-intro,.payment-header p{max-width:78ch!important;text-align:left!important;line-height:1.7!important}.profile-grid,.shopping-grid,.pricing-grid,.payment-grid,.subscription-manage-grid{gap:clamp(24px,3vw,38px)!important}.profile-card,.shopping-card,.price-card,.payment-card,.subscription-manage-card{padding:clamp(24px,3vw,42px)!important;border-radius:28px!important;text-align:left!important;background:#fff!important;border:1px solid var(--pp-line)!important}.shopping-tabs{display:flex!important;flex-wrap:wrap!important;gap:12px!important;margin:24px 0 28px!important}.shopping-tab{padding:12px 18px!important;border-radius:999px!important}.shopping-grid:empty::before{content:"PantryPal is preparing the weekly shopping list from your active 7-day plan.";display:block;padding:28px;border-radius:24px;background:#fff;color:#526455}.shopping-list,.shopping-day-list,.weekly-plan-mini{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:14px!important}.shopping-item,.weekly-plan-day{padding:16px!important;border-radius:18px!important;background:#f7faf3!important;min-height:92px!important}.pricing-grid{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;align-items:stretch!important;gap:28px!important}.price-card{overflow:visible!important}.price-card.featured{transform:none!important;padding-top:54px!important}.popular-badge{top:14px!important;right:24px!important;left:auto!important;transform:none!important;white-space:nowrap!important}.feature-list li::before,.ingredient-list li::before,.price-card li::before,.subscription-before-list li::before{content:"\2713"!important;color:var(--pp-green)!important;font-weight:900!important}.payment-grid{display:grid!important;grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;max-width:1160px!important;margin:24px auto 0!important}.payment-card{overflow:visible!important}.payment-hosted-panel,.payment-security-note{padding:22px!important;border-radius:22px!important;background:#f7faf3!important}.app-toast{z-index:99999!important;max-width:min(520px,calc(100vw - 32px))!important}.app-toast.is-success{background:#173f25!important;color:#fff!important}.app-toast.is-error{background:#9f2d1e!important;color:#fff!important}.app-toast.is-warning{background:#7b4f10!important;color:#fff!important}
@media(max-width:1120px){.dashboard-home-grid,.recommendation-header-clean,.payment-grid{grid-template-columns:1fr!important}.dashboard-stat-row,.dashboard-action-grid,.meal-slot-list,.shopping-list,.shopping-day-list,.weekly-plan-mini,.pricing-grid{grid-template-columns:repeat(2,minmax(0,1fr))!important}}@media(max-width:720px){.app-shell{width:min(100% - 16px,100%)!important}.dashboard-stat-row,.dashboard-action-grid,.meal-slot-list,.meal-slot-card,.shopping-list,.shopping-day-list,.weekly-plan-mini,.pricing-grid,.payment-grid,.profile-grid{grid-template-columns:1fr!important}.dashboard-search-form{grid-template-columns:1fr!important}.meal-slot-card{grid-template-columns:96px minmax(0,1fr)!important}.meal-slot-photo,.meal-slot-photo img{width:96px!important;height:96px!important}.profile-header h2,.shopping-shell h2,.pricing-shell h2,.payment-header h2{font-size:clamp(2.4rem,13vw,4.4rem)!important}}
`;
  write("styles.css", css);
}

function patchServerFile(file) {
  let server = read(file);
  if (!server || server.includes("PantryPal live server email patch 20260506c")) return;
  if (!isExpressServer(server)) return;

  const routeMarker = 'app.post("/api/auth/request-password-reset", async (req, res) => {';
  if (!server.includes(routeMarker)) return;

  const patch = String.raw`

// PantryPal live server email patch 20260506c
sendEmail = async function pantryPalLiveSendEmail({ to, subject, text, html }) {
  if (!to) return false;
  const from = String(EMAIL_FROM || SMTP_USER || "").replace(/^["']|["']$/g, "");
  if (!from) return false;
  const transports = [];
  if (mailer) transports.push(mailer);
  if (SMTP_USER && SMTP_PASS) {
    transports.push(nodemailer.createTransport({ service: "gmail", connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000, auth: { user: SMTP_USER, pass: SMTP_PASS } }));
    transports.push(nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000, auth: { user: SMTP_USER, pass: SMTP_PASS } }));
    transports.push(nodemailer.createTransport({ host: SMTP_HOST || "smtp.gmail.com", port: SMTP_PORT || 587, secure: Number(SMTP_PORT || 587) === 465, connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000, auth: { user: SMTP_USER, pass: SMTP_PASS } }));
  }
  for (const transport of transports) {
    try {
      await transport.sendMail({ from, to, subject, text, html });
      return true;
    } catch (error) {
      console.error("PantryPal email attempt failed:", error.message);
    }
  }
  return false;
};

async function pantryPalLiveFirebasePasswordReset(email) {
  if (!FIREBASE_PUBLIC_CONFIG.apiKey || !email) {
    return { sent: false, reason: "firebase-not-configured" };
  }
  try {
    const response = await fetch(FIREBASE_IDENTITY_TOOLKIT_BASE + "/accounts:sendOobCode?key=" + encodeURIComponent(FIREBASE_PUBLIC_CONFIG.apiKey), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestType: "PASSWORD_RESET", email })
    });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { sent: false, reason: payload?.error?.message || "firebase-reset-email-failed" };
    }
    return { sent: true, provider: "firebase" };
  } catch (error) {
    return { sent: false, reason: error.message || "firebase-reset-email-failed" };
  }
}

sendGoogleLoginNotification = async function pantryPalLiveGoogleLoginNotice(user) {
  if (!user?.email) return { sent: false, reason: "missing-email" };
  const sent = await sendEmail({
    to: user.email,
    subject: "PantryPal Google sign-in",
    text: "Hi " + (user.username || "there") + ", your PantryPal account was opened with Google sign-in.",
    html: "<p>Hi " + (user.username || "there") + ",</p><p>Your PantryPal account was opened with Google sign-in.</p>"
  });
  return { sent, user, reason: sent ? "sent" : "email-delivery-failed" };
};

sendPasswordResetNotice = async function pantryPalLivePasswordResetNotice(user, resetUrl) {
  if (!user?.email || !resetUrl) return { sent: false, reason: "missing-email-or-link" };
  const sent = await sendEmail({
    to: user.email,
    subject: "Reset your PantryPal password",
    text: "Use this PantryPal password reset link: " + resetUrl,
    html: "<p>Use this link to reset your PantryPal password:</p><p><a href=\"" + resetUrl + "\">Reset PantryPal password</a></p><p>This link expires in 1 hour.</p>"
  });
  return { sent, reason: sent ? "sent" : "email-delivery-failed" };
};

app.post("/api/auth/request-password-reset", async (req, res) => {
  try {
    const identity = String(req.body?.identity || "").trim();
    if (!identity) {
      res.status(400).json({ error: "Username or email is required." });
      return;
    }
    const user = await findUserByIdentity(identity);
    if (!user || !user.email) {
      res.status(404).json({ error: "No PantryPal account matched that username or email." });
      return;
    }
    const resetToken = generatePasswordResetToken();
    const resetExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const updatedUser = await upsertUser({ ...user, passwordResetToken: resetToken, passwordResetExpiresAt: resetExpiresAt });
    const resetUrl = getPasswordResetUrl(req, resetToken);
    const smtpNotice = await sendPasswordResetNotice(updatedUser, resetUrl);
    const firebaseNotice = smtpNotice.sent ? { sent: false, reason: "smtp-sent" } : await pantryPalLiveFirebasePasswordReset(updatedUser.email);
    const notificationEmailSent = Boolean(smtpNotice.sent || firebaseNotice.sent);
    res.json({
      ok: true,
      email: updatedUser.email,
      username: updatedUser.username,
      resetLinkIssued: true,
      notificationEmailSent,
      delivery: smtpNotice.sent ? "smtp" : (firebaseNotice.sent ? "firebase" : "none"),
      emailDeliveryReason: notificationEmailSent ? "sent" : (firebaseNotice.reason || smtpNotice.reason || "email-delivery-failed"),
      expiresAt: resetExpiresAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
`;

  server = server.replace(routeMarker, `${patch}\n\n${routeMarker}`);
  write(file, server);
}

function patchServer() {
  patchServerFile("server-source.js");
  patchServerFile("server.js");
  restoreWrapperIfNeeded();
}

patchScript();
patchStyles();
patchServer();

