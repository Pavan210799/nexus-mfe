import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: "host",
      remotes: {
        auth: process.env.MF_AUTH || "http://localhost:5001/assets/remoteEntry.js",
        dashboard: process.env.MF_DASHBOARD || "http://localhost:5002/assets/remoteEntry.js",
        users: process.env.MF_USERS || "http://localhost:5003/assets/remoteEntry.js",
        analytics: process.env.MF_ANALYTICS || "http://localhost:5004/assets/remoteEntry.js",
        notifications: process.env.MF_NOTIFICATIONS || "http://localhost:5005/assets/remoteEntry.js"
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.3.1"
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.3.1"
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: "^6.28.0"
        }
      }
    })
  ],
  resolve: {
    alias: {
      "@shared": path.resolve(dir, "../shared")
    }
  },
  server: {
    port: 5000,
    strictPort: true,
    cors: true,
    fs: {
      allow: [".."]
    }
  },
  build: {
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
    modulePreload: false
  }
});
