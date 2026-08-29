import { useTranslation } from "react-i18next";
import { navTo } from "../lib/navigate";

export default function SiteFooter() {
  const { t } = useTranslation();
  const toSection = (anchor) => (e) => { e.preventDefault(); navTo("home", anchor); };
  const toPage    = (page)   => (e) => { e.preventDefault(); navTo(page); };

  return (
    <footer>
      <img className="footer-coin" src="/coin.webp" alt="" width="90" height="88" loading="lazy" />
      <div className="footer-logo">{t("brand.name")}<span>{t("brand.suffix")}</span></div>
      <div className="footer-links">
        <a href="#" onClick={(e) => e.preventDefault()}>{t("footer.about")}</a>
        <a href="#services"     onClick={toSection("services")}>{t("footer.services")}</a>
        <a href="#process"      onClick={toSection("process")}>{t("footer.process")}</a>
        <a href="#testimonials" onClick={toSection("testimonials")}>{t("footer.testimonials")}</a>
        <a href="#/contact"     onClick={toPage("contact")}>{t("footer.contact")}</a>
        <a href="#/calculators" onClick={toPage("calculators")}>{t("footer.calculators")}</a>
        <a href="#" onClick={(e) => e.preventDefault()}>{t("footer.privacy")}</a>
      </div>
      <hr className="footer-divider" />
      <p>
        {t("footer.license")}<br />
        {t("footer.copyright")}<br />
        <small>{t("footer.disclaimer")}</small>
      </p>
    </footer>
  );
}
