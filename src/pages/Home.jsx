import React from "react";
import { products } from "../data/products.generated";
import ProductGrid from "../components/catalog/ProductGrid";
import WhatsappCTA from "../components/catalog/WhatsappCTA";
import DealershipIntro from "../components/landing3d/DealershipIntro";

export default function Home() {
  const featured = products.filter((item) => item.featured);
  const vehicles = featured.length ? featured : products.slice(0, 6);

  return <div className="landing-page">
    <DealershipIntro />
    <section className="landing-section landing-section--inventory" id="unidades">
      <div className="section-heading section-heading--wide"><p className="eyebrow">Unidades seleccionadas</p><h2>Vehículos para cada próximo paso.</h2><p>Una selección de usados y 0 km para conocer sin vueltas y consultar directo con nosotros.</p></div>
      <ProductGrid products={vehicles} />
    </section>
    <section className="landing-section landing-story" id="como-trabajamos">
      <div><p className="eyebrow">Atención real</p><h2>Elegís con tiempo. Nosotros te acompañamos.</h2></div>
      <ol className="landing-steps"><li><span>01</span> Contanos qué vehículo estás buscando.</li><li><span>02</span> Coordinamos una visita y respondemos tus dudas.</li><li><span>03</span> Evaluamos alternativas y permutas para avanzar.</li></ol>
    </section>
    <section className="landing-contact" id="contacto"><p className="eyebrow">Hablemos</p><h2>Encontrá una unidad que te cierre de verdad.</h2><p>Escribinos y coordinamos una visita en Huanguelén.</p><WhatsappCTA label="Hablar por WhatsApp" /></section>
  </div>;
}
