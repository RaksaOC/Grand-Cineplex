import React, { useEffect, useState } from "react";
import { ArrowLeft, Upload, Play, Film } from "lucide-react";
import { getMoviePosterPresignedUrl, updateMovie } from "../../api/manager";

type MovieData = {
	id: number;
	title: string;
	description: string;
	posterUrl: string;
	trailerUrl: string;
	duration: string;
	genre: string;
	rating: number;
	releaseDate: string;
	director: string;
	cast: string;
	language: string;
};

type EditMovieProps = {
	onBack: () => void;
	movie: MovieData;
};
export default function EditMovie({ onBack, movie }: EditMovieProps) {
	const [formData, setFormData] = useState<MovieData>({ ...movie });

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [posterFile, setPosterFile] = useState<File | null>(null);
	const [posterPreviewUrl, setPosterPreviewUrl] = useState<string | null>(
		null
	);

	useEffect(() => {
		if (!posterFile) {
			setPosterPreviewUrl(null);
			return;
		}
		const objectUrl = URL.createObjectURL(posterFile);
		setPosterPreviewUrl(objectUrl);
		return () => URL.revokeObjectURL(objectUrl);
	}, [posterFile]);

	const handleInputChange = (field: keyof MovieData, value: string) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		const isTextFieldsUnchanged =
			JSON.stringify(formData) === JSON.stringify(movie);

		// Guard against no-op updates (including poster file selection)
		if (isTextFieldsUnchanged && !posterFile) {
			alert("Please change at least one field to edit the movie.");
			setIsSubmitting(false);
			return;
		}

		let didSucceed = false;
		try {
			let posterUrlToSave = formData.posterUrl;

			if (posterFile) {
				const presigned = await getMoviePosterPresignedUrl({
					movieId: formData.id,
					fileName: posterFile.name,
					contentType: posterFile.type,
				});

				const uploadResp = await fetch(presigned.uploadUrl, {
					method: "PUT",
					headers: {
						"Content-Type":
							posterFile.type || "application/octet-stream",
					},
					body: posterFile,
				});

				if (!uploadResp.ok) {
					throw new Error(
						`S3 upload failed: ${uploadResp.status}`
					);
				}

				posterUrlToSave = presigned.posterUrl;
			}

			await updateMovie({
				...formData,
				posterUrl: posterUrlToSave,
			});
			didSucceed = true;
		} catch (error) {
			console.error("Error updating movie with poster upload:", error);
			alert("Failed to update movie. Please try again.");
		} finally {
			setIsSubmitting(false);
		}

		if (didSucceed) onBack();
	};

	const genres = [
		"Action",
		"Adventure",
		"Comedy",
		"Drama",
		"Horror",
		"Romance",
		"Sci-Fi",
		"Thriller",
		"Documentary",
		"Animation",
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
						Back to Movies
					</button>
				</div>
			</div>
			<div className="flex flex-col">
				<h2 className="text-2xl font-bold tracking-tight text-white">
					Edit Movie
				</h2>
				<p className="text-slate-400">Update movie information</p>
			</div>

			{/* Form */}
			<form onSubmit={handleSubmit} className="flex flex-col gap-6">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Left Column */}
					<div className="space-y-6">
						{/* Basic Info */}
						<div className="bg-gray-950 border border-slate-800 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
								<Film className="w-5 h-5" />
								Basic Information
							</h3>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">
										Movie Title
									</label>
									<input
										type="text"
										value={formData.title}
										onChange={(e) =>
											handleInputChange(
												"title",
												e.target.value
											)
										}
										className="w-full rounded-lg border border-slate-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
										placeholder="Enter movie title"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">
										Description
									</label>
									<textarea
										rows={4}
										value={formData.description}
										onChange={(e) =>
											handleInputChange(
												"description",
												e.target.value
											)
										}
										className="w-full rounded-lg border border-slate-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
										placeholder="Enter movie description"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">
										Duration (minutes)
									</label>
									<input
										type="number"
										value={formData.duration}
										onChange={(e) =>
											handleInputChange(
												"duration",
												e.target.value
											)
										}
										className="w-full rounded-lg border border-slate-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
										placeholder="e.g., 120"
									/>
								</div>
							</div>
						</div>
					</div>

					{/* Right Column */}
					<div className="space-y-6">
						{/* Media */}
						<div className="bg-gray-950 border border-slate-800 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-white mb-4">
								Media
							</h3>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">
										Poster Image
									</label>
									<div className="relative">
										<input
											type="file"
											accept="image/*"
											onChange={(e) => {
												const file =
													e.target.files?.[0] ||
													null;
												setPosterFile(file);
											}}
											className="w-full rounded-lg border border-slate-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none file:mr-4 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-sm file:bg-gray-800 file:text-white"
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
											onChange={(e) =>
												handleInputChange(
													"trailerUrl",
													e.target.value
												)
											}
											className="w-full rounded-lg border border-slate-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
											placeholder="https://youtube.com/watch?v=..."
										/>
										<Play className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
									</div>
								</div>

								{/* Poster Preview */}
								{(posterPreviewUrl || formData.posterUrl) && (
									<div className="mt-4">
										<label className="block text-sm font-medium text-slate-300 mb-2">
											Poster Preview
										</label>
										<div className="w-32 h-48 bg-gray-900/50 rounded-lg overflow-hidden border border-slate-700">
											<img
												src={
													posterPreviewUrl ||
													formData.posterUrl
												}
												alt="Poster preview"
												className="w-full h-full object-cover"
												onError={(e) => {
													e.currentTarget.style.display =
														"none";
												}}
											/>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* Details */}
						<div className="bg-gray-950 border border-slate-800 rounded-lg p-6">
							<h3 className="text-lg font-semibold text-white mb-4">
								Details
							</h3>

							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">
										Genre
									</label>
									<select
										value={formData.genre}
										onChange={(e) =>
											handleInputChange(
												"genre",
												e.target.value
											)
										}
										className="w-full rounded-lg border border-slate-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
									>
										<option value="">Select genre</option>
										{genres.map((genre) => (
											<option key={genre} value={genre}>
												{genre}
											</option>
										))}
									</select>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">
										Rating
									</label>
									<input
										type="number"
										step="0.1"
										min="0"
										max="10"
										value={formData.rating}
										onChange={(e) =>
											handleInputChange(
												"rating",
												e.target.value
											)
										}
										className="w-full rounded-lg border border-slate-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
										placeholder="e.g., 7.5"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-slate-300 mb-2">
										Release Date
									</label>
									<input
										type="date"
										value={formData.releaseDate}
										onChange={(e) =>
											handleInputChange(
												"releaseDate",
												e.target.value
											)
										}
										className="w-full rounded-lg border border-slate-700 bg-gray-900/50 px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
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
								Updating...
							</>
						) : (
							<>
								<Film className="w-4 h-4" />
								Update Movie
							</>
						)}
					</button>
				</div>
			</form>
		</div>
	);
}
