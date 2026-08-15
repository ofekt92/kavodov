import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "./language-switch";

/**
 * Shared site header.
 *
 * Desktop: logo | inline links | gold CTA.
 * Mobile (<=768px): logo | hamburger + CTA, links collapse into a
 * slide-down panel beneath the bar.
 *
 * @param {{label: string, href?: string, onClick?: Function, active?: boolean}[]} links
 * @param {{label: string, onClick: Function}} cta
 * @param {Function} [onLogoClick] - defaults to scrolling to top
 */
export default function SiteNav({ links, cta, onLogoClick }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  // Close on Escape, on a click outside the nav, and whenever the viewport
  // grows past the mobile breakpoint
  useEffect(() => {
    if (!open) return;

    const onKeyDown   = (e) => { if (e.key === "Escape") setOpen(false); };
    const onResize    = () => { if (window.innerWidth > 768) setOpen(false); };
    const onPointerDn = (e) => { if (!e.target.closest("nav")) setOpen(false); };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);
    document.addEventListener("pointerdown", onPointerDn);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("pointerdown", onPointerDn);
    };
  }, [open]);

  // Run the link's own handler, then collapse the panel
  const handleLink = (link) => (e) => {
    link.onClick?.(e);
    setOpen(false);
  };

  return (
    <nav>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          if (onLogoClick) onLogoClick(e);
          else window.scrollTo({ top: 0, behavior: "smooth" });
          setOpen(false);
        }}
        className="logo"
      >
        <span className="logo-dot">●</span> {t("brand.name")}<span>{t("brand.suffix")}</span>
      </a>

      <button
        type="button"
        className={`nav-toggle ${open ? "open" : ""}`}
        aria-label={t("nav.menu")}
        aria-expanded={open}
        aria-controls="nav-menu"
        onClick={() => setOpen(o => !o)}
      >
        <span /><span /><span />
      </button>

      <div id="nav-menu" className={`nav-links ${open ? "open" : ""}`}>
        {links.map((l, i) => (
          <a
            key={i}
            href={l.href || "#"}
            className={l.active ? "active" : undefined}
            onClick={handleLink(l)}
          >
            {l.label}
          </a>
        ))}
        {/* the bar is too tight for the toggle at <=768px — it rides in the panel instead */}
        <LanguageSwitch className="lang-switch-panel" onChange={() => setOpen(false)} />
      </div>

      <div className="nav-end">
        <LanguageSwitch className="lang-switch-bar" />
        <button className="nav-cta" onClick={cta.onClick}>
          {cta.label}
        </button>
      </div>
    </nav>
  );
}
