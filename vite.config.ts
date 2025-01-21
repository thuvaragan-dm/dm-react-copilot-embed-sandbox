import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";
import cssExportPlugin from "vite-plugin-css-export"; // Import the plugin

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "./index.ts"),
      name: "react-copilot-embed-sandbox",
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
  plugins: [react(), dts(), cssExportPlugin()],
});
