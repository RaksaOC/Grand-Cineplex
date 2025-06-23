import React from "react";
import { Clock, Calendar, Star, Film, Globe, Play } from "lucide-react";

interface MovieSelectedProps {
  movie: {
    title: string;
    release_date: string;
    duration: string;
    poster_url: string;
    genre: string;
    description: string;
    rating: number;
    language: string;
    trailer_url: string;
  };
}

export default function MovieSelectedCard({ movie }: MovieSelectedProps) {
  const handlePlayClick = () => {
    window.open(movie.trailer_url, "_blank");
  };

  return (
    <div className="w-full h-full">
      <div className="flex flex-row lg:flex-col gap-4 items-center lg:items-start justify-start lg:justify-start border-b border-gray-700 lg:border-b-0 lg:border-gray-700 lg:pr-4 pb-4 pt-4 lg:pb-0">
        <div className="relative">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="lg:w-full w-[150px] lg:h-auto object-cover rounded-md flex-shrink-0"
          />
          <button
            onClick={handlePlayClick}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-500 text-white w-10 h-10 flex items-center justify-center rounded-full transition"
          >
            <Play size={18} />
          </button>
        </div>

        <div className="flex-1 lg:flex-none w-full flex flex-col gap-4 text-white">
          <h1 className="text-xl font-bold">{movie.title}</h1>

          <div className="flex flex-col lg:flex-col gap-2">

            <div className="flex items-center gap-2 text-yellow-400">
              <Star className="w-4 h-4" />
              <p className="text-sm">{movie.rating}</p>
            </div>

            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <p className="text-sm">{movie.duration}</p>
            </div>

            <div className="flex items-center gap-2 text-red-600">
              <Film className="w-4 h-4" />
              <p className="text-sm">{movie.genre}</p>
            </div>

            <div className="flex items-center gap-2 text-blue-400">
              <Calendar className="w-4 h-4" />
              <p className="text-sm">{movie.release_date}</p>
            </div>

            <div className="flex items-center gap-2 text-green-400">
              <Globe className="w-4 h-4" />
              <p className="text-sm">{movie.language}</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
