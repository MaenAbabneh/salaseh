"use client";

import { useState } from "react";
import { ISeatingMap, ISeat } from "@/database/event.model";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SEAT_PRICES, SEAT_STATUS } from "@/constants/seating";

interface SeatMapProps {
  mapData: ISeatingMap;
}

const SeatMap = ({ mapData }: SeatMapProps) => {
  const [selectedSeats, setSelectedSeats] = useState<ISeat[]>([]);

  const handleSeatClick = (seat: ISeat) => {
    // Only allow selection of available seats
    if (seat.status !== SEAT_STATUS.AVAILABLE) return;

    setSelectedSeats((prev) => {
      const isAlreadySelected = prev.some((s) => s.id === seat.id);

      if (isAlreadySelected) {
        // Remove seat if already selected
        return prev.filter((s) => s.id !== seat.id);
      } else {
        // Add seat to selection
        return [...prev, seat];
      }
    });
  };

  const getSeatClassName = (seat: ISeat) => {
    const isSelected = selectedSeats.some((s) => s.id === seat.id);

    const baseClasses =
      "w-8 h-8 text-xs font-semibold rounded transition-all duration-200 border-2";

    switch (seat.status) {
      case SEAT_STATUS.AVAILABLE:
        return cn(
          baseClasses,
          isSelected
            ? "bg-blue-500 text-white border-blue-600 transform scale-110"
            : "bg-green-100 text-green-800 border-green-300 hover:bg-green-200 hover:border-green-400 cursor-pointer"
        );
      case SEAT_STATUS.BOOKED:
        return cn(
          baseClasses,
          "bg-red-100 text-red-800 border-red-300 cursor-not-allowed opacity-60"
        );
      case SEAT_STATUS.LOCKED:
        return cn(
          baseClasses,
          "bg-yellow-100 text-yellow-800 border-yellow-300 cursor-not-allowed opacity-60"
        );
      default:
        return baseClasses;
    }
  };

  const totalPrice = selectedSeats.reduce((sum, seat) => {
    return sum + (SEAT_PRICES[seat.priceTier as keyof typeof SEAT_PRICES] || 0);
  }, 0);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Stage */}
      <div className="mb-8 text-center">
        <div className="bg-gray-800 text-white py-4 px-8 rounded-lg mb-4 inline-block">
          <h2 className="text-xl font-bold">🎭 STAGE</h2>
          <p className="text-sm text-gray-300">{mapData.stage.description}</p>
        </div>
      </div>

      {/* Seating Area */}
      <div className="space-y-4 mb-8">
        {Object.entries(mapData.rows).map(([rowName, seats]) => (
          <div key={rowName} className="flex items-center justify-center gap-2">
            {/* Row Label */}
            <div className="w-8 text-center font-bold text-gray-700 mr-4">
              {rowName}
            </div>

            {/* Seats */}
            <div className="flex gap-1">
              {seats.map((seat) => (
                <button
                  key={seat.id}
                  onClick={() => handleSeatClick(seat)}
                  disabled={seat.status !== SEAT_STATUS.AVAILABLE}
                  className={getSeatClassName(seat)}
                  title={`Row ${seat.row}, Seat ${seat.number} - ${seat.priceTier} (${seat.status})`}
                >
                  {seat.number}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mb-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 border-2 border-blue-600 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-300 rounded"></div>
          <span>Locked</span>
        </div>
      </div>

      {/* Selection Summary */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Selected Seats</h3>

        {selectedSeats.length === 0 ? (
          <p className="text-gray-500">No seats selected</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 mb-4">
              {selectedSeats.map((seat) => (
                <div
                  key={seat.id}
                  className="bg-white p-3 rounded border border-gray-200"
                >
                  <div className="font-medium">
                    Row {seat.row}, Seat {seat.number}
                  </div>
                  <div className="text-sm text-gray-600">
                    {seat.priceTier} - $
                    {SEAT_PRICES[seat.priceTier as keyof typeof SEAT_PRICES] ||
                      0}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <div className="text-lg font-semibold">Total: ${totalPrice}</div>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                disabled={selectedSeats.length === 0}
              >
                Confirm Booking ({selectedSeats.length} seat
                {selectedSeats.length !== 1 ? "s" : ""})
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SeatMap;
