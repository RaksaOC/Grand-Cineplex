import React, { useState } from "react";
import { ArrowLeft, MapPin, Users, Sofa, Monitor, Settings } from "lucide-react";

interface TheaterFormData {
    name: string;
    location: string;
    description: string;
    rows: number;
    seatsPerRow: number;
    status: string;
}

export default function AddTheater({ onBack }: { onBack: () => void }) {
    const [formData, setFormData] = useState<TheaterFormData>({
        name: "",
        location: "",
        description: "",
        rows: 8,
        seatsPerRow: 15,
        status: "active"
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: keyof TheaterFormData, value: string | number) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // TODO: Implement API call to add theater
        console.log("Adding theater:", formData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        onBack();
    };

    const statusOptions = [
        { value: "active", label: "Active", color: "text-green-400" },
        { value: "maintenance", label: "Maintenance", color: "text-yellow-400" },
        { value: "inactive", label: "Inactive", color: "text-red-400" }
    ];

    // Calculate capacity
    const capacity = formData.rows * formData.seatsPerRow;

    // Generate seat preview
    const generateSeatPreview = () => {
        const seats: React.ReactElement[] = [];
        const rows = Array.from({ length: Math.min(formData.rows, 6) }, (_, i) => String.fromCharCode(65 + i)); // Show max 6 rows for preview

        rows.forEach((row, rowIndex) => {
            const rowSeats: React.ReactElement[] = [];
            const seatsToShow = Math.min(formData.seatsPerRow, 12); // Show max 12 seats per row for preview

            for (let i = 1; i <= seatsToShow; i++) {
                let type: 'regular' | 'premium' | 'vip' = 'regular';

                // Premium seats (middle rows)
                if (rowIndex >= Math.floor(formData.rows / 3) && rowIndex <= Math.floor(2 * formData.rows / 3)) {
                    type = 'premium';
                }

                // VIP seats (front row)
                if (rowIndex === 0) {
                    type = 'vip';
                }

                rowSeats.push(
                    <div
                        key={`${row}${i}`}
                        className={`w-3 h-3 rounded-full flex items-center justify-center text-xs ${getSeatStyle(type)}`}
                        title={`${row}${i} - ${type}`}
                    >
                        <Sofa className="w-2 h-2" />
                    </div>
                );
            }

            seats.push(
                <div key={row} className="flex gap-1 items-center">
                    <span className="w-4 text-center font-semibold text-slate-400 text-xs">{row}</span>
                    <div className="flex gap-0.5">
                        {rowSeats}
                    </div>
                </div>
            );
        });

        return seats;
    };

    const getSeatStyle = (type: 'regular' | 'premium' | 'vip') => {
        switch (type) {
            case 'vip':
                return 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black';
            case 'premium':
                return 'bg-gradient-to-br from-purple-500 to-purple-600 text-white';
            default:
                return 'bg-gradient-to-br from-gray-600 to-gray-700 text-white';
        }
    };

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
                <div className="flex flex-col items-end">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Add New Theater</h2>
                    <p className="text-slate-400">Create a new theater with seating layout</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Basic Information */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Theater Information
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Theater Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="Enter theater name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="e.g., Ground Floor, First Floor"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="Enter theater description"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Status *
                                    </label>
                                    <select
                                        required
                                        value={formData.status}
                                        onChange={(e) => handleInputChange('status', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                    >
                                        {statusOptions.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Seating Configuration */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Sofa className="w-5 h-5" />
                                Seating Configuration
                            </h3>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Number of Rows *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            max="20"
                                            value={formData.rows}
                                            onChange={(e) => handleInputChange('rows', parseInt(e.target.value))}
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Seats per Row *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            max="30"
                                            value={formData.seatsPerRow}
                                            onChange={(e) => handleInputChange('seatsPerRow', parseInt(e.target.value))}
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Capacity Display */}
                                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-5 h-5 text-slate-400" />
                                            <span className="text-slate-300">Total Capacity:</span>
                                        </div>
                                        <span className="text-white font-bold text-xl">{capacity} seats</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Layout Preview */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Monitor className="w-5 h-5" />
                                Layout Preview
                            </h3>

                            <div className="space-y-4">
                                {/* Screen */}
                                <div className="relative">
                                    <div className="w-full h-8 bg-gradient-to-b from-gray-300 to-gray-500 mx-auto rounded-lg flex items-center justify-center text-gray-700 font-semibold shadow-lg">
                                        <Monitor className="w-4 h-4 mr-2" />
                                        SCREEN
                                    </div>
                                    <div className="absolute inset-x-0 top-8 h-2 bg-gradient-to-b from-gray-300/20 to-transparent"></div>
                                </div>

                                {/* Seat Grid Preview */}
                                <div className="flex flex-col items-center gap-2">
                                    {generateSeatPreview()}
                                </div>

                                {/* Preview Info */}
                                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-slate-400">Rows:</span>
                                            <span className="text-white ml-2">{formData.rows}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">Seats/Row:</span>
                                            <span className="text-white ml-2">{formData.seatsPerRow}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">Capacity:</span>
                                            <span className="text-white ml-2">{capacity}</span>
                                        </div>
                                        <div>
                                            <span className="text-slate-400">Status:</span>
                                            <span className={`ml-2 ${statusOptions.find(s => s.value === formData.status)?.color}`}>
                                                {statusOptions.find(s => s.value === formData.status)?.label}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Seat Legend */}
                                <div className="flex flex-wrap justify-center gap-4 text-xs">
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-gradient-to-br from-gray-600 to-gray-700 rounded"></div>
                                        <span className="text-slate-300">Regular</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded"></div>
                                        <span className="text-slate-300">Premium</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <div className="w-3 h-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded"></div>
                                        <span className="text-slate-300">VIP</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Theater Preview */}
                        {formData.name && (
                            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Theater Preview</h3>

                                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                                            <MapPin className="w-6 h-6 text-slate-400" />
                                        </div>
                                        <div>
                                            <h4 className="text-white font-semibold">{formData.name}</h4>
                                            <p className="text-slate-400 text-sm">{formData.location}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Users className="w-4 h-4 text-slate-400" />
                                            <span>Capacity: {capacity} seats</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Sofa className="w-4 h-4 text-slate-400" />
                                            <span>Layout: {formData.rows} rows × {formData.seatsPerRow} seats</span>
                                        </div>
                                        {formData.description && (
                                            <p className="text-slate-400 text-sm">{formData.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end pt-6 border-t border-slate-800">
                    <button
                        type="button"
                        onClick={onBack}
                        className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold rounded-lg transition flex items-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Adding...
                            </>
                        ) : (
                            <>
                                <MapPin className="w-4 h-4" />
                                Add Theater
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
