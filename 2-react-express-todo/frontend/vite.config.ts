import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/todos": "http://backend:3000",
    }
  },
  preview: {
    allowedHosts: ["etodo.grevelops.co"],
    host: "0.0.0.0", // ensure preview binds to all interfaces
    port: 4173       // optional, make it explicit
  }
});
