import react from "@vitejs/plugin-react";
import postcssCustomMedia from "postcss-custom-media";
import { defineConfig } from "vite";
import webfontDownload from "vite-plugin-webfont-dl";

export default defineConfig({
  plugins: [react(), webfontDownload()],
  css: {
    postcss: {
      plugins: [postcssCustomMedia],
    },
  },
});
