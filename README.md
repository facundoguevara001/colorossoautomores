# Colorosso Automotores

Sitio de catálogo en React y Vite, con cinemática prerenderizada para escritorio y celular.

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

No subir `node_modules`, `dist`, `.tools`, entornos Python ni referencias privadas. `.gitignore` y `.vercelignore` excluyen esos archivos. Los videos terminados y las fotografías del catálogo en `public` sí forman parte del repositorio.

`assets/3d/colorosso-facade-v4.blend` es el único proyecto Blender conservado, con sus texturas incorporadas. `assets/render-source` contiene el GLB, HDR y piso para volver a renderizar. Esos recursos se conservan en GitHub pero no se copian al sitio publicado. La configuración de Vite los sirve únicamente en desarrollo.

La limpieza no ejecutó compilación, pruebas de recorrido ni controles, por pedido del usuario. Tampoco publica automáticamente en GitHub o Vercel.

## Catálogo

Editar `public/catalogo.xlsx` y regenerar los datos:

```powershell
npm run generate:catalog
```

La cinemática y su exportación están documentadas en [CINEMATICA.md](CINEMATICA.md). El mapa del proyecto está en `graphify-out/graph.html`.
