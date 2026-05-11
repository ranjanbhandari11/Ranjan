const fs = require("fs");
const path = require("path");

const root = __dirname;
const serverPath = path.join(root, "server.js");
const indexPath = path.join(root, "index.html");
const stylesPath = path.join(root, "styles.css");
const hotfixPath = path.join(root, "render-hotfix.js");
const assetVersion = "20260506final";

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

function forceAssetRefresh() {
  if (!fs.existsSync(indexPath)) return false;

  const html = fs.readFileSync(indexPath, "utf8");
  const next = html
    .replace(/styles\.css\?v=[^"']+/g, `styles.css?v=${assetVersion}`)
    .replace(/script\.js\?v=[^"']+/g, `script.js?v=${assetVersion}`);

  if (next !== html) {
    fs.writeFileSync(indexPath, next, "utf8");
    return true;
  }

  return false;
}

function patchQuickActionsContrast() {
  if (!fs.existsSync(stylesPath)) return false;

  const marker = "PantryPal quick actions contrast patch 20260506final";
  const css = fs.readFileSync(stylesPath, "utf8");
  if (css.includes(marker)) return false;

  fs.writeFileSync(stylesPath, `${css}\n\n/* ${marker} */\n#dashboard .dashboard-insight-card .showcase-label { color: #1b7c3d !important; }\n#dashboard .dashboard-insight-card h3 { color: #101a12 !important; }\n#dashboard .dashboard-insight-card p { color: #53675a !important; }\n`, "utf8");
  return true;
}

function patchHotfixEmailTimeouts() {
  if (!fs.existsSync(hotfixPath)) return false;

  const marker = "PantryPal email timeout patch 20260506final";
  let hotfix = fs.readFileSync(hotfixPath, "utf8");
  if (hotfix.includes(marker)) return false;

  hotfix = hotfix.replace(
    'const patch = String.raw`',
    `const patch = String.raw` + "`" + `\n// ${marker}`
  );

  hotfix = hotfix
    .replace(
      'nodemailer.createTransport({ service: "gmail", auth: { user: SMTP_USER, pass: SMTP_PASS } })',
      'nodemailer.createTransport({ service: "gmail", connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000, auth: { user: SMTP_USER, pass: SMTP_PASS } })'
    )
    .replace(
      'nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, auth: { user: SMTP_USER, pass: SMTP_PASS } })',
      'nodemailer.createTransport({ host: "smtp.gmail.com", port: 465, secure: true, connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000, auth: { user: SMTP_USER, pass: SMTP_PASS } })'
    )
    .replace(
      'nodemailer.createTransport({ host: SMTP_HOST || "smtp.gmail.com", port: SMTP_PORT || 587, secure: Number(SMTP_PORT || 587) === 465, auth: { user: SMTP_USER, pass: SMTP_PASS } })',
      'nodemailer.createTransport({ host: SMTP_HOST || "smtp.gmail.com", port: SMTP_PORT || 587, secure: Number(SMTP_PORT || 587) === 465, connectionTimeout: 8000, greetingTimeout: 8000, socketTimeout: 12000, auth: { user: SMTP_USER, pass: SMTP_PASS } })'
    );

  fs.writeFileSync(hotfixPath, hotfix, "utf8");
  return true;
}

try {
  const refreshedAssets = forceAssetRefresh();
  const contrastPatched = patchQuickActionsContrast();
  const hotfixEmailPatched = patchHotfixEmailTimeouts();

  if (fs.existsSync(serverPath)) {
    const server = fs.readFileSync(serverPath, "utf8");
    if (isWrapper(server)) {
      fs.writeFileSync(serverPath, wrapperSource, "utf8");
    }
  }

  console.log(
    `PantryPal render-patch: asset refresh ${refreshedAssets ? "applied" : "already current"}; quick actions contrast ${contrastPatched ? "patched" : "already current"}; email timeout patch ${hotfixEmailPatched ? "applied" : "already current"} (${assetVersion}).`
  );
} catch (error) {
  console.error("PantryPal render-patch failed:", error.message);
  process.exitCode = 1;
}

