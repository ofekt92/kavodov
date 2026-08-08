import { navTo } from "../lib/navigate";

/** Shared marketing footer. Section links route home + scroll to the anchor. */
export default function SiteFooter() {
  const toSection = (anchor) => (e) => { e.preventDefault(); navTo("home", anchor); };
  const toPage    = (page)   => (e) => { e.preventDefault(); navTo(page); };

  return (
    <footer>
      <div className="footer-logo">משכנתא<span>PRO</span></div>
      <div className="footer-links">
        <a href="#" onClick={(e) => e.preventDefault()}>אודות</a>
        <a href="#services"     onClick={toSection("services")}>שירותים</a>
        <a href="#process"      onClick={toSection("process")}>תהליך</a>
        <a href="#testimonials" onClick={toSection("testimonials")}>המלצות</a>
        <a href="#/contact"     onClick={toPage("contact")}>צור קשר</a>
        <a href="#/calculators" onClick={toPage("calculators")}>מחשבונים</a>
        <a href="#" onClick={(e) => e.preventDefault()}>מדיניות פרטיות</a>
      </div>
      <hr className="footer-divider" />
      <p>
        משכנתאPRO — יועצי משכנתא מורשים | רישיון ייעוץ פיננסי מס' 000000<br />
        © 2025 משכנתאPRO.co.il | כל הזכויות שמורות<br />
        <small>האתר מספק מידע כללי בלבד ואינו מהווה ייעוץ פיננסי מחייב</small>
      </p>
    </footer>
  );
}
