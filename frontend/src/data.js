// Static configuration for the new-analysis form and sidebar navigation.
// Analysis results come from the backend API — see hooks/useAnalysis.js.

export const PRODUCTS = [
  { id: "ev", name: "Electric Cars", emoji: "⚡" },
  { id: "coffee", name: "Specialty Coffee", emoji: "☕" },
  { id: "fit", name: "Connected Fitness", emoji: "🏃" },
  { id: "fin", name: "Neobank Card", emoji: "💳" },
];

export const OBJECTIVES = [
  { id: "awareness", name: "Increase Awareness" },
  { id: "consideration", name: "Increase Consideration" },
  { id: "sales", name: "Increase Sales" },
  { id: "retention", name: "Improve Retention" },
];

export const SEGMENTS = [
  {
    id: "genz",
    name: "Gen Z Creators",
    sub: "Ages 18–26 · Mobile-native, content-first",
    n: 1850,
  },
  {
    id: "urban",
    name: "Urban Climate Advocates",
    sub: "Ages 28–45 · Sustainability-aligned",
    n: 1200,
  },
  {
    id: "smb",
    name: "Cost-Sensitive SMB Owners",
    sub: "Ages 35–58 · 1–25 employees, value-driven",
    n: 950,
  },
  {
    id: "retiree",
    name: "Retired DIYers",
    sub: "Ages 60+ · Hands-on, brand-loyal",
    n: 600,
  },
  {
    id: "itlead",
    name: "Enterprise IT Leaders",
    sub: "Ages 38–55 · Procurement-driven",
    n: 400,
  },
];

export const CATEGORIES = [
  { id: "okrs", label: "Marketing OKRs", glyph: "◉" },
  { id: "swot", label: "SWOT", glyph: "◇" },
  { id: "positioning", label: "Market Positioning", glyph: "◎" },
  { id: "persona", label: "Buyer Persona", glyph: "◯" },
  { id: "investment", label: "Investment Opportunity", glyph: "◈" },
  { id: "channels", label: "Channels & Distribution", glyph: "◰" },
];
