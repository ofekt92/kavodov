import { useState, useEffect } from "react";
import Home        from "./features/home";
import Calculators from "./features/calculators";
import Contact     from "./features/contact";

const PAGES = {
  calculators: Calculators,
  contact:     Contact,
  home:        Home,
};

const pageFromHash = () => {
  const hash = window.location.hash;
  const match = Object.keys(PAGES).find(name => hash.startsWith(`#/${name}`));
  return match || "home";
};

export default function App() {
  const [page, setPage] = useState(pageFromHash);

  useEffect(() => {
    const onHashChange = () => setPage(pageFromHash());

    const onAppNavigate = (e) => {
      const { page: target, anchor } = e.detail || {};

      if (target && target !== "home") {
        window.location.hash = `#/${target}`;
        setPage(target);
        window.scrollTo({ top: 0 });
        return;
      }

      window.location.hash = anchor ? `#${anchor}` : "";
      setPage("home");

      if (anchor) {

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

  const Page = PAGES[page] || Home;
  return <Page />;
}
