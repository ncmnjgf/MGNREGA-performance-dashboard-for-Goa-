import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@styles": path.resolve(__dirname, "./src/styles"),
    },
  },
  server: {
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
    open: false,
    cors: true,
    force: true,
    hmr: {
      port: 3001,
      host: "localhost",
    },
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  preview: {
    port: process.env.PORT || 3000,
    host: "0.0.0.0",
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          charts: ["chart.js", "react-chartjs-2"],
          utils: ["axios", "date-fns", "clsx"],
        },
      },
    },
  },
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "chart.js", "react-chartjs-2"],
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    "process.env.VITE_API_URL": JSON.stringify(process.env.VITE_API_URL || ""),
  },
});
