import {
  KeyRound,
  RefreshCw,
  HardHat,
  TrendingDown,
  Building2,
  Handshake,
} from "lucide-react";

/**
 * Icon per service card, keyed by the `id` in home.services.items.
 * Kept out of the locale files so the two languages can't drift apart.
 */
export const SERVICE_ICONS = {
  "first-home": KeyRound,
  refinance: RefreshCw,
  "self-build": HardHat,
  "better-terms": TrendingDown, // the rate coming down, not a generic chart
  investment: Building2,
  representation: Handshake,
};
