import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import webfontDownload from "vite-plugin-webfont-dl";
import postcssCustomMedia from "postcss-custom-media";

export default defineConfig({
  plugins: [react(), webfontDownload()],
  css: {
    postcss: {
      plugins: [postcssCustomMedia],
    },
  },
});
