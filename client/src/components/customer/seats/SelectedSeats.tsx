import React from "react";
import { Sofa } from "lucide-react";

interface Seat {
  id: string;
  price: number;
}

interface SelectedSeatsProps {
  selectedSeats: string[];
  seats: Seat[];
  totalPrice: number;
}

const SelectedSeats = ({ selectedSeats, seats, totalPrice }: SelectedSeatsProps) => (
  <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 max-w-3xl mx-auto">
    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
      <Sofa className="w-5 h-5" /> Selected Seats
    </h2>
    {selectedSeats.length > 0 ? (
      <>
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {selectedSeats
            .slice()
            .sort()
            .map((id) => {
              const seat = seats.find((s) => s.id === id);
              return (
                <span
                  key={id}
                  className="bg-blue-600/20 border border-blue-500/30 px-3 py-1 rounded-full text-blue-300 text-sm"
                >
                  {id} - ${seat?.price}
                </span>
              );
            })}
        </div>
        <div className="flex justify-between items-center border-t border-gray-700 pt-3">
          <span className="text-gray-300">Total ({selectedSeats.length} seats):</span>
          <span className="text-2xl font-bold text-green-400">${totalPrice.toFixed(2)}</span>
        </div>
        <button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-all">
          Continue to Payment
        </button>
      </>
    ) : (
      <p className="text-gray-400 text-center py-4">No seats selected. Click on seats to make your selection.</p>
    )}
  </div>
);

export default SelectedSeats;
