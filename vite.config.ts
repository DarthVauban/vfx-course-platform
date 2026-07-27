import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    target: "es2022",
    sourcemap: false,
    // Mermaid's optional diagram engines are lazy-loaded and one is ~663 kB.
    // Initial app chunks stay below this threshold.
    chunkSizeWarningLimit: 700,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "course-data",
              test: /src[\\/]generated[\\/]course-manifest\.json$/,
              priority: 5,
            },
            {
              name: "markdown-reader",
              test:
                /node_modules[\\/](react-markdown|remark-gfm|rehype-|unified|micromark|mdast-util|hast-util|unist-util|highlight\.js|github-slugger)/,
              priority: 4,
            },
            {
              name: "react-vendor",
              test:
                /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
              priority: 3,
            },
            {
              name: "icons-search",
              test: /node_modules[\\/](lucide-react|minisearch)[\\/]/,
              priority: 2,
            },
          ],
        },
      },
    },
  },
  server: {
    port: 5173,
    strictPort: true,
  },
});
