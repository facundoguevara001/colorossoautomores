import React, { useEffect, useRef, useState } from "react";

const REVISION = "20260927-render-01";
export const cinematicAsset = (variant, suffix) => `/cinematic/rendered/${variant}${suffix}?v=${REVISION}`;

export default function DealershipVideo({ progress, active, playing, onReady, onError, onProgress, onStop, onSourceChange }) {
  const videoRef = useRef(null);
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 699px)").matches);
  const [loaded, setLoaded] = useState(false);
  const variant = mobile ? "mobile" : "desktop";

  useEffect(() => {
    const media = window.matchMedia("(max-width: 699px)");
    const update = () => {
      setLoaded(false);
      onSourceChange();
      setMobile(media.matches);
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [onSourceChange]);

  useEffect(() => {
    const video = videoRef.current;
    if (!loaded) return;
    let disposed = false;
    if (playing) {
      const lastFrame = Math.max(0, video.duration - 1 / 60);
      video.currentTime = Math.min(lastFrame, Math.max(0, progress.current * lastFrame));
      video.play().catch(() => { if (!disposed) onStop(); });
    } else video.pause();
    return () => { disposed = true; video.pause(); };
  }, [playing, loaded, variant, onStop, progress]);

  useEffect(() => {
    const video = videoRef.current;
    let frame;
    const tick = () => {
      if (loaded && !document.hidden && active.current && Number.isFinite(video.duration)) {
        const lastFrame = Math.max(0, video.duration - 1 / 60);
        if (playing) {
          if (!video.paused) onProgress(Math.min(1, video.currentTime / lastFrame));
        } else if (!video.seeking) {
          // Only one seek in flight; intermediate scroll events collapse into the latest target.
          const target = Math.max(0, Math.min(lastFrame, progress.current * lastFrame));
          if (Math.abs(target - video.currentTime) >= 1 / 60) video.currentTime = target;
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [loaded, playing, variant, progress, active, onProgress]);

  return <video key={variant} ref={videoRef} className="dealership-scene dealership-video"
    src={cinematicAsset(variant, ".mp4")} poster={cinematicAsset(variant, "-poster.jpg")}
    muted playsInline preload="auto" disablePictureInPicture aria-hidden="true"
    onLoadedData={() => { setLoaded(true); onReady(); }} onError={onError}
    onEnded={() => { onProgress(1); onStop(); }} />;
}
