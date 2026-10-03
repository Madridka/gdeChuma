import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  base: "/",
  server: {
    host: true,
    cors: {
      preflightContinue: true,
    },
    port: 4040,
  },
});
