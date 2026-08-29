
export const navTo = (page, anchor) => window.dispatchEvent(
  new CustomEvent("app:navigate", { detail: { page, anchor } })
);
