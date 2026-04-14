import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      "/admin": "http://127.0.0.1:8000",
      "/api": "http://127.0.0.1:8000",
    },
  },
  build: {
    outDir: "dist",
  },
  define: {
    // Make VITE_SARAH_API_URL available; falls back to "" (relative) if not set
    "import.meta.env.VITE_SARAH_API_URL": JSON.stringify(
      process.env.VITE_SARAH_API_URL || ""
    ),
  },
});
