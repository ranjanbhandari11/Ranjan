const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config({ path: path.join(__dirname, ".env.local") });
const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const Stripe = require("stripe");
const nodemailer = require("nodemailer");

const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || "0.0.0.0";
const APP_ENV = String(process.env.APP_ENV || "").trim().toLowerCase();
const PUBLIC_APP_URL = String(process.env.PUBLIC_APP_URL || "").trim().replace(/\/+$/, "");
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  "";
const SUPABASE_USERS_TABLE = process.env.SUPABASE_USERS_TABLE || "users";
const FIREBASE_PUBLIC_CONFIG = {
  apiKey: process.env.FIREBASE_API_KEY || "",
  authDomain: process.env.FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.FIREBASE_PROJECT_ID || "",
  appId: process.env.FIREBASE_APP_ID || "",
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || ""
};
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || "";
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "";
const STRIPE_WEEKLY_PRICE_ID = process.env.STRIPE_WEEKLY_PRICE_ID || "";
const STRIPE_30DAY_PRICE_ID = process.env.STRIPE_30DAY_PRICE_ID || "";
const SMTP_HOST = process.env.SMTP_HOST || "";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER || "";
const SMTP_PASS = process.env.SMTP_PASS || "";
const EMAIL_FROM = process.env.EMAIL_FROM || SMTP_USER || "";
const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const FIREBASE_IDENTITY_TOOLKIT_BASE = "https://identitytoolkit.googleapis.com/v1";

const SEEDED_USERS = [
  {
    username: "Ranjan Bhandari",
    email: "ranjanbhandari11@gmail.com",
    password: "Aiihe10764",
    favorites: ["Chicken", "Rice", "Tomato", "Spinach"]
  },
  {
    username: "Ramandeep Kaur",
    email: "ramandeep7.7.2003@gmail.com",
    password: "Ramandeep",
    favorites: ["Pasta", "Garlic", "Chicken", "Cream"]
  },
  {
    username: "Manish KC Khatri",
    email: "manishkc9803@gmail.com",
    password: "Manish",
    favorites: ["Beef", "Rice", "Potato", "Onion"]
  }
];

const app = express();
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }
  next();
});
app.use(express.json({ limit: "2mb" }));
app.use((req, res, next) => {
  const pathname = req.path || "/";
  const shouldDisableCache =
    pathname === "/" ||
    pathname === "/index.html" ||
    pathname.endsWith(".js") ||
    pathname.endsWith(".css");

  if (shouldDisableCache) {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
  }

  next();
});
app.use(express.static(__dirname, {
  etag: false,
  lastModified: false
}));

let storageMode = "file";
let supabase = null;
const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;
const mailer = SMTP_HOST && SMTP_USER && SMTP_PASS
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS
      }
    })
  : null;
let subscriptionNotificationTimer = null;

function normalizeTerm(value) {
  return String(value || "").trim().toLowerCase();
}

function isSupabaseSchemaMismatch(error) {
  const message = String(error?.message || error || "").toLowerCase();
  return (
    message.includes("could not find the") ||
    message.includes("column") && message.includes("schema cache") ||
    message.includes("does not exist")
  );
}

async function fallbackToFileStorage(error) {
  if (storageMode === "file") {
    return;
  }

  storageMode = "file";
  console.warn("Supabase schema mismatch, falling back to local file storage:", error?.message || error);
  await ensureFileStore();
  await seedUsers();
}

function isLocalHostName(hostname = "") {
  const host = String(hostname || "").trim().toLowerCase();
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

function getRequestHostName(req) {
  const hostHeader = String(req.get("host") || "").trim().toLowerCase();
  return hostHeader.split(":")[0];
}

function isLocalRequest(req) {
  return isLocalHostName(getRequestHostName(req));
}

function isHostedRuntime() {
  if (APP_ENV === "production" || APP_ENV === "render") {
    return true;
  }

  return Boolean(PUBLIC_APP_URL);
}

function isHostedAuthRequest(req) {
  const hasFirebaseConfig = Boolean(
    FIREBASE_PUBLIC_CONFIG.apiKey &&
    FIREBASE_PUBLIC_CONFIG.authDomain &&
    FIREBASE_PUBLIC_CONFIG.projectId &&
    FIREBASE_PUBLIC_CONFIG.appId
  );

  return hasFirebaseConfig || isHostedRuntime() || isLocalRequest(req);
}

function getCanonicalAppOrigin(req) {
  if (PUBLIC_APP_URL) {
    return PUBLIC_APP_URL;
  }

  return `${req.protocol}://${req.get("host")}`;
}

function createDefaultUser(overrides = {}) {
  return {
    username: "",
    email: "",
    password: "",
    favorites: ["Chicken", "Spinach", "Rice", "Tomato"],
    accountStatus: "active",
    deactivatedAt: null,
    deletedAt: null,
    subscription: {
      plan: "Free Plan",
      status: "inactive"
    },
    savedRecipes: [],
    recommendationPlan: [],
    shoppingList: {
      items: [],
      weeklyDays: []
    },
    authNotifications: {
      lastGoogleLoginEmailSentAt: "",
      lastSignupEmailSentAt: "",
      lastPasswordResetNoticeSentAt: ""
    },
    passwordResetToken: "",
    passwordResetExpiresAt: null,
    ...overrides
  };
}

function sanitizeUser(user) {
  const normalized = createDefaultUser(user || {});
  return {
    username: normalized.username,
    username_lower: normalizeTerm(normalized.username),
    email: normalizeTerm(normalized.email),
    password: normalized.password,
    favorites: Array.isArray(normalized.favorites) ? normalized.favorites : [],
    account_status: normalized.accountStatus || "active",
    deactivated_at: normalized.deactivatedAt || null,
    deleted_at: normalized.deletedAt || null,
    subscription: normalized.subscription || { plan: "Free Plan", status: "inactive" },
    saved_recipes: Array.isArray(normalized.savedRecipes) ? normalized.savedRecipes : [],
    recommendation_plan: Array.isArray(normalized.recommendationPlan) ? normalized.recommendationPlan : [],
    shopping_list: normalized.shoppingList || { items: [], weeklyDays: [] },
    auth_notifications: normalized.authNotifications || {
      lastGoogleLoginEmailSentAt: "",
      lastSignupEmailSentAt: "",
      lastPasswordResetNoticeSentAt: ""
    },
    password_reset_token: normalized.passwordResetToken || "",
    password_reset_expires_at: normalized.passwordResetExpiresAt || null
  };
}

function fromStorageUser(user) {
  if (!user) {
    return null;
  }

  return {
    username: user.username,
    email: user.email,
    password: user.password,
    favorites: Array.isArray(user.favorites) ? user.favorites : [],
    accountStatus: user.account_status || user.accountStatus || "active",
    deactivatedAt: user.deactivated_at || user.deactivatedAt || null,
    deletedAt: user.deleted_at || user.deletedAt || null,
    subscription: user.subscription || { plan: "Free Plan", status: "inactive" },
    savedRecipes: Array.isArray(user.saved_recipes) ? user.saved_recipes : (Array.isArray(user.savedRecipes) ? user.savedRecipes : []),
    recommendationPlan: Array.isArray(user.recommendation_plan) ? user.recommendation_plan : (Array.isArray(user.recommendationPlan) ? user.recommendationPlan : []),
    shoppingList: user.shopping_list || user.shoppingList || { items: [], weeklyDays: [] },
    authNotifications: user.auth_notifications || user.authNotifications || {
      lastGoogleLoginEmailSentAt: "",
      lastSignupEmailSentAt: "",
      lastPasswordResetNoticeSentAt: ""
    },
    passwordResetToken: user.password_reset_token || user.passwordResetToken || "",
    passwordResetExpiresAt: user.password_reset_expires_at || user.passwordResetExpiresAt || null
  };
}

async function sendEmail({ to, subject, text, html }) {
  if (!mailer || !to || !EMAIL_FROM) {
    return false;
  }

  await mailer.sendMail({
    from: EMAIL_FROM,
    to,
    subject,
    text,
    html
  });
  return true;
}

function minutesSince(timestamp) {
  if (!timestamp) {
    return Number.POSITIVE_INFINITY;
  }

  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) {
    return Number.POSITIVE_INFINITY;
  }

  return (Date.now() - parsed.getTime()) / 60000;
}

async function sendGoogleLoginNotification(user) {
  if (!user?.email) {
    return { sent: false, reason: "missing-email" };
  }

  const authNotifications = user.authNotifications || {};
  if (minutesSince(authNotifications.lastGoogleLoginEmailSentAt) < 15) {
    return { sent: false, reason: "recently-sent" };
  }

  const sent = await sendEmail({
    to: user.email,
    subject: "PantryPal Google sign-in successful",
    text: `Hi ${user.username}, your PantryPal account was just accessed using Google sign-in.`,
    html: `<p>Hi ${user.username},</p><p>Your PantryPal account was just accessed using <strong>Google sign-in</strong>.</p>`
  });

  if (!sent) {
    return { sent: false, reason: "mailer-unavailable" };
  }

  const updatedUser = await upsertUser({
    ...user,
    authNotifications: {
      ...authNotifications,
      lastGoogleLoginEmailSentAt: new Date().toISOString()
    }
  });

  return { sent: true, user: updatedUser };
}

async function sendSignupNotification(user) {
  if (!user?.email) {
    return { sent: false, reason: "missing-email" };
  }

  const authNotifications = user.authNotifications || {};
  if (authNotifications.lastSignupEmailSentAt) {
    return { sent: false, reason: "already-sent" };
  }

  const sent = await sendEmail({
    to: user.email,
    subject: "Welcome to PantryPal",
    text: `Hi ${user.username}, your PantryPal account has been created successfully.`,
    html: `<p>Hi ${user.username},</p><p>Your PantryPal account has been created successfully.</p>`
  });

  if (!sent) {
    return { sent: false, reason: "mailer-unavailable" };
  }

  const updatedUser = await upsertUser({
    ...user,
    authNotifications: {
      ...authNotifications,
      lastSignupEmailSentAt: new Date().toISOString()
    }
  });

  return { sent: true, user: updatedUser };
}

async function sendPasswordResetNotice(user, resetUrl = "") {
  if (!user?.email) {
    return { sent: false, reason: "missing-email" };
  }

  const authNotifications = user.authNotifications || {};
  if (minutesSince(authNotifications.lastPasswordResetNoticeSentAt) < 10) {
    return { sent: false, reason: "recently-sent" };
  }

  const sent = await sendEmail({
    to: user.email,
    subject: "PantryPal password reset requested",
    text: resetUrl
      ? `Hi ${user.username}, a PantryPal password reset was requested for your account. Use this secure reset link to choose a new password: ${resetUrl}`
      : `Hi ${user.username}, a PantryPal password reset was requested for your account.`,
    html: resetUrl
      ? `<p>Hi ${user.username},</p><p>A PantryPal password reset was requested for your account.</p><p><a href="${resetUrl}">Click here to choose a new password</a>.</p><p>This link expires in 60 minutes.</p>`
      : `<p>Hi ${user.username},</p><p>A PantryPal password reset was requested for your account.</p>`
  });

  if (!sent) {
    return { sent: false, reason: "mailer-unavailable" };
  }

  const updatedUser = await upsertUser({
    ...user,
    authNotifications: {
      ...authNotifications,
      lastPasswordResetNoticeSentAt: new Date().toISOString()
    }
  });

  return { sent: true, user: updatedUser };
}

function getPlanDurationDays(planName) {
  const text = String(planName || "").toLowerCase();
  if (text.includes("weekly")) return 7;
  if (text.includes("30")) return 30;
  if (text.includes("month")) return 30;
  return 0;
}

function toIsoDate(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
}

function normalizeSubscription(subscription = {}) {
  return {
    plan: subscription.plan || "Free Plan",
    status: subscription.status || "inactive",
    startedAt: subscription.startedAt || null,
    endsAt: subscription.endsAt || null,
    stripeCustomerId: subscription.stripeCustomerId || "",
    stripeSubscriptionId: subscription.stripeSubscriptionId || "",
    stripeCheckoutSessionId: subscription.stripeCheckoutSessionId || "",
    lastReminderSentAt: subscription.lastReminderSentAt || "",
    endedEmailSentAt: subscription.endedEmailSentAt || "",
    confirmationEmailSentAt: subscription.confirmationEmailSentAt || "",
    cancelledAt: subscription.cancelledAt || null
  };
}

function getStripePeriodEnd(subscriptionData, fallbackPlanName = "") {
  const periodEndUnix = subscriptionData?.current_period_end;
  if (periodEndUnix) {
    return new Date(periodEndUnix * 1000).toISOString();
  }

  const durationDays = getPlanDurationDays(fallbackPlanName);
  return durationDays ? toIsoDate(durationDays) : null;
}

async function notifySubscriptionStarted(user) {
  if (!user?.email || !user?.subscription?.plan) {
    return;
  }

  if (user.subscription?.confirmationEmailSentAt) {
    return;
  }

  const daysLeft = user.subscription?.endsAt
    ? Math.max(0, Math.ceil((new Date(user.subscription.endsAt).getTime() - Date.now()) / 86400000))
    : getPlanDurationDays(user.subscription.plan);

  await sendEmail({
    to: user.email,
    subject: `PantryPal subscription confirmed: ${user.subscription.plan}`,
    text: `Hi ${user.username}, your PantryPal ${user.subscription.plan} is now active. You currently have ${daysLeft} day(s) left in this billing period.`,
    html: `<p>Hi ${user.username},</p><p>Your PantryPal <strong>${user.subscription.plan}</strong> is now active.</p><p>You currently have <strong>${daysLeft} day(s)</strong> left in this billing period.</p>`
  });

  await upsertUser({
    ...user,
    subscription: {
      ...normalizeSubscription(user.subscription),
      confirmationEmailSentAt: new Date().toISOString()
    }
  });
}

async function runSubscriptionNotifications() {
  if (!mailer) {
    return;
  }

  const users =
    storageMode === "supabase"
      ? (await supabase.from(SUPABASE_USERS_TABLE).select("*")).data?.map(fromStorageUser) || []
      : await readFileUsers();

  for (const rawUser of users) {
    const user = fromStorageUser(rawUser);
    const subscription = normalizeSubscription(user?.subscription || {});
    if (!subscription.endsAt) {
      continue;
    }

    const endsAt = new Date(subscription.endsAt);
    if (Number.isNaN(endsAt.getTime())) {
      continue;
    }

    const now = new Date();
    const daysLeft = Math.ceil((endsAt.getTime() - now.getTime()) / 86400000);

    if (subscription.status === "active" && daysLeft <= 1 && subscription.lastReminderSentAt !== now.toDateString()) {
      await sendEmail({
        to: user.email,
        subject: `PantryPal plan ending soon`,
        text: `Hi ${user.username}, your PantryPal ${subscription.plan} ends in ${Math.max(daysLeft, 0)} day(s). Renew any time if you want to continue premium access.`,
        html: `<p>Hi ${user.username},</p><p>Your PantryPal <strong>${subscription.plan}</strong> ends in <strong>${Math.max(daysLeft, 0)} day(s)</strong>.</p><p>Renew any time if you want to continue premium access.</p>`
      });

      subscription.lastReminderSentAt = now.toDateString();
      await upsertUser({ ...user, subscription });
    }

    if (
      subscription.status === "active" &&
      endsAt.getTime() <= now.getTime() &&
      !subscription.endedEmailSentAt
    ) {
      subscription.status = "expired";
      subscription.plan = "Free Plan";
      subscription.endedEmailSentAt = new Date().toISOString();
      await upsertUser({ ...user, subscription });

      await sendEmail({
        to: user.email,
        subject: `PantryPal plan ended`,
        text: `Hi ${user.username}, your PantryPal plan has finished. You can renew anytime to continue premium features.`,
        html: `<p>Hi ${user.username},</p><p>Your PantryPal plan has finished.</p><p>You can renew anytime if you want to continue premium features.</p>`
      });
    }
  }
}

async function ensureFileStore() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(USERS_FILE);
  } catch {
    const seeded = SEEDED_USERS.map((user) => fromStorageUser(sanitizeUser(user)));
    await fs.writeFile(USERS_FILE, JSON.stringify(seeded, null, 2), "utf8");
  }
}

async function readFileUsers() {
  await ensureFileStore();
  const raw = await fs.readFile(USERS_FILE, "utf8");
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

async function writeFileUsers(users) {
  await ensureFileStore();
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), "utf8");
}

async function ensureSupabaseSeedUsers() {
  for (const seededUser of SEEDED_USERS) {
    const existing = await findUserByEmail(seededUser.email);
    if (!existing) {
      await upsertUser(seededUser);
    }
  }
}

async function seedUsers() {
  if (storageMode === "supabase") {
    await ensureSupabaseSeedUsers();
    return;
  }

  const existingUsers = await readFileUsers();
  const byEmail = new Map(existingUsers.map((user) => [normalizeTerm(user.email), user]));
  SEEDED_USERS.forEach((seededUser) => {
    const key = normalizeTerm(seededUser.email);
    if (!byEmail.has(key)) {
      byEmail.set(key, fromStorageUser(sanitizeUser(seededUser)));
    }
  });
  await writeFileUsers([...byEmail.values()]);
}

async function findUserByEmail(email) {
  const emailKey = normalizeTerm(email);

  if (storageMode === "supabase") {
    try {
      const { data, error } = await supabase
        .from(SUPABASE_USERS_TABLE)
        .select("*")
        .eq("email", emailKey)
        .maybeSingle();

      if (error) {
        throw error;
      }
      return fromStorageUser(data);
    } catch (error) {
      if (!isSupabaseSchemaMismatch(error)) {
        throw error;
      }
      await fallbackToFileStorage(error);
    }
  }

  const users = await readFileUsers();
  return users.find((user) => normalizeTerm(user.email) === emailKey) || null;
}

async function findUserByIdentity(identity) {
  const identityKey = normalizeTerm(identity);

  if (storageMode === "supabase") {
    try {
      const { data, error } = await supabase
        .from(SUPABASE_USERS_TABLE)
        .select("*")
        .or(`email.eq.${identityKey},username_lower.eq.${identityKey}`)
        .maybeSingle();

      if (error) {
        throw error;
      }
      return fromStorageUser(data);
    } catch (error) {
      if (!isSupabaseSchemaMismatch(error)) {
        throw error;
      }
      await fallbackToFileStorage(error);
    }
  }

  const users = await readFileUsers();
  return (
    users.find(
      (user) =>
        normalizeTerm(user.email) === identityKey ||
        normalizeTerm(user.username) === identityKey
    ) || null
  );
}

async function findUserByUsername(username, excludeEmail = "") {
  const usernameKey = normalizeTerm(username);
  const excludeKey = normalizeTerm(excludeEmail);

  if (storageMode === "supabase") {
    try {
      const query = supabase
        .from(SUPABASE_USERS_TABLE)
        .select("*")
        .eq("username_lower", usernameKey)
        .limit(1);

      const { data, error } = await query;
      if (error) {
        throw error;
      }

      const user = fromStorageUser(data?.[0] || null);
      if (user && normalizeTerm(user.email) !== excludeKey) {
        return user;
      }
      return null;
    } catch (error) {
      if (!isSupabaseSchemaMismatch(error)) {
        throw error;
      }
      await fallbackToFileStorage(error);
    }
  }

  const users = await readFileUsers();
  return (
    users
      .map((entry) => fromStorageUser(entry))
      .find(
        (user) =>
          normalizeTerm(user.username) === usernameKey &&
          normalizeTerm(user.email) !== excludeKey
      ) || null
  );
}

async function upsertUser(user) {
  const payload = sanitizeUser(user);

  if (storageMode === "supabase") {
    try {
      const { data, error } = await supabase
        .from(SUPABASE_USERS_TABLE)
        .upsert(payload, { onConflict: "email" })
        .select("*")
        .single();

      if (error) {
        throw error;
      }
      return fromStorageUser(data);
    } catch (error) {
      if (!isSupabaseSchemaMismatch(error)) {
        throw error;
      }
      await fallbackToFileStorage(error);
    }
  }

  const users = await readFileUsers();
  const emailKey = normalizeTerm(payload.email);
  const nextUsers = users.filter((entry) => normalizeTerm(entry.email) !== emailKey);
  nextUsers.push(fromStorageUser(payload));
  await writeFileUsers(nextUsers);
  return fromStorageUser(payload);
}

async function deleteUserByEmail(email) {
  const emailKey = normalizeTerm(email);

  if (storageMode === "supabase") {
    try {
      const { error } = await supabase
        .from(SUPABASE_USERS_TABLE)
        .delete()
        .eq("email", emailKey);

      if (error) {
        throw error;
      }
      return;
    } catch (error) {
      if (!isSupabaseSchemaMismatch(error)) {
        throw error;
      }
      await fallbackToFileStorage(error);
    }
  }

  const users = await readFileUsers();
  const nextUsers = users.filter((entry) => normalizeTerm(entry.email) !== emailKey);
  await writeFileUsers(nextUsers);
}

async function applySubscriptionToUser(email, nextSubscription) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("User not found.");
  }

  const updatedUser = await upsertUser({
    ...user,
    subscription: {
      ...normalizeSubscription(user.subscription),
      ...nextSubscription
    }
  });

  return updatedUser;
}

function generatePasswordResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

function getPasswordResetUrl(req, token) {
  const origin = getCanonicalAppOrigin(req);
  return `${origin}/?reset_token=${encodeURIComponent(token)}`;
}

async function bootstrapFirebaseAccount(user) {
  if (!FIREBASE_PUBLIC_CONFIG.apiKey) {
    return { ok: false, reason: "firebase-not-configured" };
  }

  try {
    const response = await fetch(
      `${FIREBASE_IDENTITY_TOOLKIT_BASE}/accounts:signUp?key=${encodeURIComponent(FIREBASE_PUBLIC_CONFIG.apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          password: user.password,
          returnSecureToken: true
        })
      }
    );

    const payload = await response.json().catch(() => ({}));

    if (response.ok) {
      return { ok: true, created: true, payload };
    }

    const message = String(payload?.error?.message || "");
    if (message === "EMAIL_EXISTS") {
      return { ok: true, created: false, reason: "email-already-exists" };
    }

    return { ok: false, reason: message || "firebase-signup-failed", payload };
  } catch (error) {
    return { ok: false, reason: error.message || "firebase-bootstrap-failed" };
  }
}

app.get("/api/health", async (_req, res) => {
  try {
    if (storageMode === "supabase") {
      try {
        const { error } = await supabase.from(SUPABASE_USERS_TABLE).select("email").limit(1);
        if (error) {
          throw error;
        }
      } catch (error) {
        if (!isSupabaseSchemaMismatch(error)) {
          throw error;
        }
        await fallbackToFileStorage(error);
      }
    }

    res.json({
      ok: true,
      storageMode,
      table: SUPABASE_USERS_TABLE,
      runtime: {
        appEnv: APP_ENV || "local",
        hostedRuntime: isHostedRuntime(),
        publicAppUrl: PUBLIC_APP_URL || null
      }
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get("/api/public-config", (req, res) => {
  const localMode = isLocalRequest(req);
  const firebaseEnabled = Boolean(
    FIREBASE_PUBLIC_CONFIG.apiKey &&
    FIREBASE_PUBLIC_CONFIG.authDomain &&
    FIREBASE_PUBLIC_CONFIG.projectId &&
    FIREBASE_PUBLIC_CONFIG.appId
  );
  const stripeEnabled = Boolean(STRIPE_PUBLISHABLE_KEY && STRIPE_SECRET_KEY);
  res.json({
    app: {
      appEnv: APP_ENV || (localMode ? "local" : "production"),
      localMode,
      hostedRuntime: isHostedRuntime(),
      hostedAuthEnabled: firebaseEnabled,
      publicUrl: PUBLIC_APP_URL || null,
      healthUrl: `${getCanonicalAppOrigin(req)}/api/health`,
      passwordResetEmailEnabled: Boolean(mailer && EMAIL_FROM)
    },
    firebase: FIREBASE_PUBLIC_CONFIG,
    stripe: {
      publishableKey: STRIPE_PUBLISHABLE_KEY,
      enabled: stripeEnabled,
      checkoutEnabled: stripeEnabled
    }
  });
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { identity, password } = req.body || {};
    if (!identity || !password) {
      res.status(400).json({ error: "Identity and password are required." });
      return;
    }

    const user = await findUserByIdentity(identity);
    if (!user) {
      res.status(404).json({ error: "Account not found." });
      return;
    }

    if (user.password !== password) {
      res.status(401).json({ error: "Password is incorrect." });
      return;
    }

    if (String(user.accountStatus || "active").toLowerCase() !== "active") {
      res.status(403).json({
        error: "This PantryPal account is deactivated. Contact support or reactivate the account before signing in."
      });
      return;
    }

    res.json({ user, storageMode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/resolve-reset-account", async (req, res) => {
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

    const bootstrap = await bootstrapFirebaseAccount(user);
    if (!bootstrap.ok && bootstrap.reason !== "firebase-not-configured") {
      res.status(502).json({
        error: "PantryPal could not prepare the Firebase reset account yet.",
        details: bootstrap.reason
      });
      return;
    }

    res.json({
      email: user.email,
      username: user.username,
      bootstrapCreated: Boolean(bootstrap.created)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

    if (!mailer || !EMAIL_FROM) {
      res.status(503).json({
        error: "Password reset email is not configured yet. Add SMTP settings to PantryPal first."
      });
      return;
    }

    const resetToken = generatePasswordResetToken();
    const resetExpiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const updatedUser = await upsertUser({
      ...user,
      passwordResetToken: resetToken,
      passwordResetExpiresAt: resetExpiresAt
    });
    const resetUrl = getPasswordResetUrl(req, resetToken);

    const resetNotice = await sendPasswordResetNotice(updatedUser, resetUrl);

    res.json({
      ok: true,
      email: user.email,
      username: user.username,
      delivery: "pantrypal",
      resetLinkIssued: true,
      notificationEmailSent: Boolean(resetNotice.sent),
      expiresAt: resetExpiresAt
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const token = String(req.body?.token || "").trim();
    const password = String(req.body?.password || "").trim();

    if (!token || !password) {
      res.status(400).json({ error: "Reset token and new password are required." });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: "Use at least 6 characters for your new password." });
      return;
    }

    const allUsers =
      storageMode === "supabase"
        ? await (async () => {
            try {
              const { data, error } = await supabase.from(SUPABASE_USERS_TABLE).select("*");
              if (error) {
                throw error;
              }
              return data?.map(fromStorageUser) || [];
            } catch (error) {
              if (!isSupabaseSchemaMismatch(error)) {
                throw error;
              }
              await fallbackToFileStorage(error);
              return await readFileUsers();
            }
          })()
        : await readFileUsers();

    const user = allUsers
      .map((entry) => fromStorageUser(entry))
      .find((entry) => entry?.passwordResetToken && entry.passwordResetToken === token);

    if (!user) {
      res.status(404).json({ error: "This password reset link is invalid or has already been used." });
      return;
    }

    const expiresAt = new Date(user.passwordResetExpiresAt || "");
    if (!user.passwordResetExpiresAt || Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() < Date.now()) {
      await upsertUser({
        ...user,
        passwordResetToken: "",
        passwordResetExpiresAt: null
      });
      res.status(410).json({ error: "This password reset link has expired. Request a new one." });
      return;
    }

    const updatedUser = await upsertUser({
      ...user,
      password,
      passwordResetToken: "",
      passwordResetExpiresAt: null
    });

    const firebaseBootstrap = await bootstrapFirebaseAccount(updatedUser);

    res.json({
      ok: true,
      user: updatedUser,
      firebaseBootstrap
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/firebase-sync", async (req, res) => {
  try {
    const {
      username,
      email,
      password = "",
      favorites = [],
      authProvider = "",
      sendLoginEmail = false
    } = req.body || {};
    if (!email) {
      res.status(400).json({ error: "Email is required." });
      return;
    }

    const normalizedEmail = normalizeTerm(email);
    const existingUser = await findUserByEmail(normalizedEmail);
    const fallbackUsername =
      String(username || normalizedEmail.split("@")[0] || "PantryPal User").trim();

    if (existingUser) {
      const updatedUser = await upsertUser({
        ...existingUser,
        username: existingUser.username || fallbackUsername,
        password: existingUser.password || password,
        favorites: Array.isArray(existingUser.favorites) && existingUser.favorites.length
          ? existingUser.favorites
          : favorites
      });
      let finalUser = updatedUser;
      let notificationEmailSent = false;

      if (sendLoginEmail && normalizeTerm(authProvider) === "google") {
        const loginNotice = await sendGoogleLoginNotification(updatedUser);
        notificationEmailSent = Boolean(loginNotice.sent);
        finalUser = loginNotice.user || updatedUser;
      }

      res.json({ user: finalUser, storageMode, notificationEmailSent });
      return;
    }

    const createdUser = await upsertUser({
      username: fallbackUsername,
      email: normalizedEmail,
      password,
      favorites: Array.isArray(favorites) && favorites.length ? favorites : ["Chicken", "Rice", "Tomato"]
    });
    let finalUser = createdUser;
    let notificationEmailSent = false;

    if (normalizeTerm(authProvider) === "google" && sendLoginEmail) {
      const loginNotice = await sendGoogleLoginNotification(createdUser);
      notificationEmailSent = Boolean(loginNotice.sent);
      finalUser = loginNotice.user || createdUser;
    }

    res.status(201).json({ user: finalUser, storageMode, notificationEmailSent });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    if (!username || !email || !password) {
      res.status(400).json({ error: "Username, email and password are required." });
      return;
    }

    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      res.status(409).json({ error: "An account with that email already exists." });
      return;
    }

    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      res.status(409).json({ error: "That username is already taken." });
      return;
    }

    const createdUser = await upsertUser({
      username,
      email,
      password,
      favorites: ["Chicken", "Rice", "Tomato"]
    });

    const firebaseBootstrap = await bootstrapFirebaseAccount(createdUser);
    const signupNotice = await sendSignupNotification(createdUser);
    res.status(201).json({
      user: signupNotice.user || createdUser,
      storageMode,
      notificationEmailSent: Boolean(signupNotice.sent),
      firebaseBootstrap: {
        ok: Boolean(firebaseBootstrap.ok),
        created: Boolean(firebaseBootstrap.created),
        reason: firebaseBootstrap.reason || ""
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/google-demo", async (req, res) => {
  try {
    const { username, email, password } = req.body || {};
    const googleEmail = normalizeTerm(email || "alex.google@pantrypal.demo");
    let user = await findUserByEmail(googleEmail);

    if (!user) {
      user = await upsertUser({
        username: username || "Alex Google",
        email: googleEmail,
        password: password || "GoogleAuth",
        favorites: ["Chicken", "Pasta", "Tomato", "Garlic"]
      });
    }

    res.json({ user, storageMode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/auth/google-select", async (req, res) => {
  try {
    const { email } = req.body || {};
    if (!email) {
      res.status(400).json({ error: "Email is required." });
      return;
    }

    const user = await findUserByEmail(email);
    if (!user) {
      res.status(404).json({ error: "Google account not found." });
      return;
    }

    res.json({ user, storageMode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/users/:email", async (req, res) => {
  try {
    const user = await findUserByEmail(req.params.email);
    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.json({ user, storageMode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/users/:email", async (req, res) => {
  try {
    const existingUser = await findUserByEmail(req.params.email);
    if (!existingUser) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const incomingUser = createDefaultUser(req.body?.user || {});
    incomingUser.email = existingUser.email;
    incomingUser.password = incomingUser.password || existingUser.password;

    const conflictingUsername = await findUserByUsername(incomingUser.username, existingUser.email);
    if (conflictingUsername) {
      res.status(409).json({ error: "That username is already taken." });
      return;
    }

    const updatedUser = await upsertUser({
      ...existingUser,
      ...incomingUser
    });

    res.json({ user: updatedUser, storageMode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/users/:email/deactivate", async (req, res) => {
  try {
    const existingUser = await findUserByEmail(req.params.email);
    if (!existingUser) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    const deactivatedUser = await upsertUser({
      ...existingUser,
      accountStatus: "deactivated",
      deactivatedAt: new Date().toISOString()
    });

    await sendEmail({
      to: deactivatedUser.email,
      subject: "PantryPal account deactivated",
      text: `Hi ${deactivatedUser.username}, your PantryPal account has been deactivated. You will not be able to sign in again until the account is reactivated.`,
      html: `<p>Hi ${deactivatedUser.username},</p><p>Your PantryPal account has been <strong>deactivated</strong>.</p><p>You will not be able to sign in again until the account is reactivated.</p>`
    });

    res.json({ ok: true, user: deactivatedUser, storageMode });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/users/:email", async (req, res) => {
  try {
    const existingUser = await findUserByEmail(req.params.email);
    if (!existingUser) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    await sendEmail({
      to: existingUser.email,
      subject: "PantryPal account deleted",
      text: `Hi ${existingUser.username}, your PantryPal account has been deleted from PantryPal.`,
      html: `<p>Hi ${existingUser.username},</p><p>Your PantryPal account has been <strong>deleted</strong> from PantryPal.</p>`
    });

    await deleteUserByEmail(existingUser.email);
    res.json({ ok: true, deleted: true, email: existingUser.email });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/create-checkout-session", async (req, res) => {
  try {
    if (!stripe || !STRIPE_PUBLISHABLE_KEY) {
      res.status(503).json({ error: "Stripe is not configured." });
      return;
    }

    const { plan, customerEmail } = req.body || {};
    if (!plan?.name) {
      res.status(400).json({ error: "Plan details are required." });
      return;
    }

    if (!customerEmail) {
      res.status(400).json({ error: "Customer email is required." });
      return;
    }

    const origin = getCanonicalAppOrigin(req);
    const isWeekly = String(plan.name).toLowerCase().includes("weekly");
    const configuredPriceId = isWeekly ? STRIPE_WEEKLY_PRICE_ID : STRIPE_30DAY_PRICE_ID;

    if (!configuredPriceId) {
      res.status(503).json({ error: "Stripe price IDs are not configured for this environment." });
      return;
    }

    const lineItems = [{ price: configuredPriceId, quantity: 1 }];

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: lineItems,
      customer_email: customerEmail,
      success_url: `${origin}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?checkout=cancelled`,
      metadata: {
        plan_name: plan.name,
        customer_email: normalizeTerm(customerEmail)
      }
    });

    res.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("/api/stripe/session-status", async (req, res) => {
  try {
    if (!stripe) {
      res.status(503).json({ error: "Stripe is not configured." });
      return;
    }

    const sessionId = String(req.query.session_id || "").trim();
    if (!sessionId) {
      res.status(400).json({ error: "session_id is required." });
      return;
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["subscription"]
    });

    const customerEmail = normalizeTerm(
      session.customer_details?.email ||
      session.customer_email ||
      session.metadata?.customer_email ||
      ""
    );

    if (!customerEmail) {
      res.status(404).json({ error: "No customer email was attached to this checkout session." });
      return;
    }

    const existingUser = await findUserByEmail(customerEmail);
    if (!existingUser) {
      res.status(404).json({ error: "No PantryPal user matched this Stripe checkout." });
      return;
    }

    const paymentComplete =
      session.payment_status === "paid" ||
      session.status === "complete" ||
      session.subscription?.status === "active" ||
      session.subscription?.status === "trialing";

    if (!paymentComplete) {
      res.status(409).json({ error: "Checkout has not finished yet." });
      return;
    }

    const planName = session.metadata?.plan_name || existingUser.subscription?.plan || "Premium Plan";
    const subscriptionData = session.subscription || null;
    const updatedUser = await applySubscriptionToUser(customerEmail, {
      plan: planName,
      status: "active",
      startedAt: new Date().toISOString(),
      endsAt: getStripePeriodEnd(subscriptionData, planName),
      stripeCustomerId: session.customer ? String(session.customer) : "",
      stripeSubscriptionId: subscriptionData?.id ? String(subscriptionData.id) : "",
      stripeCheckoutSessionId: session.id,
      cancelledAt: null,
      endedEmailSentAt: "",
      lastReminderSentAt: ""
    });

    await notifySubscriptionStarted(updatedUser);
    const refreshedUser = await findUserByEmail(customerEmail);

    res.json({
      ok: true,
      user: refreshedUser,
      session: {
        id: session.id,
        payment_status: session.payment_status,
        status: session.status
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/subscription/cancel", async (req, res) => {
  try {
    const email = normalizeTerm(req.body?.email || "");
    if (!email) {
      res.status(400).json({ error: "Email is required." });
      return;
    }

    const user = await applySubscriptionToUser(email, {
      plan: "Free Plan",
      status: "inactive",
      cancelledAt: new Date().toISOString(),
      endsAt: null,
      stripeSubscriptionId: "",
      stripeCheckoutSessionId: ""
    });

    await sendEmail({
      to: user.email,
      subject: "PantryPal subscription cancelled",
      text: `Hi ${user.username}, your PantryPal subscription has been cancelled and your account is now on the Free Plan.`,
      html: `<p>Hi ${user.username},</p><p>Your PantryPal subscription has been cancelled and your account is now on the <strong>Free Plan</strong>.</p>`
    });

    res.json({ ok: true, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get("*", (_req, res) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.sendFile(path.join(__dirname, "index.html"));
});

async function start() {
  if (SUPABASE_URL && SUPABASE_KEY) {
    try {
      supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
        auth: { persistSession: false }
      });
      storageMode = "supabase";
      await seedUsers();
    } catch (error) {
      storageMode = "file";
      console.warn("Supabase unavailable, falling back to local file storage:", error.message);
      await ensureFileStore();
      await seedUsers();
    }
  } else {
    storageMode = "file";
    await ensureFileStore();
    await seedUsers();
  }

  app.listen(PORT, HOST, () => {
    console.log(`PantryPal server running at http://${HOST}:${PORT}`);
    console.log(`Storage mode: ${storageMode}`);
    console.log(`Users table: ${SUPABASE_USERS_TABLE}`);
  });

  if (!subscriptionNotificationTimer) {
    runSubscriptionNotifications().catch(() => {});
    subscriptionNotificationTimer = setInterval(() => {
      runSubscriptionNotifications().catch(() => {});
    }, 6 * 60 * 60 * 1000);
  }
}

start().catch((error) => {
  console.error("Failed to start PantryPal backend:", error);
  process.exit(1);
});