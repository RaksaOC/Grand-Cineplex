import React, { useState } from "react";
import { Search, Filter, PlusCircle, MapPin } from "lucide-react";
import SeatManagementPopup from "./SeatManagement";
import TheaterCard from "./TheaterCard";
import AddTheater from "./AddTheater";

export interface Theater {
    id: string;
    name: string;
    capacity: number;
    rows: number;
    seatsPerRow: number;
    status: "active" | "maintenance" | "inactive";
    location: string;
    description: string;
}

export interface Seat {
    id: string;
    row: string;
    number: number;
    type: 'regular' | 'premium' | 'vip';
    price: number;
    isBooked: boolean;
}

const dummyTheaters: Theater[] = [
    {
        id: "TH001",
        name: "Theater A",
        capacity: 120,
        rows: 8,
        seatsPerRow: 15,
        status: "active",
        location: "Ground Floor",
        description: "Main theater with premium sound system"
    },
    {
        id: "TH002",
        name: "Theater B",
        capacity: 80,
        rows: 6,
        seatsPerRow: 14,
        status: "active",
        location: "First Floor",
        description: "Intimate theater for smaller audiences"
    },
    {
        id: "TH003",
        name: "Theater C",
        capacity: 100,
        rows: 7,
        seatsPerRow: 15,
        status: "maintenance",
        location: "Ground Floor",
        description: "Currently under maintenance"
    },
    {
        id: "TH004",
        name: "VIP Theater",
        capacity: 40,
        rows: 4,
        seatsPerRow: 10,
        status: "active",
        location: "Second Floor",
        description: "Premium VIP experience with recliner seats"
    }
];

export default function Theaters() {
    const [theaters, setTheaters] = useState<Theater[]>(dummyTheaters);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [editingTheater, setEditingTheater] = useState<Theater | null>(null);
    const [addingTheater, setAddingTheater] = useState(false);

    const filteredTheaters = theaters.filter(theater => {
        const matchesSearch = theater.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            theater.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === "all" || theater.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    const handleEdit = (theater: Theater) => {
        setEditingTheater(theater);
    };

    const handleBackToTheaters = () => {
        setEditingTheater(null);
        setAddingTheater(false);
    };

    const handleAddTheater = () => {
        setAddingTheater(true);
    };

    // If adding a theater, show the AddTheater component
    if (addingTheater) {
        return (
            <AddTheater onBack={handleBackToTheaters} />
        );
    }

    // If editing a theater, show the seat management view
    if (editingTheater) {
        return (
            <SeatManagementPopup
                theater={editingTheater}
                onBack={handleBackToTheaters}
            />
        );
    }

    // Otherwise show the theaters list
    return (
        <div className="flex flex-col gap-6 p-4 w-full">
            {/* Header */}
            <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Theater Management</h2>
                    <p className="text-slate-400">Manage your cinema theaters and seating layouts.</p>
                </div>
                <button
                    onClick={handleAddTheater}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform hover:scale-105"
                >
                    <PlusCircle className="w-4 h-4" />
                    Add Theater
                </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative flex-1 sm:flex-none sm:w-80">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search theaters..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full rounded-full border border-slate-700 bg-slate-800 px-10 py-2 text-white"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white text-sm"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Results count */}
            <div className="text-sm text-slate-400">
                {filteredTheaters.length} theater{filteredTheaters.length !== 1 ? 's' : ''} found
            </div>

            {/* Theaters Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredTheaters.length > 0 ? (
                    filteredTheaters.map((theater) => (
                        <TheaterCard
                            key={theater.id}
                            theater={theater}
                            onEdit={handleEdit}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-8">
                        <MapPin className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400 text-lg mb-2">No theaters found</p>
                        <p className="text-slate-500">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}