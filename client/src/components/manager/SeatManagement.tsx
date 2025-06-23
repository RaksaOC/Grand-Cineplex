import React from "react";
import { Theater } from "./Theaters";
import { Seat } from "./Theaters";
import { ArrowLeft, Monitor, Sofa } from "lucide-react";

export default function SeatManagementPopup({ theater, onBack }: {
    theater: Theater;
    onBack: () => void;
}) {
    // Generate seats for the theater
    const generateSeats = (): Seat[] => {
        const seats: Seat[] = [];
        const rows = Array.from({ length: theater.rows }, (_, i) => String.fromCharCode(65 + i)); // A, B, C, etc.

        rows.forEach((row, rowIndex) => {
            for (let i = 1; i <= theater.seatsPerRow; i++) {
                const seatId = `${row}${i}`;
                let type: 'regular' | 'premium' | 'vip' = 'regular';
                let price = 12.50;

                // Premium seats (middle rows)
                if (rowIndex >= Math.floor(theater.rows / 3) && rowIndex <= Math.floor(2 * theater.rows / 3)) {
                    type = 'premium';
                    price = 15.00;
                }

                // VIP seats (front row)
                if (rowIndex === 0) {
                    type = 'vip';
                    price = 18.00;
                }

                seats.push({
                    id: seatId,
                    row,
                    number: i,
                    type,
                    price,
                    isBooked: false // No booking functionality in theater management
                });
            }
        });
        return seats;
    };

    const seats = generateSeats();

    const getSeatStyle = (seat: Seat) => {
        switch (seat.type) {
            case 'vip':
                return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black font-semibold';
            case 'premium':
                return 'bg-gradient-to-br from-purple-500 to-purple-600 text-white';
            default:
                return 'bg-gradient-to-br from-gray-600 to-gray-700 text-white';
        }
    };

    const rows = Array.from({ length: theater.rows }, (_, i) => String.fromCharCode(65 + i));

    return (
        <div className="flex flex-col gap-6 p-4 w-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Theaters
                    </button>
                </div>

            </div>

            <div className="flex flex-col items-start">
                <h2 className="text-2xl font-bold tracking-tight text-white">{theater.name} - Seat Layout</h2>
                <p className="text-slate-400">Manage theater seating configuration</p>
            </div>

            {/* Theater Info
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-white">{theater.capacity}</div>
                        <div className="text-xs text-slate-400">Total Seats</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">{theater.rows}</div>
                        <div className="text-xs text-slate-400">Rows</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{theater.seatsPerRow}</div>
                        <div className="text-xs text-slate-400">Seats per Row</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{theater.location}</div>
                        <div className="text-xs text-slate-400">Location</div>
                    </div>
                </div>
            </div> */}

            <div className="flex gap-4 w-full">
                <div className="flex flex-col gap-4 w-full bg-slate-900 border border-slate-800 rounded-lg p-4">
                    {/* Screen */}
                    <div className="relative">
                        <div className="w-full h-12 bg-gradient-to-b from-gray-300 to-gray-500 mx-auto rounded-lg flex items-center justify-center text-gray-700 font-semibold shadow-lg">
                            <Monitor className="w-6 h-6 mr-2" />
                            SCREEN
                        </div>
                        <div className="absolute inset-x-0 top-12 h-4 bg-gradient-to-b from-gray-300/20 to-transparent"></div>
                    </div>

                    {/* Seat Grid */}
                    <div className="flex flex-col items-center gap-3">
                        {rows.map((row) => (
                            <div key={row} className="flex gap-3 items-center">
                                <span className="w-8 text-center font-semibold text-slate-400">{row}</span>
                                <div className="flex gap-1">
                                    {seats.filter(seat => seat.row === row).map((seat) => (
                                        <div
                                            key={seat.id}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-medium ${getSeatStyle(seat)}`}
                                            title={`${seat.row}${seat.number} - ${seat.type.charAt(0).toUpperCase() + seat.type.slice(1)} - $${seat.price}`}
                                        >
                                            <Sofa className="w-4 h-4" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Seat Selection Panel */}
                <div className="flex flex-col gap-4 w-56 bg-slate-900 border border-slate-800 rounded-lg p-4">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Seat Types</h2>
                    <p className="text-slate-400">Drag and drop seats to configure layout</p>

                    {/* Draggable Seat Types */}
                    <div className="flex flex-col gap-4 mt-4">
                        <div className="flex items-center justify-center gap-3 p-3 bg-slate-800 rounded-lg cursor-move">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                                <Sofa className="w-5 h-5 text-white" />
                            </div>
                        </div>

                        <div className="flex items-center justify-center gap-3 p-3 bg-slate-800 rounded-lg cursor-move">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                                <Sofa className="w-5 h-5 text-white" />
                            </div>
                            
                        </div>

                        <div className="flex items-center justify-center gap-3 p-3 bg-slate-800 rounded-lg cursor-move">
                            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                                <Sofa className="w-5 h-5 text-black" />
                            </div>
                            
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons
            <div className="flex gap-3 justify-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition">
                    Save Configuration
                </button>
                <button
                    onClick={onBack}
                    className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
                >
                    Cancel
                </button>
            </div> */}
        </div>
    );
}