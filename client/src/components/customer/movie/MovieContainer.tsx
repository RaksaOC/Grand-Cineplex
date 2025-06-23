import React, { useState, useEffect, useRef } from "react";
<<<<<<< HEAD:client/src/components/MovieContainer.tsx
import MovieCard from "../components/MovieCard";
import { currentShow, upcomingShow } from "../utils/FakeData"; // Assuming you have upcomingShow as well
=======
import MovieCard from "./MovieCard";
import { currentShow, upcomingShowJune } from "../FakeData";
>>>>>>> origin/Jack:client/src/components/movie/MovieContainer.tsx

export interface Movie {
  id: number;
  title: string;
  release_date: string;
  duration: string;
  poster_url: string;
  genre: string;
  description: string;
  rating: number;
  language: string;
  trailer_url: string;
}

interface MovieContainerProps {
  searchTerm: string;
  activeTab: "now" | "upcoming";
}

const MovieContainer: React.FC<MovieContainerProps> = ({ searchTerm, activeTab }) => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const noResultTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        setIsError(null);

        // Simulate 0.5s loading delay
        setTimeout(() => {
          if (activeTab === "now") {
            setAllMovies(currentShow);
            setMovieList(currentShow);
          } else {
            setAllMovies(upcomingShowJune);
            setMovieList(upcomingShowJune);
          }
          setIsLoading(false);
        }, 500);
      } catch (error: any) {
        setIsError(error.message || "Failed to load movies");
        setAllMovies([]);
        setMovieList([]);
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [activeTab]);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (noResultTimeout.current) clearTimeout(noResultTimeout.current);

    setShowNoResults(false);

    const trimmedTerm = searchTerm.trim().toLowerCase();

    if (trimmedTerm === "") {
      setIsSearching(false);
      setMovieList(allMovies);
      return;
    }

    const filtered = allMovies.filter((movie) =>
      movie.title.toLowerCase().includes(trimmedTerm)
    );

    if (filtered.length > 0) {
      setIsSearching(false);
      setMovieList(filtered);
    } else {
      setIsSearching(true);
      setMovieList([]);

      noResultTimeout.current = setTimeout(() => {
        setIsSearching(false);
        setShowNoResults(true);
      }, 2000);
    }
  }, [searchTerm, allMovies]);

  
  if (isLoading || isSearching) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white text-sm">
            {isSearching ? "Searching movies..." : "Loading movies..."}
          </p>
        </div>
      </div>
    );
  }

  if (isError) return <p className="text-red-500">Error: {isError}</p>;

  return (
    <div className="grid gap-5 custom-cols">
      {showNoResults ? (
        <p className="text-white text-lg">No movies found.</p>
      ) : (
        movieList.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            releaseDate={movie.release_date}
            duration={movie.duration}
            image={movie.poster_url}
          />
        ))
      )}
    </div>
  );
};

export default MovieContainer;
