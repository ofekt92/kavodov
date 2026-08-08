import { useEffect } from "react";

export const CALENDLY_URL = "https://calendly.com/shlomo-mashpro/new-meeting";

/**
 * Opens Calendly in a popup widget. Falls back to a new tab
 * if the Calendly script hasn't loaded yet.
 */
export function openCalendly() {
  if (window.Calendly?.initPopupWidget) {
    window.Calendly.initPopupWidget({ url: CALENDLY_URL });
    return false;
  }
  window.open(CALENDLY_URL, "_blank", "noopener,noreferrer");
  return false;
}

/** Lazy-loads the Calendly widget assets once, on mount. */
export function useCalendlyWidget() {
  useEffect(() => {
    if (document.getElementById("calendly-script")) return;

    const css = document.createElement("link");
    css.rel  = "stylesheet";
    css.href = "https://assets.calendly.com/assets/external/widget.css";
    document.head.appendChild(css);

    const script = document.createElement("script");
    script.id    = "calendly-script";
    script.src   = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);
}
