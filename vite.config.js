import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import os from "os";

export default defineConfig({
  plugins: [
    react(),
    {
      name: "bash-history-api",
      configureServer(server) {
        server.middlewares.use("/api/bash-history", (req, res) => {
          const historyPath = path.join(os.homedir(), ".bash_history");

          try {
            const data = fs.readFileSync(historyPath, "utf-8");
            res.setHeader("Content-Type", "text/plain");
            res.end(data);
          } catch (err) {
            res.statusCode = 500;
            res.end("Failed to read ~/.bash_history");
          }
        });
      },
    },
  ],
});
