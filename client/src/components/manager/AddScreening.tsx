import React, { useState } from "react";
import { ArrowLeft, Calendar, Clock, Film, MapPin, DollarSign } from "lucide-react";

interface ScreeningFormData {
    movieId: string;
    theaterId: string;
    date: string;
    time: string;
    price: string;
    type: string;
}

interface Movie {
    id: string;
    title: string;
    duration: string;
    posterUrl: string;
}

interface Theater {
    id: string;
    name: string;
    capacity: number;
    location: string;
}

export default function AddScreening({ onBack }: { onBack: () => void }) {
    const [formData, setFormData] = useState<ScreeningFormData>({
        movieId: "",
        theaterId: "",
        date: "",
        time: "",
        price: "",
        type: "regular"
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Dummy data - replace with API calls
    const movies: Movie[] = [
        { id: "1", title: "The Dark Knight", duration: "2h 32m", posterUrl: "https://example.com/dark-knight.jpg" },
        { id: "2", title: "Inception", duration: "2h 28m", posterUrl: "https://example.com/inception.jpg" },
        { id: "3", title: "Interstellar", duration: "2h 49m", posterUrl: "https://example.com/interstellar.jpg" },
        { id: "4", title: "The Matrix", duration: "2h 16m", posterUrl: "https://example.com/matrix.jpg" }
    ];

    const theaters: Theater[] = [
        { id: "TH001", name: "Theater A", capacity: 120, location: "Ground Floor" },
        { id: "TH002", name: "Theater B", capacity: 80, location: "First Floor" },
        { id: "TH003", name: "Theater C", capacity: 100, location: "Ground Floor" },
        { id: "TH004", name: "VIP Theater", capacity: 40, location: "Second Floor" }
    ];

    const handleInputChange = (field: keyof ScreeningFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // TODO: Implement API call to add screening
        console.log("Adding screening:", formData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        onBack();
    };

    const selectedMovie = movies.find(m => m.id === formData.movieId);
    const selectedTheater = theaters.find(t => t.id === formData.theaterId);

    const screeningTypes = [
        { value: "regular", label: "Regular", price: 12.50 },
        { value: "3d", label: "3D", price: 15.00 },
        { value: "imax", label: "IMAX", price: 18.00 },
        { value: "vip", label: "VIP", price: 25.00 }
    ];

    const timeSlots = [
        "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
        "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
    ];

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
                        Back to Screenings
                    </button>
                </div>
                <div className="flex flex-col items-end">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Add New Screening</h2>
                    <p className="text-slate-400">Schedule a movie showing</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Movie Selection */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Film className="w-5 h-5" />
                                Select Movie
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Movie *
                                    </label>
                                    <select
                                        required
                                        value={formData.movieId}
                                        onChange={(e) => handleInputChange('movieId', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="">Select a movie</option>
                                        {movies.map(movie => (
                                            <option key={movie.id} value={movie.id}>
                                                {movie.title} ({movie.duration})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Selected Movie Preview */}
                                {selectedMovie && (
                                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                        <div className="flex items-center gap-3">
                                            <div className="w-16 h-24 bg-slate-700 rounded overflow-hidden">
                                                <img
                                                    src={selectedMovie.posterUrl}
                                                    alt={selectedMovie.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.style.display = 'none';
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <h4 className="text-white font-semibold">{selectedMovie.title}</h4>
                                                <p className="text-slate-400 text-sm">Duration: {selectedMovie.duration}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Theater Selection */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Select Theater
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Theater *
                                    </label>
                                    <select
                                        required
                                        value={formData.theaterId}
                                        onChange={(e) => handleInputChange('theaterId', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="">Select a theater</option>
                                        {theaters.map(theater => (
                                            <option key={theater.id} value={theater.id}>
                                                {theater.name} - {theater.location} ({theater.capacity} seats)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Selected Theater Info */}
                                {selectedTheater && (
                                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                        <h4 className="text-white font-semibold">{selectedTheater.name}</h4>
                                        <p className="text-slate-400 text-sm">{selectedTheater.location}</p>
                                        <p className="text-slate-400 text-sm">Capacity: {selectedTheater.capacity} seats</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Date & Time */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Date & Time
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => handleInputChange('date', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Time *
                                    </label>
                                    <select
                                        required
                                        value={formData.time}
                                        onChange={(e) => handleInputChange('time', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="">Select time</option>
                                        {timeSlots.map(time => (
                                            <option key={time} value={time}>{time}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Screening Preview */}
                                {formData.date && formData.time && (
                                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(formData.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-300 mt-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{formData.time}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Pricing & Type */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5" />
                                Pricing & Type
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Screening Type *
                                    </label>
                                    <select
                                        required
                                        value={formData.type}
                                        onChange={(e) => handleInputChange('type', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                    >
                                        {screeningTypes.map(type => (
                                            <option key={type.value} value={type.value}>
                                                {type.label} - ${type.price}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Custom Price (Optional)
                                    </label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => handleInputChange('price', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="Leave empty to use default price"
                                    />
                                </div>

                                {/* Price Preview */}
                                {formData.type && (
                                    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                                        <div className="flex items-center justify-between">
                                            <span className="text-slate-300">Ticket Price:</span>
                                            <span className="text-white font-semibold text-lg">
                                                ${formData.price || screeningTypes.find(t => t.value === formData.type)?.price}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
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
                                <Calendar className="w-4 h-4" />
                                Add Screening
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
