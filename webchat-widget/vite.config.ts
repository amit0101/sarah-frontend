import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  server: {
    port: 5173,
    proxy: {
      "/ws": { target: "http://127.0.0.1:8000", ws: true },
      "/api": "http://127.0.0.1:8000",
    },
  },
  build: {
    // Library mode — produces a single IIFE JS bundle for embedding via <script> tag
    lib: {
      entry: "src/main.tsx",
      name: "SarahWebchat",
      fileName: "sarah-webchat",
      formats: ["iife"],
    },
    rollupOptions: {
      // Bundle everything — no externals for a self-contained embed
    },
    cssCodeSplit: false, // Inline CSS into the JS bundle
    outDir: "dist",
  },
});
