import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: true, // Listen on all network interfaces
    port: 3000, // Specify your port
    strictPort: true, // Don't try other ports if 3000 is taken
  },
});
