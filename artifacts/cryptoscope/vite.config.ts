import { VitePWA} from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
const rawPort = process.env.PORT || "5173";
const port = Number(rawPort);
const basePath = process.env.BASE_PATH || "/";
export default defineConfig({
  base: basePath,
 plugins: [
  react(),
  tailwindcss(),
  VitePWA({
    registerType: "autoUpdate",
    manifest: {
      name: "CryptoScope",
      short_name: "CryptoScope",
      description: "See the market clearly",
      theme_color: "#020617",
      background_color: "#020617",
      display: "standalone",
      icons: [
        {
          src: "/images/logo.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/images/logo.png",
          sizes: "512x512",
          type: "image/png",
        },
        {
          src: "/icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose:"maskable"
        }
      ]
    }
  })
],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    sourcemap: false,
    chunkSizeWarningLimit:1000,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
