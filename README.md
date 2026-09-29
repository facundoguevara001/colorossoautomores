# Colorosso Automotores

Landing institucional en React y Vite, con cinemática prerenderizada para escritorio y celular.

## Desarrollo

```powershell
npm ci
npm run dev
```

## Compilación y publicación

```powershell
npm run build
```

Vercel está configurado en `vercel.json`: framework Vite, instalación `npm ci`, compilación `npm run build` y salida `dist`. Importar la rama limpia del repositorio GitHub desde Vercel y dejar la raíz del proyecto en `.`. No se requieren variables de entorno para la configuración actual.

No subir `node_modules`, `dist`, `.tools`, entornos Python ni referencias privadas. `.gitignore` y `.vercelignore` excluyen esos archivos. Los videos terminados y la fotografía de la concesionaria en `public` sí forman parte del repositorio.

`assets/3d/colorosso-facade-v4.blend` es el único proyecto Blender conservado, con sus texturas incorporadas. `assets/render-source` contiene el GLB, HDR y piso para volver a renderizar. Esos recursos se conservan en GitHub pero no se copian al sitio publicado. La configuración de Vite los sirve únicamente en desarrollo.

La limpieza no ejecutó compilación, pruebas de recorrido ni controles, por pedido del usuario. Tampoco publica automáticamente en GitHub o Vercel.

## Contenido de la landing

Después de la cinemática: bienvenida, fotografía real de la concesionaria, historia y forma de trabajo, contacto por WhatsApp y pie de página. La navegación usa `#bienvenida`, `#historia` y `#contacto`.

Los textos están en `src/pages/Home.jsx` y el diseño en `src/styles/pages/dealership.css`. `src/hooks/useScrollReveal.js` revela las palabras de bienvenida según el scroll y desplaza suavemente textos e imágenes. Respeta movimiento reducido y libera listeners al desmontarse.

La foto actual se copió de las referencias locales a `public/images/concesionaria-actual.png`; es una captura existente del frente real. Para reemplazarla por una fotografía de mayor resolución, actualizar ese recurso y sus dimensiones en Home.

La fotografía histórica todavía no fue suministrada. El bloque derecho muestra una reserva tipográfica explícita; para incorporar la foto, guardarla en `public/images/` y asignar su ruta pública a `historyPhoto` en Home. No se atribuye ninguna fecha ni cantidad de años sin confirmación.

Se retiraron el catálogo, las consultas por vehículo, el Excel, su generador, sus imágenes y la dependencia xlsx. No se ejecutaron compilaciones ni pruebas de contenido o botones durante esta modificación, por pedido del usuario.

## Mapa Graphify

Se mantiene el alcance de código, configuración y documentación técnica definido en `.graphifyignore`. Las referencias privadas, imágenes, modelos y videos se omiten del análisis; CSS se documenta a nivel de archivo cuando el extractor no lo procesa. El mapa no constituye una prueba de ejecución de la web.

La cinemática y su exportación están documentadas en [CINEMATICA.md](CINEMATICA.md). El mapa del proyecto está en `graphify-out/graph.html`.

## Fondo de cielo

La landing y el pie comparten el cielo de `assets/render-source/colorosso-morning.hdr`, exportado a `public/images/colorosso-morning-sky.png`. `node scripts/export-sky.mjs` repite la conversión determinista: proyección de la franja baja de nubes (elevación 19°, azimut −0,4 rad, campo vertical 32°) y mapeo tonal ACES a sRGB, con exposición 1,05 e intensidad 0,85. El HDR original no se modifica. El navegador carga solamente el PNG de fondo, con sombras y saturación reducida definidas en `src/styles/pages/dealership.css`, siguiendo el cielo gris de la cinemática. Se retiró el velo blanco anterior y los textos son claros para acompañar el fondo oscuro. No requiere WebGL adicional ni una compilación de la web para exportarlo.
