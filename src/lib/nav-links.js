import { navTo } from "./navigate";

export function siteNavLinks(current, t) {
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
    { label: t("nav.home"), href: "#", active: current === "home",
      onClick: (e) => { e.preventDefault(); navTo("home"); } },
    { label: t("nav.services"),    ...section("services")     },
    { label: t("nav.process"),     ...section("process")      },
    { label: t("nav.calculators"), ...page("calculators")     },
    { label: t("nav.contact"),     ...page("contact")         },
  ];
}
