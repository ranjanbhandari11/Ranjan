const fs = require("fs");
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
