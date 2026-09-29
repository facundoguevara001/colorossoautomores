import React, { useRef } from "react";
import DealershipIntro from "../components/landing3d/DealershipIntro";
import useScrollReveal from "../hooks/useScrollReveal";

const welcome = "Somos Colorosso Automotores. Un lugar en Huanguelén donde cada encuentro empieza con una charla. Nos gusta conocerte, escuchar lo que buscás y acompañarte a encontrar el vehículo que va con vos.";
// Incorporar aquí la fotografía original cuando esté disponible.
const historyPhoto = null;
const whatsapp = `https://wa.me/5491125218692?text=${encodeURIComponent("Hola, quiero consultar por un vehículo.")}`;

export default function Home() {
  const content = useRef(null);
  useScrollReveal(content);
  return <div className="landing-page">
    <DealershipIntro />
    <div className="dealership-content" ref={content}>
      <section className="editorial-section welcome" id="bienvenida" aria-labelledby="welcome-title">
        <div className="welcome__heading">
          <div data-reveal>
            <p className="editorial-label">Huanguelén · Buenos Aires</p>
            <h2 id="welcome-title">Bienvenidos a<br />Colorosso<br />Automotores.</h2>
          </div>
          <p className="reading-copy" data-reading>
            <span className="visually-hidden">{welcome}</span>
            <span aria-hidden="true">{welcome.split(" ").map((word, index) => <React.Fragment key={index}><span className="reading-word">{word}</span>{" "}</React.Fragment>)}</span>
          </p>
        </div>
        <figure className="welcome__photo" data-reveal>
          <div className="photo-window"><img src="/images/concesionaria-actual.png" alt="Frente real de Colorosso Automotores, con su salón vidriado y acceso desde la calle" width="747" height="742" loading="lazy" decoding="async" /></div>
          <figcaption><span>Nuestra casa, tu próximo punto de partida.</span><span>Colorosso Automotores</span></figcaption>
        </figure>
      </section>
      <section className="editorial-section history" id="historia" aria-labelledby="history-title">
        <div className="history__copy">
          <div data-reveal>
            <p className="editorial-label">Nuestra historia</p>
            <h2 id="history-title">El tiempo pasa.<br />La cercanía queda.</h2>
            <p className="history__description">Nuestra trayectoria en Huanguelén se construye en el trato de todos los días. Con cada persona que se acerca, cada conversación y cada nuevo camino, seguimos dando forma a la historia de Colorosso Automotores.</p>
          </div>
          <div className="history__approach" id="como-trabajamos" data-reveal>
            <p className="editorial-label">Nuestra forma de trabajar</p>
            <p className="history__statement">Primero, escucharte.<br />Después, encontrar el camino.</p>
            <p>Te recibimos en la concesionaria para conversar sobre lo que necesitás, conocer tu vehículo si querés entregarlo en permuta y evaluar juntos las alternativas. Con tiempo para preguntar y decidir.</p>
          </div>
        </div>
        <figure className="history__photo" data-reveal>
          {historyPhoto ? <div className="photo-window"><img src={historyPhoto} alt="Colorosso Automotores en sus comienzos" loading="lazy" decoding="async" /></div> : <div className="history__placeholder" role="img" aria-label="Espacio reservado para la fotografía de los comienzos de la concesionaria"><span className="editorial-label">Archivo Colorosso</span><span className="history__placeholder-title">Nuestros<br />comienzos.</span><span className="history__placeholder-note">Próximamente, una imagen de nuestra historia.</span></div>}
          <figcaption>El lugar donde empezó nuestro camino.</figcaption>
        </figure>
      </section>
      <section className="editorial-section landing-contact" id="contacto" aria-labelledby="contact-title">
        <div data-reveal>
          <p className="editorial-label">Hablemos</p>
          <h2 id="contact-title">Encontrá una unidad<br />que te cierre de verdad.</h2>
          <div className="landing-contact__bottom"><p>Escribinos y coordinamos una visita en Huanguelén.</p><a className="contact-link" href={whatsapp} target="_blank" rel="noreferrer">Hablar por WhatsApp <span aria-hidden="true">↗</span></a></div>
        </div>
      </section>
    </div>
  </div>;
}
