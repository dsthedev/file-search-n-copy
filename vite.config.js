import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import os from "os";

export default defineConfig({
  plugins: [
    react(),
  ],
});
