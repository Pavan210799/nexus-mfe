import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const site = path.join(root, "site");

const remotes = [
  { name: "auth", folder: "auth" },
  { name: "dashboard", folder: "dashboard" },
  { name: "users", folder: "users" },
  { name: "analytics", folder: "analytics" },
  { name: "notifications", folder: "notifications" }
];

function run(command, cwd, extraEnv) {
  return new Promise(function (resolve, reject) {
    const child = spawn(command, {
      cwd: cwd,
      stdio: "inherit",
      shell: true,
      env: Object.assign({}, process.env, extraEnv || {})
    });

    child.on("exit", function (code) {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(command + " failed in " + cwd));
      }
    });
  });
}

function copyDir(from, to) {
  fs.cpSync(from, to, { recursive: true });
}

async function main() {
  const netlifyMeta = path.join(site, ".netlify");
  const netlifyBackup = path.join(root, ".netlify-link-backup");

  if (fs.existsSync(netlifyMeta)) {
    fs.cpSync(netlifyMeta, netlifyBackup, { recursive: true });
  }

  if (fs.existsSync(site)) {
    fs.rmSync(site, { recursive: true, force: true });
  }

  fs.mkdirSync(site);

  if (fs.existsSync(netlifyBackup)) {
    fs.cpSync(netlifyBackup, netlifyMeta, { recursive: true });
    fs.rmSync(netlifyBackup, { recursive: true, force: true });
  }

  for (let i = 0; i < remotes.length; i++) {
    const remote = remotes[i];
    const appPath = path.join(root, remote.name);
    await run("npm run build", appPath, {
      MF_BASE: "/" + remote.folder + "/"
    });
    copyDir(
      path.join(appPath, "dist", "assets"),
      path.join(site, remote.folder, "assets")
    );
  }

  await run("npm run build", path.join(root, "host"), {
    MF_AUTH: "/auth/assets/remoteEntry.js",
    MF_DASHBOARD: "/dashboard/assets/remoteEntry.js",
    MF_USERS: "/users/assets/remoteEntry.js",
    MF_ANALYTICS: "/analytics/assets/remoteEntry.js",
    MF_NOTIFICATIONS: "/notifications/assets/remoteEntry.js"
  });

  copyDir(path.join(root, "host", "dist"), site);

  fs.writeFileSync(
    path.join(site, "_redirects"),
    [
      "/auth               /index.html   200!",
      "/auth/              /index.html   200!",
      "/dashboard          /index.html   200!",
      "/dashboard/         /index.html   200!",
      "/users              /index.html   200!",
      "/users/             /index.html   200!",
      "/analytics          /index.html   200!",
      "/analytics/         /index.html   200!",
      "/notifications      /index.html   200!",
      "/notifications/     /index.html   200!",
      "/*                  /index.html   200",
      ""
    ].join("\n")
  );

  console.log("Option B site is ready in /site");
}

main();
