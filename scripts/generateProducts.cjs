const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");
const input = process.argv[2] || path.join("public", "catalogo.xlsx");
const output = path.join("src", "data", "products.generated.js");
if (!fs.existsSync(input)) throw new Error(`No existe el catálogo: ${input}`);
const book = XLSX.readFile(input, { cellDates: false });
const sheet = book.Sheets[book.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
const text = (value) => String(value ?? "").trim();
const key = (value) => text(value).toUpperCase();
const required = ["CATEGORIA", "SUBCATEGORIA", "PRODUCTO", "NOMBRE FOTO", "ESTADO", "SLUG", "GRUPO", "VARIANTE"];
const slugs = new Set();
const variants = rows.filter((row) => key(row.ESTADO) === "ACTIVO").map((row, index) => {
  const missing = required.filter((field) => !text(row[field]));
  if (missing.length) throw new Error(`Fila ${index + 2}: faltan ${missing.join(", ")}`);
  const slug = text(row.SLUG);
  if (slugs.has(slug)) throw new Error(`SLUG duplicado: ${slug}`);
  slugs.add(slug);
  const photos = text(row.FOTOS).split("|").map(text).filter(Boolean);
  const mainPhoto = text(row["NOMBRE FOTO"]);
  return {
    id: text(row.ID) || slug,
    code: text(row.CODIGO), category: text(row.CATEGORIA), subcategory: text(row.SUBCATEGORIA),
    brand: text(row.MARCA), name: text(row.PRODUCTO), year: text(row["AÑO"]), mileage: text(row.KILOMETRAJE),
    slug, group: text(row.GRUPO), variant: text(row.VARIANTE), description: text(row.DESCRIPCION),
    features: text(row.CARACTERISTICAS).split(";").map(text).filter(Boolean), featured: key(row.DESTACADO) === "SI",
    image: `/products/${mainPhoto}`, images: [...new Set([mainPhoto, ...photos])].map((name) => `/products/${name}`)
  };
});
const families = Object.values(variants.reduce((acc, variant) => {
  const family = acc[variant.group] ||= { group: variant.group, name: variant.name, category: variant.category, subcategory: variant.subcategory, brand: variant.brand, image: variant.image, featured: false, variants: [] };
  family.variants.push(variant); family.featured ||= variant.featured; return acc;
}, {}));
fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `// Generado por scripts/generateProducts.cjs. No editar manualmente.\nexport const productVariants = ${JSON.stringify(variants, null, 2)};\nexport const products = ${JSON.stringify(families, null, 2)};\n`);
console.log(`Generadas ${variants.length} variantes y ${families.length} familias.`);
