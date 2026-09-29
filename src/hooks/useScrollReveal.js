import { useEffect } from "react";

const clamp = (value) => Math.min(1, Math.max(0, value));

export default function useScrollReveal(root) {
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reveals = [...element.querySelectorAll("[data-reveal]")];
    const readings = [...element.querySelectorAll("[data-reading]")].map((paragraph) => ({
      paragraph, words: [...paragraph.querySelectorAll(".reading-word")],
    }));
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = window.innerHeight;
      // Read positions before writing styles, once per animation frame.
      const revealPositions = reveals.map((node) => node.getBoundingClientRect().top - (1 - Number(node.style.getPropertyValue("--reveal") || 1)) * 56);
      const readingPositions = readings.map(({ paragraph }) => paragraph.getBoundingClientRect());
      reveals.forEach((node, index) => {
        const progress = motion.matches ? 1 : clamp((height * .96 - revealPositions[index]) / (height * .3));
        node.style.setProperty("--reveal", progress);
      });
      readings.forEach(({ words }, index) => {
        const rect = readingPositions[index];
        const progress = motion.matches ? 1 : clamp((height * .85 - rect.top) / (height * .45 + rect.height * .35));
        words.forEach((word, wordIndex) => {
          const amount = clamp(progress * (words.length + 4) - wordIndex);
          word.style.setProperty("--word-opacity", .16 + amount * .84);
        });
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", schedule);
    const observer = new ResizeObserver(schedule);
    observer.observe(element);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", schedule);
      observer.disconnect();
      reveals.forEach((node) => node.style.removeProperty("--reveal"));
      readings.forEach(({ words }) => words.forEach((word) => word.style.removeProperty("--word-opacity")));
    };
  }, [root]);
}
