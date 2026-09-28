// Dedicated offline entry point; not imported by the published application.
import React from "react";
import { createRoot } from "react-dom/client";
import DealershipScene from "./components/landing3d/DealershipScene";

const capture = { progress: { current: 0 } };
window.cinematicCapture = capture;
createRoot(document.getElementById("root")).render(
  <DealershipScene capture={capture} progress={capture.progress} active={{ current: true }}
    onReady={() => { capture.ready = true; }}
    onError={() => { capture.error = "WebGL context lost"; }} />
);
