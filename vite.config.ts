import { defineConfig } from "vite";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: Number(process.env.PORT ?? 3001),
    strictPort: true,
  },
  preview: {
    port: Number(process.env.PORT ?? 3001),
  },
  resolve: {
    tsconfigPaths: true,
  },
});
