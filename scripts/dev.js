import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

const remotes = ["auth", "dashboard", "users", "analytics", "notifications"];

function run(command, cwd) {
  return spawn(command, {
    cwd: cwd,
    stdio: "inherit",
    shell: true
  });
}

function buildOne(name) {
  return new Promise(function (resolve, reject) {
    const child = run("npm run build", path.join(root, name));

    child.on("exit", function (code) {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(name + " build failed"));
      }
    });
  });
}

async function main() {
  for (let i = 0; i < remotes.length; i++) {
    await buildOne(remotes[i]);
  }

  for (let i = 0; i < remotes.length; i++) {
    run("npm run preview", path.join(root, remotes[i]));
  }

  run("npm run dev", path.join(root, "host"));
}

main();
