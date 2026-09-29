# Graph Report - pagina de autos  (2026-09-29)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 134 nodes · 179 edges · 9 communities
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7eb0dfa4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- render-cinematic.cjs
- DealershipScene.jsx
- react
- package.json
- export-sky.mjs
- dependencies
- Landing institucional Colorosso Automotores
- vercel.json

## God Nodes (most connected - your core abstractions)
1. `react` - 11 edges
2. `Cinemática de Colorosso v4` - 7 edges
3. `Landing institucional Colorosso Automotores` - 7 edges
4. `DealershipVideo.jsx: video y sincronización del scroll` - 6 edges
5. `Fuentes de render exclusivamente locales` - 6 edges
6. `readFacadeDiagnostics()` - 5 edges
7. `cinematicAsset()` - 4 edges
8. `useScrollReveal()` - 4 edges
9. `scripts` - 4 edges
10. `public/cinematic/rendered/manifest.json: exportación completada` - 4 edges

## Surprising Connections (you probably didn't know these)
- `Bienvenida, historia, contacto y pie de página` --documents--> `dealership.css: composición abierta, responsive y animaciones`  [EXTRACTED]
  README.md → src/styles/pages/dealership.css
- `Cielo HDR: nubes bajas, sombras grises y textos claros` --documents--> `dealership.css: composición abierta, responsive y animaciones`  [EXTRACTED]
  README.md → src/styles/pages/dealership.css
- `DealershipScene()` --indirect_call--> `readFacadeDiagnostics()`  [INFERRED]
  src/components/landing3d/DealershipScene.jsx → src/components/landing3d/facadeDiagnostics.js
- `CinematicEffects()` --calls--> `readFacadeDiagnostics()`  [EXTRACTED]
  src/components/landing3d/CinematicEffects.jsx → src/components/landing3d/facadeDiagnostics.js
- `DealershipIntro()` --calls--> `cinematicAsset()`  [EXTRACTED]
  src/components/landing3d/DealershipIntro.jsx → src/components/landing3d/DealershipVideo.jsx

## Import Cycles
- None detected.

## Communities (9 total, 0 thin omitted)

### Community 0 - "render-cinematic.cjs"
Cohesion: 0.07
Nodes (29): assets/3d/colorosso-facade-v4.blend: único Blender autocontenido conservado, Limpieza autorizada finalizada, public/cinematic/rendered/desktop.mp4: 1920×1080, 24 s, 60 fps, ~18,6 MB, Cinemática de Colorosso v4, Microsoft Edge, Codificación H.264 para scroll, Portada estática con movimiento reducido o error, .tools/ffmpeg.exe (+21 more)

### Community 1 - "DealershipScene.jsx"
Cohesion: 0.13
Nodes (15): assets/render-source/terrazzo.jpg, assets/render-source/colorosso-facade-v4.glb, assets/render-source/colorosso-morning.hdr, cinematic-render.html, Fuentes de render exclusivamente locales, .vercelignore: excluye assets del envío CLI, Vite: servidor local 127.0.0.1:5190 iniciado y cerrado por exportador cuando hace falta, @react-three/fiber (+7 more)

### Community 2 - "react"
Cohesion: 0.20
Nodes (12): Documento HTML Colorosso Automotores, Contenedor DOM root, react, App(), chapters, DealershipIntro(), cinematicAsset(), DealershipVideo() (+4 more)

### Community 3 - "package.json"
Cohesion: 0.11
Nodes (15): devDependencies, vite, name, private, scripts, build, dev, preview (+7 more)

### Community 4 - "export-sky.mjs"
Cohesion: 0.16
Nodes (12): chunk(), crc32(), displayColor(), fov, hdr, header, input, multiply() (+4 more)

### Community 5 - "dependencies"
Cohesion: 0.33
Nodes (6): dependencies, react, react-dom, @react-three/drei, @react-three/fiber, three

### Community 6 - "Landing institucional Colorosso Automotores"
Cohesion: 0.29
Nodes (8): Landing institucional Colorosso Automotores, Publicación Vite en Vercel, Bienvenida, historia, contacto y pie de página, Fotografía real y fotografía histórica pendiente, Alcance del mapa: código y documentación técnica, Lectura progresiva y movimiento reducido, Cielo HDR: nubes bajas, sombras grises y textos claros, dealership.css: composición abierta, responsive y animaciones

### Community 8 - "vercel.json"
Cohesion: 0.33
Nodes (5): buildCommand, framework, installCommand, outputDirectory, $schema

## Knowledge Gaps
- **54 isolated node(s):** `{ chromium }`, `crypto`, `fs`, `hash`, `output` (+49 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 73 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `DealershipScene.jsx`, `package.json`?**
  _High betweenness centrality (0.427) - this node is a cross-community bridge._
- **Why does `cinematic-render.html` connect `DealershipScene.jsx` to `render-cinematic.cjs`?**
  _High betweenness centrality (0.235) - this node is a cross-community bridge._
- **Why does `three` connect `package.json` to `DealershipScene.jsx`, `export-sky.mjs`?**
  _High betweenness centrality (0.192) - this node is a cross-community bridge._
- **What connects `{ chromium }`, `crypto`, `fs` to the rest of the system?**
  _54 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `render-cinematic.cjs` be split into smaller, more focused modules?**
  _Cohesion score 0.07386363636363637 - nodes in this community are weakly interconnected._
- **Should `DealershipScene.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12681159420289856 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._