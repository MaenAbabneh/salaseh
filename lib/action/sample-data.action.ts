"use server";

import { createEvent, saveSeatingMap } from "@/lib/action/event.action";
import { ISeatingMap, ISeat } from "@/database/event.model";
import { SEAT_STATUS, PRICE_TIERS } from "@/constants/seating";

// Helper function to generate sample seating data
export async function createSampleEvent() {
  // Create a sample event
  const eventResult = await createEvent({
    title: "Salaseh Comedy Show",
    description:
      "An evening of laughter with the famous Jordanian comedy troupe",
    date: new Date("2025-08-15T20:00:00Z"),
    venue: "Amman Theater",
    totalSeats: 120,
  });

  if (!eventResult.success || !eventResult.data) {
    throw new Error("Failed to create sample event");
  }

  const eventId = (eventResult.data as any)._id;

  // Generate sample seating map
  const sampleSeatingMap: ISeatingMap = {
    stage: {
      description: "Main Performance Stage",
    },
    rows: {
      A: generateRowSeats("A", 10, PRICE_TIERS.VIP),
      B: generateRowSeats("B", 10, PRICE_TIERS.VIP),
      C: generateRowSeats("C", 12, PRICE_TIERS.PREMIUM),
      D: generateRowSeats("D", 12, PRICE_TIERS.PREMIUM),
      E: generateRowSeats("E", 14, PRICE_TIERS.STANDARD),
      F: generateRowSeats("F", 14, PRICE_TIERS.STANDARD),
      G: generateRowSeats("G", 16, PRICE_TIERS.ECONOMY),
      H: generateRowSeats("H", 16, PRICE_TIERS.ECONOMY),
      I: generateRowSeats("I", 16, PRICE_TIERS.ECONOMY),
    },
  };

  // Save the seating map
  const mapResult = await saveSeatingMap({
    eventId,
    mapData: sampleSeatingMap,
  });

  if (!mapResult.success) {
    throw new Error("Failed to save seating map");
  }

  return { eventId, seatingMap: sampleSeatingMap };
}

function generateRowSeats(
  rowName: string,
  seatCount: number,
  priceTier: string
): ISeat[] {
  const seats: ISeat[] = [];

  for (let i = 1; i <= seatCount; i++) {
    let status: "available" | "booked" | "locked" = SEAT_STATUS.AVAILABLE;

    // Randomly set some seats as booked or locked for demonstration
    const random = Math.random();
    if (random < 0.1) {
      status = SEAT_STATUS.BOOKED;
    } else if (random < 0.15) {
      status = SEAT_STATUS.LOCKED;
    }

    seats.push({
      id: `${rowName}-${i}`,
      row: rowName,
      number: i,
      status,
      priceTier,
    });
  }

  return seats;
}
