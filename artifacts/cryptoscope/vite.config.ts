import { VitePWA} from "vite-plugin-pwa";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
const rawPort = process.env.PORT || "5173";
const port = Number(rawPort);
const basePath = process.env.BASE_PATH || "/";
export default defineConfig({
  base: "/",
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      strategies: "generateSW",
      includeAssets: ["icon-192.png", "icon-512.png"],

      manifest: {
        name: "CryptoScope",
        short_name: "CryptoScope",
        description: "See the market clearly",
        theme_color: "#020617",
        background_color: "#020617",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          {
             src: "/icon-192.png",
             sizes: "192x192",
             type: "image/png",
          },
          {
             src: "/icon-512.png",
             sizes: "512x512",
             type: "image/png",
          },
          {
             src: "/icon-512.png",
             sizes: "512x512",
             type: "image/png",
             purpose: "maskable",
          },
        ],
      },

      workbox: {
        navigateFallback: "/index.html",
        runtimeCaching: [
          {
           urlPattern: ({ request }) => request.destination === "document",
           handler: "NetworkFirst",
           options: {
             cacheName: "pages",
           },
          },
        ],
      },
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
    outDir: "dist",
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
