import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base: process.env.MF_BASE || "http://localhost:5005/",
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "notifications",
      filename: "remoteEntry.js",
      exposes: {
        "./NotificationsApp": "./src/NotificationsApp.jsx"
      },
      shared: {
        react: { singleton: true, requiredVersion: "^18.3.1" },
        "react-dom": { singleton: true, requiredVersion: "^18.3.1" },
        "react-router-dom": { singleton: true, requiredVersion: "^6.28.0" }
      }
    })
  ],
  resolve: {
    alias: { "@shared": path.resolve(dir, "../shared") }
  },
  server: {
    port: 5005,
    strictPort: true,
    cors: true,
    fs: { allow: [".."] }
  },
  preview: {
    port: 5005,
    strictPort: true,
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
  build: { target: "esnext", minify: false, cssCodeSplit: false, modulePreload: false }
});
