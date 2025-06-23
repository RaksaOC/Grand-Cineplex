import React from "react";
import { Sofa } from "lucide-react";

interface Seat {
  id: string;
  row: string;
  number: number;
  type: "regular" | "premium" | "vip";
  price: number;
  isBooked: boolean;
}

interface SeatCardProps {
  seat: Seat;
  isSelected: boolean;
  onToggle: (id: string) => void;
}

const SeatCard = ({ seat, isSelected, onToggle }: SeatCardProps) => {
  const getSeatStyle = () => {
    if (seat.isBooked) return "bg-red-600 cursor-not-allowed opacity-60";
    if (isSelected)
      return "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg scale-105";
    switch (seat.type) {
      case "vip":
        return "bg-gradient-to-br from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-black font-semibold";
      case "premium":
        return "bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white";
      default:
        return "bg-gradient-to-br from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white";
    }
  };

  return (
    <button
      className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 transform hover:scale-110 ${getSeatStyle()}`}
      onClick={() => onToggle(seat.id)}
      disabled={seat.isBooked}
      title={`${seat.row}${seat.number} - $${seat.price}`}
    >
      <Sofa />
    </button>
  );
};

export default SeatCard;
