import React, { useEffect, useState } from "react";
import {
	ArrowLeft,
	Calendar,
	Clock,
	Film,
	MapPin,
	DollarSign,
} from "lucide-react";
import { addScreening, getAllMovies, getTheaters } from "../../api/manager";

interface ScreeningFormData {
	movieId: string;
	theaterId: string;
	screeningDate: string;
	screeningTime: string;
	regularSeatPrice: number;
	premiumSeatPrice: number;
	vipSeatPrice: number;
	type?: string;
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
	cinemaId?: number;
	capacity?: number;
	location?: string;
}

export default function AddScreening({ onBack }: { onBack: () => void }) {
	const [formData, setFormData] = useState<ScreeningFormData>({
		movieId: "",
		theaterId: "",
		screeningDate: "",
		screeningTime: "",
		regularSeatPrice: 5,
		premiumSeatPrice: 8,
		vipSeatPrice: 10,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);

	const [movies, setMovies] = useState<Movie[]>([]);
	const [theaters, setTheaters] = useState<Theater[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const movies = await getAllMovies();
				const theaters = await getTheaters();
				setMovies(movies);
				setTheaters(theaters);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	const handleInputChange = (
		field: keyof ScreeningFormData,
		value: string | number
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			await addScreening(formData);
		} catch (error) {
			console.error("Error adding screening:", error);
		} finally {
			setIsSubmitting(false);
			onBack();
		}
	};

	const selectedMovie = movies.find((m) => m.id === formData.movieId);
	const selectedTheater = theaters.find((t) => t.id === formData.theaterId);
	
	const timeSlots = [
		"09:00",
		"10:00",
		"11:00",
		"12:00",
		"13:00",
		"14:00",
		"15:00",
		"16:00",
		"17:00",
		"18:00",
		"19:00",
		"20:00",
		"21:00",
		"22:00",
	];

	return (
		<div className="flex flex-col gap-6 w-full">
			{/* Header */}
			<div className="flex flex-col">
				<div className="flex items-center gap-4">
					<button
						onClick={onBack}
						className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
						Back to Screenings
					</button>
				</div>
			</div>
			<div className="flex flex-col ">
				<h2 className="text-2xl font-bold tracking-tight text-white">
					Add New Screening
				</h2>
				<p className="text-slate-400">Schedule a movie showing</p>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="flex flex-col gap-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Left Column */}
					<div className="space-y-6">
						{/* Movie Selection */}
						<div className="bg-gray-950 border border-slate-800 rounded-lg p-6">
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
										onChange={(e) =>
											handleInputChange(
												"movieId",
												e.target.value
											)
										}
										className="w-full rounded-lg border border-slate-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
									>
										<option value="">Select a movie</option>
										{movies.map((movie) => (
											<option
												key={movie.id}
												value={movie.id}
											>
												{movie.title} ({movie.duration + " min"})
											</option>
										))}
									</select>
								</div>

								{/* Selected Movie Preview */}
								{selectedMovie && (
									<div className="bg-gray-900/50 rounded-lg p-4 border border-slate-700">
										<div className="flex items-center gap-3">
											<div className="w-16 h-24 bg-slate-700 rounded overflow-hidden">
												<img
													src={
														selectedMovie.posterUrl
													}
													alt={selectedMovie.title}
													className="w-full h-full object-cover"
													onError={(e) => {
														e.currentTarget.style.display =
															"none";
													}}
												/>
											</div>
											<div>
												<h4 className="text-white font-semibold">
													{selectedMovie.title}
												</h4>
												<p className="text-slate-400 text-sm">
													Duration: {selectedMovie.duration}
												</p>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Theater Selection */}
						<div className="bg-gray-950 border border-slate-800 rounded-lg p-6">
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
										onChange={(e) =>
											handleInputChange(
												"theaterId",
												e.target.value
											)
										}
										className="w-full rounded-lg border border-slate-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
									>
										<option value="">
											Select a theater
										</option>
										{theaters.map((theater) => (
											<option
												key={theater.id}
												value={theater.id}
											>
												{theater.name} - {theater.location} ({theater.capacity} seats)
											</option>
										))}
									</select>
								</div>

								{/* Selected Theater Info */}
								{selectedTheater && (
									<div className="bg-gray-900/50 rounded-lg p-4 border border-slate-700">
										<h4 className="text-white font-semibold">
											{selectedTheater.name}
										</h4>
										<p className="text-slate-400 text-sm">
											{selectedTheater.location}
										</p>
										<p className="text-slate-400 text-sm">
											Capacity: {selectedTheater.capacity} seats
										</p>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* Right Column */}
					<div className="space-y-6">
						{/* Date & Time */}
						<div className="bg-gray-950 border border-slate-800 rounded-lg p-6">
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
										value={formData.screeningDate}
										onChange={(e) =>
											handleInputChange(
												"screeningDate",
												e.target.value
											)
										}
										min={
											new Date()
												.toISOString()
												.split("T")[0]
										}
										className="w-full rounded-lg border border-slate-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">
										Time *
									</label>
									<select
										required
										value={formData.screeningTime}
										onChange={(e) =>
											handleInputChange(
												"screeningTime",
												e.target.value
											)
										}
										className="w-full rounded-lg border border-slate-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
									>
										<option value="">Select time</option>
										{timeSlots.map((time) => (
											<option key={time} value={time}>
												{time}
											</option>
										))}
									</select>
								</div>

								{/* Screening Preview */}
								{formData.screeningDate && formData.screeningTime && (
									<div className="bg-gray-900/50 rounded-lg p-4 border border-slate-700">
										<div className="flex items-center gap-2 text-slate-300">
											<Calendar className="w-4 h-4" />
											<span>
												{new Date(
													formData.screeningDate
												).toLocaleDateString()}
											</span>
										</div>
										<div className="flex items-center gap-2 text-slate-300 mt-1">
											<Clock className="w-4 h-4" />
											<span>{formData.screeningTime}</span>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Pricing */}
						<div className="bg-gray-950 border border-slate-800 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
								<DollarSign className="w-5 h-5" />
								Pricing
							</h3>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">
										Regular Seat Price *
									</label>
									<input
										type="number"
										step="0.01"
										min="0"
										required
										value={formData.regularSeatPrice}
										onChange={(e) =>
											handleInputChange(
												"regularSeatPrice",
												Number(e.target.value)
											)
										}
										className="w-full rounded-lg border border-slate-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
										placeholder="e.g., 12.50"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">
										Premium Seat Price *
									</label>
									<input
										type="number"
										step="0.01"
										min="0"
										required
										value={formData.premiumSeatPrice}
										onChange={(e) =>
											handleInputChange(
												"premiumSeatPrice",
												Number(e.target.value)
											)
										}
										className="w-full rounded-lg border border-slate-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
										placeholder="e.g., 15.00"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">
										VIP Seat Price *
									</label>
									<input
										type="number"
										step="0.01"
										min="0"
										required
										value={formData.vipSeatPrice}
										onChange={(e) =>
											handleInputChange(
												"vipSeatPrice",
												Number(e.target.value)
											)
										}
										className="w-full rounded-lg border border-slate-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
										placeholder="e.g., 25.00"
									/>
								</div>

								{/* Price Preview */}
								<div className="bg-gray-900/50 rounded-lg p-4 border border-slate-700">
									<h4 className="text-white font-semibold mb-3">Price Summary</h4>
									<div className="space-y-2">
										<div className="flex items-center justify-between">
											<span className="text-slate-300 text-sm">Regular Seats:</span>
											<span className="text-white font-semibold">${formData.regularSeatPrice}</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-slate-300 text-sm">Premium Seats:</span>
											<span className="text-white font-semibold">${formData.premiumSeatPrice}</span>
										</div>
										<div className="flex items-center justify-between">
											<span className="text-slate-300 text-sm">VIP Seats:</span>
											<span className="text-white font-semibold">${formData.vipSeatPrice}</span>
										</div>
									</div>
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
						className="px-6 py-2 bg-gray-900/50 hover:bg-gray-900/50 text-white font-semibold rounded-lg transition"
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
