import React, { useState } from "react";
import { Screening } from "./Screenings";
import { MapPin, Clock, Users } from "lucide-react";
import { deleteScreening } from "../../api/manager";

export default function TheaterScreeningCard({ screening, onEdit }: { screening: Screening; onEdit: () => void }) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "upcoming":
                return "bg-blue-600/20 text-blue-400";
            case "ongoing":
                return "bg-green-600/20 text-green-400";
            case "completed":
                return "bg-gray-600/20 text-gray-400";
            default:
                return "bg-gray-600/20 text-gray-400";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "upcoming":
                return "Upcoming";
            case "ongoing":
                return "Ongoing";
            case "completed":
                return "Completed";
            default:
                return "Unknown";
        }
    };

    const [showConfirm, setShowConfirm] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const deleteHandler = async () => {
        setShowConfirm(true);
    };

    const confirmDelete = async () => {
        setDeleting(true);
        await deleteScreening(screening.id);
        setDeleting(false);
        setShowConfirm(false);
    };

    const cancelDelete = () => setShowConfirm(false);

    const occupancyRate = ((screening.totalSeats - screening.availableSeats) / screening.totalSeats) * 100;

    return (
        <div className="bg-gray-900/50 border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors duration-300 relative">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-sky-500" />
                    <div>
                        <h3 className="text-white font-semibold text-sm">{screening.theater}</h3>
                        <p className="text-slate-400 text-xs">{screening.duration}</p>
                    </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(screening.status)}`}>
                    {getStatusText(screening.status)}
                </span>
            </div>

            <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {screening.time} • {new Date(screening.date).toLocaleDateString()}
                </div>

                <div className="flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    {screening.availableSeats}/{screening.totalSeats} seats available
                </div>

                <div className="w-full bg-slate-700 rounded-full h-1.5">
                    <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${occupancyRate}%` }}
                    ></div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                        <button
                            className="px-2 py-1 text-xs rounded bg-blue-800 hover:bg-blue-700 text-white font-semibold transition"
                            onClick={onEdit}
                        >
                            Edit
                        </button>
                        <button
                            className="px-2 py-1 text-xs rounded bg-red-800 hover:bg-red-700 text-white font-semibold transition"
                            onClick={deleteHandler}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
                    <div className="bg-gray-900 border border-slate-700 rounded-lg p-6 shadow-lg w-[320px] flex flex-col items-center">
                        <h3 className="text-lg font-semibold text-white mb-2">Confirm Cancellation</h3>
                        <p className="text-slate-400 mb-6 text-center">
                            Are you sure you want to cancel this screening?
                            <br />
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3 w-full justify-center">
                            <button
                                onClick={cancelDelete}
                                className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white font-semibold transition"
                                disabled={deleting}
                            >
                                No, Keep
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-4 py-2 rounded bg-red-700 hover:bg-red-600 text-white font-semibold transition"
                                disabled={deleting}
                            >
                                {deleting ? "Cancelling..." : "Yes, Cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
