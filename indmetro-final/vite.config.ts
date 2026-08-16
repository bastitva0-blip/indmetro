import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: 5000,
    allowedHosts: true,
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["favicon.ico", "metroRoutes.geojson"],
      manifest: {
        id: "/",
        name: "IndMetro",
        short_name: "IndMetro",
        description: "India's unified metro guide — route planning, fares, live tracking for 21 cities",
        theme_color: "#DC2626",
        background_color: "#0f172a",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        lang: "en-IN",
        dir: "ltr",
        categories: ["travel", "navigation", "transportation"],
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/pwa-maskable-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        shortcuts: [
          {
            name: "Lucknow Metro",
            short_name: "Lucknow",
            description: "Open Lucknow Metro",
            url: "/lucknow",
            icons: [{ src: "/pwa-192x192.png", sizes: "192x192" }],
          },
          {
            name: "Kanpur Metro",
            short_name: "Kanpur",
            description: "Open Kanpur Metro",
            url: "/kanpur",
            icons: [{ src: "/pwa-192x192.png", sizes: "192x192" }],
          },
        ],
        prefer_related_applications: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      workbox: {
        skipWaiting: true,
        clientsClaim: true,
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2,geojson,json}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.tile\.openstreetmap\.org\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "osm-tiles",
              expiration: {
                maxEntries: 1000,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  assetsInclude: ["**/*.geojson"],
  build: {
    target: "esnext",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          ui: ["lucide-react", "@radix-ui/react-dialog", "@radix-ui/react-select", "vaul"],
          leaflet: ["leaflet"],
          data: ["./src/data/metroData.ts", "./src/data/timetable.ts"],
        },
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false,
    cssMinify: true,
    minify: "esbuild",
  },
}));
