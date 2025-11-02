import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import * as path from "node:path";
// https://vite.dev/config/
export default defineConfig({
  base: "/ulas-sahin-horse-race/",
  plugins: [vue(), svgLoader()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
