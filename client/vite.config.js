import { defineConfig } from "vite";

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "https://n8n.artosvita.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/webhook-test"),
      },
    },
  },
});
console.log("VITE CONFIG LOADED");
