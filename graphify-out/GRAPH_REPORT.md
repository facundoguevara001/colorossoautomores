# Graph Report - pagina de autos  (2026-09-28)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 159 nodes · 214 edges · 10 communities (8 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- render-cinematic.cjs
- DealershipScene.jsx
- react
- package.json
- Colorosso Automotores
- generateProducts.cjs
- DealershipIntro.jsx
- vercel.json
- vite.config.js

## God Nodes (most connected - your core abstractions)
1. `react` - 14 edges
2. `Colorosso Automotores` - 14 edges
3. `Cinemática de Colorosso v4` - 7 edges
4. `DealershipVideo.jsx: video y sincronización del scroll` - 6 edges
5. `Fuentes de render exclusivamente locales` - 6 edges
6. `readFacadeDiagnostics()` - 5 edges
7. `scripts` - 5 edges
8. `WhatsappCTA()` - 4 edges
9. `cinematicAsset()` - 4 edges
10. `public/cinematic/rendered/manifest.json: exportación completada` - 4 edges

## Surprising Connections (you probably didn't know these)
- `DealershipScene()` --indirect_call--> `readFacadeDiagnostics()`  [INFERRED]
  src/components/landing3d/DealershipScene.jsx → src/components/landing3d/facadeDiagnostics.js
- `CinematicEffects()` --calls--> `readFacadeDiagnostics()`  [EXTRACTED]
  src/components/landing3d/CinematicEffects.jsx → src/components/landing3d/facadeDiagnostics.js
- `WhatsappCTA()` --calls--> `useInquiry()`  [EXTRACTED]
  src/components/catalog/WhatsappCTA.jsx → src/context/InquiryContext.jsx
- `DealershipIntro()` --calls--> `cinematicAsset()`  [EXTRACTED]
  src/components/landing3d/DealershipIntro.jsx → src/components/landing3d/DealershipVideo.jsx

## Import Cycles
- None detected.

## Communities (10 total, 1 thin omitted)

### Community 0 - "render-cinematic.cjs"
Cohesion: 0.08
Nodes (29): assets/3d/colorosso-facade-v4.blend: único Blender autocontenido conservado, Limpieza autorizada finalizada, public/cinematic/rendered/desktop.mp4: 1920×1080, 24 s, 60 fps, ~18,6 MB, Cinemática de Colorosso v4, Microsoft Edge, Codificación H.264 para scroll, Portada estática con movimiento reducido o error, .tools/ffmpeg.exe (+21 more)

### Community 1 - "DealershipScene.jsx"
Cohesion: 0.13
Nodes (15): assets/render-source/terrazzo.jpg, assets/render-source/colorosso-facade-v4.glb, assets/render-source/colorosso-morning.hdr, cinematic-render.html, Fuentes de render exclusivamente locales, .vercelignore: excluye assets del envío CLI, Vite: servidor local 127.0.0.1:5190 iniciado y cerrado por exportador cuando hace falta, @react-three/fiber (+7 more)

### Community 2 - "react"
Cohesion: 0.17
Nodes (14): Documento HTML Colorosso Automotores, Contenedor DOM root, react, App(), ProductCard(), ProductGrid(), WhatsappCTA(), Layout() (+6 more)

### Community 3 - "package.json"
Cohesion: 0.09
Nodes (21): dependencies, react, react-dom, @react-three/drei, @react-three/fiber, three, devDependencies, vite (+13 more)

### Community 4 - "Colorosso Automotores"
Cohesion: 0.11
Nodes (18): assets/3d/colorosso-facade-v4.blend: único proyecto con texturas incorporadas, public/catalogo.xlsx, Catálogo, Colorosso Automotores, Compilación y publicación, vercel.json: Vite, npm ci, npm run build, dist, Configuración de publicación, Desarrollo (+10 more)

### Community 5 - "generateProducts.cjs"
Cohesion: 0.18
Nodes (13): xlsx, book, families, fs, key(), output, path, required (+5 more)

### Community 7 - "DealershipIntro.jsx"
Cohesion: 0.60
Nodes (4): chapters, DealershipIntro(), cinematicAsset(), DealershipVideo()

### Community 8 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, installCommand, outputDirectory, $schema

## Knowledge Gaps
- **67 isolated node(s):** `{ chromium }`, `crypto`, `fs`, `hash`, `output` (+62 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 87 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `DealershipScene.jsx`, `package.json`, `DealershipIntro.jsx`?**
  _High betweenness centrality (0.540) - this node is a cross-community bridge._
- **Why does `cinematic-render.html` connect `DealershipScene.jsx` to `render-cinematic.cjs`?**
  _High betweenness centrality (0.366) - this node is a cross-community bridge._
- **Why does `Cinemática de Colorosso v4` connect `render-cinematic.cjs` to `Colorosso Automotores`?**
  _High betweenness centrality (0.269) - this node is a cross-community bridge._
- **What connects `{ chromium }`, `crypto`, `fs` to the rest of the system?**
  _67 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `render-cinematic.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.07661290322580645 - nodes in this community are weakly interconnected._
- **Should `DealershipScene.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12681159420289856 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._