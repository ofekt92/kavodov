import { useState, useEffect } from "react";
import Home        from "./pages/Home";
import Calculators from "./pages/Calculators";

/**
 * Simple two-page app router.
 *
 * Pages communicate via a custom event:
 *   window.dispatchEvent(new CustomEvent("app:navigate", {
 *     detail: { page: "home" | "calculators", anchor?: string }
 *   }))
 *
 * Hash routes:
 *   #/calculators → Calculators
 *   anything else → Home (with optional in-page anchor like #contact)
 */
export default function App() {
  const [page, setPage] = useState(() =>
    window.location.hash.startsWith("#/calculators") ? "calculators" : "home"
  );

  useEffect(() => {
    const onHashChange = () => {
      setPage(window.location.hash.startsWith("#/calculators") ? "calculators" : "home");
    };

    const onAppNavigate = (e) => {
      const { page: target, anchor } = e.detail || {};

      if (target === "calculators") {
        window.location.hash = "#/calculators";
        window.scrollTo({ top: 0 });
        return;
      }

      // home
      window.location.hash = anchor ? `#${anchor}` : "";
      setPage("home");

      if (anchor) {
        // wait for Home to mount, then scroll
        setTimeout(() => {
          document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
        }, 80);
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    };

    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("app:navigate", onAppNavigate);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("app:navigate", onAppNavigate);
    };
  }, []);

  return page === "calculators" ? <Calculators /> : <Home />;
}
