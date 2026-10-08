import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import prerender from "./build/prerender.js";

export default defineConfig({
  plugins: [react(), prerender()],
  resolve: { alias: { "@shared": path.resolve(__dirname, "../shared") } },
  build: {
    target: "es2020",
    rollupOptions: {
      output: { manualChunks: (id) => (id.includes("node_modules/three") ? "three" : id.includes("node_modules/react") ? "react" : undefined) },
    },
  },
  server: {
    port: 5173,
    fs: { allow: [".."] },
    proxy: { "/api": "http://localhost:5000" },
  },
});
