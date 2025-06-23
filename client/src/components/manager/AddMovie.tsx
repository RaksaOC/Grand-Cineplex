import React, { useState } from "react";
import { ArrowLeft, Upload, Play, Calendar, Clock, Star, Film } from "lucide-react";

interface MovieFormData {
    title: string;
    description: string;
    posterUrl: string;
    trailerUrl: string;
    duration: string;
    genre: string;
    rating: string;
    releaseDate: string;
    director: string;
    cast: string;
    language: string;
}

export default function AddMovie({ onBack }: { onBack: () => void }) {
    const [formData, setFormData] = useState<MovieFormData>({
        title: "",
        description: "",
        posterUrl: "",
        trailerUrl: "",
        duration: "",
        genre: "",
        rating: "",
        releaseDate: "",
        director: "",
        cast: "",
        language: ""
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (field: keyof MovieFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // TODO: Implement API call to add movie
        console.log("Adding movie:", formData);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsSubmitting(false);
        onBack();
    };

    const genres = [
        "Action", "Adventure", "Comedy", "Drama", "Horror",
        "Romance", "Sci-Fi", "Thriller", "Documentary", "Animation"
    ];

    const ratings = ["G", "PG", "PG-13", "R", "NC-17"];

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
                        Back to Movies
                    </button>
                </div>
                <div className="flex flex-col items-end">
                    <h2 className="text-2xl font-bold tracking-tight text-white">Add New Movie</h2>
                    <p className="text-slate-400">Create a new movie entry</p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-6">
                        {/* Basic Info */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <Film className="w-5 h-5" />
                                Basic Information
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Movie Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="Enter movie title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Description *
                                    </label>
                                    <textarea
                                        required
                                        rows={4}
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="Enter movie description"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Duration *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.duration}
                                            onChange={(e) => handleInputChange('duration', e.target.value)}
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="e.g., 2h 15m"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Language *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.language}
                                            onChange={(e) => handleInputChange('language', e.target.value)}
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="e.g., English"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cast & Crew */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Cast & Crew</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Director *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.director}
                                        onChange={(e) => handleInputChange('director', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="Enter director name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Cast
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={formData.cast}
                                        onChange={(e) => handleInputChange('cast', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                        placeholder="Enter main cast members (comma separated)"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Media */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Media</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Poster Image URL *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="url"
                                            required
                                            value={formData.posterUrl}
                                            onChange={(e) => handleInputChange('posterUrl', e.target.value)}
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="https://example.com/poster.jpg"
                                        />
                                        <Upload className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Trailer URL
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="url"
                                            value={formData.trailerUrl}
                                            onChange={(e) => handleInputChange('trailerUrl', e.target.value)}
                                            className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="https://youtube.com/watch?v=..."
                                        />
                                        <Play className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    </div>
                                </div>

                                {/* Poster Preview */}
                                {formData.posterUrl && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-slate-300 mb-2">
                                            Poster Preview
                                        </label>
                                        <div className="w-32 h-48 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                                            <img
                                                src={formData.posterUrl}
                                                alt="Poster preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Details */}
                        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Details</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Genre *
                                    </label>
                                    <select
                                        required
                                        value={formData.genre}
                                        onChange={(e) => handleInputChange('genre', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="">Select genre</option>
                                        {genres.map(genre => (
                                            <option key={genre} value={genre}>{genre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Rating *
                                    </label>
                                    <select
                                        required
                                        value={formData.rating}
                                        onChange={(e) => handleInputChange('rating', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                    >
                                        <option value="">Select rating</option>
                                        {ratings.map(rating => (
                                            <option key={rating} value={rating}>{rating}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">
                                        Release Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.releaseDate}
                                        onChange={(e) => handleInputChange('releaseDate', e.target.value)}
                                        className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                    />
                                </div>
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
                                <Film className="w-4 h-4" />
                                Add Movie
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
