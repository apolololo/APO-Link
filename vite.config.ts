import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ mode }) => ({
  root: "./client", // Le dossier client est la racine du projet Vite
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
    },
  },
  base: process.env.NODE_ENV === 'production' || mode === 'production' ? "/APO-Link/" : "/", // GitHub Pages en prod, "/" en dev
  server: {
    host: true,
    port: 5000
  },
  build: {
    outDir: "../dist",
  }
}));