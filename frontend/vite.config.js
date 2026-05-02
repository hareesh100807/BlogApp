import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const spaFallbackPlugin = () => ({
  name: "spa-fallback-rewrite",
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      if (req.method !== "GET" || !req.url) {
        return next();
      }

      if (
        req.url.startsWith("/@") ||
        req.url.startsWith("/@vite") ||
        req.url.startsWith("/src/") ||
        req.url.startsWith("/node_modules/") ||
        req.url.startsWith("/assets/") ||
        req.url.startsWith("/favicon") ||
        req.url.startsWith("/api/") ||
        req.url.startsWith("/auth/") ||
        req.url.startsWith("/author-api/") ||
        req.url.startsWith("/user-api/") ||
        req.url.includes(".")
      ) {
        return next();
      }

      req.url = "/index.html";
      next();
    });
  },
})

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), spaFallbackPlugin()],
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:4060",
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
