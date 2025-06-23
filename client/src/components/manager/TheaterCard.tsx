import React from "react";
import { Theater } from "./Theaters";
import { MapPin, Users, Sofa, Edit } from "lucide-react";

export default function TheaterCard({ theater, onEdit }: {
    theater: Theater;
    onEdit: (theater: Theater) => void;
}) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "active": return "bg-green-600/20 text-green-400";
            case "maintenance": return "bg-yellow-600/20 text-yellow-400";
            case "inactive": return "bg-red-600/20 text-red-400";
            default: return "bg-gray-600/20 text-gray-400";
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "active": return "Active";
            case "maintenance": return "Maintenance";
            case "inactive": return "Inactive";
            default: return "Unknown";
        }
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 hover:border-blue-500/50 transition-colors duration-300">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-lg">{theater.name}</h3>
                        <p className="text-slate-400 text-sm">{theater.location}</p>
                    </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(theater.status)}`}>
                    {getStatusText(theater.status)}
                </span>
            </div>

            {/* Theater Info */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>Capacity: {theater.capacity} seats</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                    <Sofa className="w-4 h-4 text-slate-400" />
                    <span>Layout: {theater.rows} rows × {theater.seatsPerRow} seats</span>
                </div>
                {/* Action Button */}
                <div className="flex items-center justify-start pt-4 border-t border-slate-800">
                    <button
                        onClick={() => onEdit(theater)}
                        className="flex items-center gap-2 px-4 py-2 text-sm rounded bg-sky-600 hover:bg-sky-700 text-white font-semibold transition"
                    >
                        <Edit className="w-4 h-4" />
                        Edit Theater
                    </button>
                </div>
            </div>


        </div>
    );
}