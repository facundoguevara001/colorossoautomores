import React from "react";
import WhatsappCTA from "./WhatsappCTA";

export default function ProductCard({ product }) {
  const first = product.variants[0];
  return <article className="vehicle-card">
    <img className="vehicle-card__image" src={product.image} alt={product.name} width="640" height="440" loading="lazy" decoding="async" />
    <div className="vehicle-card__content">
      <p className="vehicle-card__eyebrow">{product.brand} · {product.subcategory}</p>
      <h3>{product.name}</h3>
      <p className="vehicle-card__availability">{[first.year, first.mileage].filter(Boolean).join(" / ") || "Consultá disponibilidad"}</p>
      <WhatsappCTA product={first} label="Consultar unidad ↗" />
    </div>
  </article>;
}
