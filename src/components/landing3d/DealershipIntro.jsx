import React, { useCallback, useEffect, useRef, useState } from "react";
import DealershipVideo, { cinematicAsset } from "./DealershipVideo";

const chapters = [{ label: "La fachada", progress: 0 }, { label: "El acceso", progress: 0.52 }, { label: "El salón", progress: 1 }];

export default function DealershipIntro() {
  const section = useRef(null);
  const progress = useRef(0);
  const active = useRef(true);
  const [chapter, setChapter] = useState(0);
  const [openingVisible, setOpeningVisible] = useState(true);
  const [arrivalVisible, setArrivalVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [loadVideo, setLoadVideo] = useState(false);
  const onStop = useCallback(() => setPlaying(false), []);
  const onSourceChange = useCallback(() => { setReady(false); setPlaying(false); }, []);
  const onProgress = useCallback((p) => {
    const el = section.current;
    if (!el) return;
    progress.current = p;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + p * Math.max(0, el.offsetHeight - window.innerHeight), behavior: "instant" });
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => { setFailed(true); setPlaying(false); }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReducedMotion(media.matches); setReady(false); setPlaying(false); };
    media.addEventListener("change", update);
    const timer = window.setTimeout(() => setLoadVideo(true), 100);
    return () => { media.removeEventListener("change", update); window.clearTimeout(timer); };
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = section.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const distance = Math.max(el.offsetHeight - window.innerHeight, 1);
      const p = reducedMotion || failed ? 0 : Math.min(1, Math.max(0, -rect.top / distance));
      progress.current = p;
      active.current = rect.bottom > 0 && rect.top < window.innerHeight && !document.hidden;
      el.style.setProperty("--journey", p);
      el.style.setProperty("--opening-opacity", Math.max(0, 1 - p / 0.22));
      el.style.setProperty("--arrival-opacity", Math.min(1, Math.max(0, (p - 0.84) / 0.13)));
      setChapter(p < 0.32 ? 0 : p < 0.72 ? 1 : 2);
      setOpeningVisible(p < 0.2);
      setArrivalVisible(p > 0.9);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("visibilitychange", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", schedule);
    };
  }, [reducedMotion, failed]);

  const goTo = useCallback((p) => {
    setPlaying(false);
    const el = section.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + p * Math.max(0, el.offsetHeight - window.innerHeight), behavior: reducedMotion ? "instant" : "smooth" });
  }, [reducedMotion]);

  useEffect(() => {
    if (!playing) return;
    const cancel = () => setPlaying(false);
    const cancelKey = (event) => { if (["Escape", "ArrowDown", "ArrowUp", "PageDown", "PageUp", "Home", "End", " "].includes(event.key)) cancel(); };
    const hide = () => { if (document.hidden) cancel(); };
    document.addEventListener("visibilitychange", hide);
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("keydown", cancelKey);
    return () => { document.removeEventListener("visibilitychange", hide); window.removeEventListener("wheel", cancel); window.removeEventListener("touchstart", cancel); window.removeEventListener("keydown", cancelKey); };
  }, [playing]);

  const staticMode = reducedMotion || failed;
  return (
    <section className={`dealership-intro${staticMode ? " dealership-intro--static" : ""}${ready ? " is-ready" : ""}`} id="inicio" ref={section} aria-label="Recorrido por Colorosso Automotores">
      <div className="dealership-intro__sticky">
        <picture>
          <source media="(max-width: 699px)" srcSet={cinematicAsset("mobile", "-poster.jpg")} />
          <img className="dealership-intro__poster" src={cinematicAsset("desktop", "-poster.jpg")} alt="Fachadas y entrada de Colorosso Automotores recreadas a partir de las fotografías del local de Huanguelén" fetchPriority="high" />
        </picture>
        {loadVideo && !staticMode && <DealershipVideo progress={progress} active={active} playing={playing} onReady={onReady} onError={onError} onProgress={onProgress} onStop={onStop} onSourceChange={onSourceChange} />}
        <div className="dealership-intro__vignette" aria-hidden="true" />
        <div className="cinema-topline"><span>HUANGUELÉN, BUENOS AIRES</span><span className="cinema-topline__right">UN LUGAR. TU PRÓXIMO DESTINO.</span></div>
        <div className="dealership-intro__copy" inert={!openingVisible ? true : undefined}>
          <p className="eyebrow"><span /> Colorosso Automotores</p>
          <h1>El próximo capítulo<br />empieza <em>acá.</em></h1>
          <p>Vehículos que te mueven.<br />Personas que te acompañan.</p>
          <a className="cinema-link" href="#bienvenida">Conocé Colorosso <span aria-hidden="true">↗</span></a>
        </div>
        <div className="cinema-arrival cinema-arrival--mustang" inert={!arrivalVisible ? true : undefined}>
          <p className="eyebrow">Ford Mustang</p>
          <h2><em>Dark Horse.</em></h2>
          <a className="cinema-link" href="#historia">Conocé nuestra historia <span aria-hidden="true">↗</span></a>
        </div>
        <div className="cinema-side-note" aria-hidden="true">COLOROSSO / RECORRIDO</div>
        <div className="cinema-bottom">
          {!staticMode ? <nav className="cinema-chapters" aria-label="Momentos del recorrido">
            {chapters.map((item, index) => <button key={item.label} onClick={() => goTo(item.progress)} aria-current={chapter === index ? "step" : undefined}><span>0{index + 1}</span><span>{item.label}</span></button>)}
          </nav> : <span className="cinema-static-label">Bienvenidos a Colorosso</span>}
          <div className="cinema-actions">{failed && <button className="cinema-play" onClick={() => { setReady(false); setFailed(false); }}>Reintentar recorrido</button>}
            {!staticMode && <button className="cinema-play" disabled={!ready} aria-label={playing ? "Pausar recorrido" : "Reproducir recorrido"} aria-pressed={playing} onClick={() => { if (progress.current > 0.98) { progress.current = 0; const el = section.current; window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "instant" }); } setPlaying(!playing); }}><span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span><span>{playing ? "Pausar" : "Reproducir"}</span></button>}
            <a className="cinema-skip" href="#bienvenida" onClick={() => setPlaying(false)}>Conocé la concesionaria <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        {!staticMode && <div className="cinema-progress" aria-hidden="true"><span /></div>}
        <span className="cinema-status" role="status">{failed ? "Recorrido no disponible. Podés conocer la concesionaria." : !ready && !reducedMotion ? "Preparando el recorrido…" : ""}</span>
      </div>
    </section>
  );
}



