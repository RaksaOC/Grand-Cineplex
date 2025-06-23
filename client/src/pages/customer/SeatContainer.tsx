import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, ShoppingCart, Monitor } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SeatCard from "../components/seats/SeatCard";
import LegendBox from "../components/seats/LegendBox";
import SelectedSeats from "../components/seats/SelectedSeats";
import LoadingSpinner from "../components/LoadingSpinner";
import TimeoutPopup from "../components/TimeOutPopUp";

interface Seat {
  id: string;
  row: string;
  number: number;
  type: "regular" | "premium" | "vip";
  price: number;
  isBooked: boolean;
}

const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
const seatsPerRow = 12;

const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];
  rows.forEach((row, rowIndex) => {
    for (let i = 1; i <= seatsPerRow; i++) {
      const seatId = `${row}${i}`;
      let type: "regular" | "premium" | "vip" = "regular";
      let price = 4.0;

      if (rowIndex <= 1) {
        type = "vip";
        price = 15.0;
      } else if (rowIndex >= 2 && rowIndex <= 4) {
        type = "premium";
        price = 10.0;
      }

      seats.push({ id: seatId, row, number: i, type, price, isBooked: false });
    }
  });
  return seats;
};

export default function SeatContainer() {
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(120);
  const [timeoutPopup, setTimeoutPopup] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loading || timeoutPopup) return;

    if (timeLeft <= 0) {
      setTimeoutPopup(true);
      setTimeout(() => navigate(-1), 3000);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, loading, timeoutPopup, navigate]);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60).toString();
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const seats = generateSeats();

  const toggleSeat = (seatId: string) => {
    const seat = seats.find((s) => s.id === seatId);
    if (seat?.isBooked) return;

    setSelectedSeats((prev) =>
      prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId]
    );
  };

  const getTotalPrice = () =>
    selectedSeats.reduce((total, id) => total + (seats.find((s) => s.id === id)?.price || 0), 0);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white px-4 sm:px-6 md:px-10 lg:px-20 overflow-x-hidden py-4">
      {timeoutPopup && <TimeoutPopup />}

      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Movies
          </button>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-gray-300 whitespace-nowrap">
              <Clock className="w-4 h-4" /> <span>{formatTime(timeLeft)} remaining</span>
            </div>
            <div className="flex items-center gap-2 bg-blue-600 px-3 py-1 rounded-full">
              <ShoppingCart className="w-4 h-4" />
              <span className="text-sm font-medium">${getTotalPrice().toFixed(2)}</span>
            </div>
          </div>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-center mb-2">Select Your Seats</h1>
        <p className="text-gray-400 text-center">Choose the perfect seats for your movie experience</p>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="relative mb-16">
          <div className="w-full h-12 bg-gradient-to-b from-gray-300 to-gray-500 mx-auto rounded-lg flex items-center justify-center text-gray-700 font-semibold shadow-lg">
            <Monitor className="w-6 h-6 mr-2" /> SCREEN
          </div>
          <div className="absolute inset-x-0 top-12 h-4 bg-gradient-to-b from-gray-300/20 to-transparent"></div>
        </div>

        <div className="flex flex-col items-center gap-3 mb-12 max-w-full">
          {rows.map((row) => {
            const rowSeats = seats.filter((seat) => seat.row === row);
            const firstHalf = rowSeats.slice(0, 6);
            const secondHalf = rowSeats.slice(6, 12);

            return (
              <div
                key={row}
                className="flex flex-col sm:flex-row items-center gap-3 justify-center w-full max-w-4xl"
              >
                <span className="w-8 text-center font-semibold text-gray-400 shrink-0">{row}</span>
                <div className="flex flex-col sm:flex-row gap-1">
                  <div className="flex gap-1 justify-center">
                    {firstHalf.map((seat) => (
                      <SeatCard
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSeats.includes(seat.id)}
                        onToggle={toggleSeat}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1 justify-center sm:ml-2 mt-1 sm:mt-0">
                    {secondHalf.map((seat) => (
                      <SeatCard
                        key={seat.id}
                        seat={seat}
                        isSelected={selectedSeats.includes(seat.id)}
                        onToggle={toggleSeat}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap justify-center gap-6 mb-8 text-sm">
          <LegendBox colorFrom="#4b5563" colorTo="#374151" label="Regular - $4.00" />
          <LegendBox colorFrom="#8b5cf6" colorTo="#7c3aed" label="Premium - $10.00" />
          <LegendBox colorFrom="#fbbf24" colorTo="#d97706" label="VIP - $15.00" />
          <LegendBox colorFrom="#dc2626" colorTo="#dc2626" label="Booked" opacity />
        </div>

        <SelectedSeats
          selectedSeats={selectedSeats}
          seats={seats}
          totalPrice={getTotalPrice()}
        />
      </div>
    </div>
  );
}
