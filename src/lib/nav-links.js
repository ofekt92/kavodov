import { navTo } from "./navigate";

/**
 * The one nav menu every page shows.
 * @param {"home"|"calculators"|"contact"} current - page to mark active
 */
export function siteNavLinks(current) {
  const section = (anchor) => ({
    href: `#${anchor}`,
    onClick: (e) => { e.preventDefault(); navTo("home", anchor); },
  });
  const page = (name) => ({
    href: `#/${name}`,
    active: current === name,
    onClick: (e) => { e.preventDefault(); navTo(name); },
  });

  return [
    { label: "ראשי", href: "#", active: current === "home",
      onClick: (e) => { e.preventDefault(); navTo("home"); } },
    { label: "שירותים",  ...section("services")     },
    { label: "תהליך",    ...section("process")      },
    { label: "לקוחות",   ...section("testimonials") },
    { label: "מחשבונים", ...page("calculators")     },
    { label: "צור קשר",  ...page("contact")         },
  ];
}
