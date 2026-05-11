const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const root = __dirname;
const serverPath = path.join(root, "server.js");
const indexPath = path.join(root, "index.html");
const stylesPath = path.join(root, "styles.css");
const hotfixPath = path.join(root, "render-hotfix.js");
const assetVersion = "20260506final";
const deployBucket = "pantrypal-deploy-assets";

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

function syncDeployAssets() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return false;
  }

  const syncScript = String.raw`
const fs = require("fs");
const path = require("path");
const root = process.cwd();
const base = process.env.SUPABASE_URL.replace(/\/+$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.PANTRYPAL_DEPLOY_BUCKET || "pantrypal-deploy-assets";
const files = [
  ["index.html", "index.html"],
  ["styles.css", "styles.css"],
  ["script.js", "script.js"],
  ["server.js", "server-source.js"],
  ["server.js", "server.js"]
];
async function download(remote, local) {
  const url = `${base}/storage/v1/object/${bucket}/${remote}?v=${Date.now()}`;
  const response = await fetch(url, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Cache-Control": "no-cache"
    }
  });
  if (!response.ok) {
    throw new Error(`deploy asset ${remote} failed with ${response.status}`);
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  const target = path.join(root, local);
  const temp = `${target}.tmp`;
  fs.writeFileSync(temp, buffer);
  fs.renameSync(temp, target);
  console.log(`PantryPal deploy asset synced: ${local} (${buffer.length})`);
}
(async () => {
  for (const [remote, local] of files) {
    await download(remote, local);
  }
})().catch((error) => {
  console.error("PantryPal deploy asset sync failed:", error.message);
  process.exit(1);
});
`;

  try {
    execFileSync(process.execPath, ["-e", syncScript], {
      cwd: root,
      env: { ...process.env, PANTRYPAL_DEPLOY_BUCKET: deployBucket },
      stdio: "inherit"
    });
    return true;
  } catch (error) {
    console.error("PantryPal deploy asset sync skipped:", error.message);
    return false;
  }
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

function disableLegacyHotfix() {
  if (!fs.existsSync(hotfixPath)) return false;
  fs.writeFileSync(
    hotfixPath,
    'console.log("PantryPal render-hotfix: skipped because exact deploy assets were synced.\");\n',
    "utf8"
  );
  return true;
}

try {
  const assetsSynced = syncDeployAssets();
  const refreshedAssets = forceAssetRefresh();
  const contrastPatched = patchQuickActionsContrast();
  const hotfixDisabled = assetsSynced ? disableLegacyHotfix() : false;

  if (!assetsSynced && fs.existsSync(serverPath)) {
    const server = fs.readFileSync(serverPath, "utf8");
    if (isWrapper(server)) {
      fs.writeFileSync(serverPath, wrapperSource, "utf8");
    }
  }

  console.log(
    `PantryPal render-patch: deploy assets ${assetsSynced ? "synced" : "not synced"}; asset refresh ${refreshedAssets ? "applied" : "already current"}; quick actions contrast ${contrastPatched ? "patched" : "already current"}; legacy hotfix ${hotfixDisabled ? "disabled" : "available"} (${assetVersion}).`
  );
} catch (error) {
  console.error("PantryPal render-patch failed:", error.message);
  process.exitCode = 1;
}

