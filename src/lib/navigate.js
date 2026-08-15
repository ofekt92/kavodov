/**
 * Pages communicate with the router in App.jsx via a custom event.
 *
 *   navTo("contact")                → #/contact
 *   navTo("home", "services")       → home, scrolled to #services
 */
export const navTo = (page, anchor) => window.dispatchEvent(
  new CustomEvent("app:navigate", { detail: { page, anchor } })
);
