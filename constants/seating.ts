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
  VIP: "VIP",
  PREMIUM: "Premium",
  STANDARD: "Standard",
  ECONOMY: "Economy",
} as const;
