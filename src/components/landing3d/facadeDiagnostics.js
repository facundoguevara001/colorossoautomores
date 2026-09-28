// Temporary local A/B controls. A full reload is required between variants.
// Public deployments always retain the standard rendering pipeline.
export function readFacadeDiagnostics() {
  const local = typeof window !== "undefined"
    && ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
  const params = new URLSearchParams(local ? window.location.search : "");
  return {
    ao: params.get("facadeAo") !== "off",
    sunShadow: params.get("facadeSunShadow") !== "off",
  };
}
