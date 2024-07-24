import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    port: 5174,
    // proxy: {
    //   "/api": "http://localhost:3030", // Your backend server
    // },
  },
});
