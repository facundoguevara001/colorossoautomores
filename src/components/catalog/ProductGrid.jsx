import React from "react";
import ProductCard from "./ProductCard";
export default function ProductGrid({ products }) { return products.length ? <section className="vehicle-grid" aria-label="Vehículos"><ul>{products.map((product) => <li key={product.group}><ProductCard product={product} /></li>)}</ul></section> : <p className="empty-state">No hay vehículos que coincidan con los filtros.</p>; }
