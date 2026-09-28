# Cinemática de Colorosso v4

## Web publicada

`DealershipIntro.jsx` presenta textos, capítulos y enlaces. `DealershipVideo.jsx` reproduce los videos y sincroniza el scroll; no importa la escena 3D.

Los archivos finales están en `public/cinematic/rendered`:

- `desktop.mp4`: 1920 × 1080, 24 segundos, 60 fps, aproximadamente 18,6 MB.
- `mobile.mp4`: 648 × 1152, 24 segundos, 60 fps, aproximadamente 9,2 MB.
- `desktop-poster.jpg` y `mobile-poster.jpg`: portadas estáticas.
- `manifest.json`: parámetros y firma de la exportación completada.

H.264, CRF 23, yuv420p, cuadros clave cada 12 cuadros, sin cuadros B, faststart; límites de tasa de 6 Mbps en escritorio y 3 Mbps en móvil. Los textos y botones son HTML, no están incrustados en el video. Con movimiento reducido o error queda la portada estática y el catálogo disponible.

## Único Blender conservado

`assets/3d/colorosso-facade-v4.blend` conserva la cinemática v4. Sus texturas están incorporadas y no depende de bibliotecas Blender externas. Abrir ese archivo directamente para editar.

Por pedido del usuario, se eliminaron todos los otros proyectos `.blend`, respaldos, bibliotecas de modelos, paquetes de texturas y generadores de etapas anteriores. Ya no existe la cadena de generación desde v1/v2/v3. El modelo es una recreación de referencias, no un relevamiento CAD.

## Fuentes para volver a renderizar

- `assets/render-source/colorosso-facade-v4.glb`: modelo final exportado.
- `assets/render-source/colorosso-morning.hdr`: iluminación.
- `assets/render-source/terrazzo.jpg`: textura del piso.
- `src/components/landing3d/DealershipScene.jsx`: cámara, luces y materiales finales de la escena web.
- `src/components/landing3d/CinematicEffects.jsx`: efectos y captura.
- `src/renderCinematic.jsx` y `cinematic-render.html`: entrada local de exportación.
- `scripts/render-cinematic.cjs`: exportador completo y reanudable.

Vite sirve las tres fuentes mediante rutas locales `/models`, `/textures` y `/cinematic/terrazzo.jpg`; están fuera de `public` y no se copian a `dist`. `.vercelignore` también excluye `assets` del envío con CLI. La web desplegada solo necesita los videos y pósteres terminados.

## Exportación local

```powershell
node scripts/render-cinematic.cjs
```

El exportador inicia un servidor Vite en `127.0.0.1:5190` cuando hace falta y lo cierra al terminar. No ejecuta build. Requiere Playwright en `.tools/node_modules/playwright`, Microsoft Edge y FFmpeg en `.tools/ffmpeg.exe`; esas herramientas locales no van a GitHub. En otra computadora se pueden instalar las dependencias de render con `npm install --prefix .tools --no-save playwright` y proporcionar FFmpeg. `CHROMIUM_PATH` y `FFMPEG_PATH` permiten elegir ejecutables.

Genera 1.440 PNG por variante en `.tools/cinematic-render/<variante>-<firma>` y luego los MP4. Repetir el comando retoma cuadros de la misma firma; `--mobile-only` limita la exportación al móvil cuando el horizontal de esa misma escena ya está terminado. No editar las fuentes durante la exportación. Cambios en Blender requieren exportar el GLB final antes de repetir el render.

Los PNG y MP4 intermedios del render terminado fueron eliminados durante la limpieza; pueden generarse nuevamente. Se conservaron las herramientas locales de exportación. Para sustituir los videos en una publicación futura, actualizar la revisión de recursos de `DealershipVideo.jsx`.

## Limpieza y verificación

Se retiraron `dist`, entornos Python sin uso, capturas, diagnósticos, scripts históricos y carpetas temporales. Se conservaron las fotografías y el archivo fuente del catálogo, el código web, el único Blender v4 y las fuentes del render.

Por pedido del usuario no se ejecutan `npm run build`, pruebas del recorrido ni pruebas de controles. El usuario realizará esas comprobaciones desde Visual Studio Code.

## Graphify

`graphify-out/graph.json`, `graph.html` y `GRAPH_REPORT.md` describen el código y la documentación vigentes. El alcance excluye `assets`, `public`, `dist`, dependencias, herramientas y referencias de `autos contexto`; los archivos binarios no se analizan como código.
