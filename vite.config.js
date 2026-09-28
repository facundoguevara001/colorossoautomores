import { defineConfig } from "vite";
import { createReadStream, statSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Editing assets are served only by the local renderer, never copied to dist.
const renderAssets = {
  "/models/colorosso-facade-v4.glb": ["colorosso-facade-v4.glb", "model/gltf-binary"],
  "/textures/colorosso-morning.hdr": ["colorosso-morning.hdr", "application/octet-stream"],
  "/cinematic/terrazzo.jpg": ["terrazzo.jpg", "image/jpeg"],
};

export default defineConfig({
  plugins: [{
    name: "local-cinematic-assets",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const asset = renderAssets[req.url?.split("?")[0]];
        if (!asset || !["GET", "HEAD"].includes(req.method)) return next();
        const file = fileURLToPath(new URL(`./assets/render-source/${asset[0]}`, import.meta.url));
        try {
          res.setHeader("Content-Type", asset[1]);
          res.setHeader("Content-Length", statSync(file).size);
          if (req.method === "HEAD") return res.end();
          createReadStream(file).on("error", () => res.destroy()).pipe(res);
        } catch { res.statusCode = 404; res.end(); }
      });
    },
  }],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/three/")) return "three";
          if (id.includes("node_modules/@react-three/")) return "scene-runtime";
        },
      },
    },
  },
});
