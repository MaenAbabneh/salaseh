export const SEAT_PRICES = {
  VIP: 100,
  Premium: 75,
  Standard: 50,
  Economy: 25,
} as const;

export const SEAT_STATUS = {
  AVAILABLE: "available",
  BOOKED: "booked",
  LOCKED: "locked",
} as const;

export const PRICE_TIERS = {
  VIP: { name: "VIP", price: 100, color: "#FFD700" },
  PREMIUM: { name: "Premium", price: 75, color: "#C0C0C0" },
  STANDARD: { name: "Standard", price: 50, color: "#87CEEB" },
  ECONOMY: { name: "Economy", price: 25, color: "#98FB98" },
} as const;

export type SeatStatus = keyof typeof SEAT_STATUS;
export type PriceTier = keyof typeof PRICE_TIERS;

// Default seating configuration
export const DEFAULT_SEAT_CONFIG = {
  width: 40,
  height: 40,
  spacing: 10,
  rowSpacing: 20,
} as const;
