import React, { useState, useEffect, useRef } from "react";
import MovieCard from "./MovieCard";
import { currentShow, upcomingShowJune } from "../../utils/FakeData";

export interface Movie {
  id: number;
  title: string;
  releaseDate: string;
  duration: string;
  image: string;
  genre: string;
  overview: string;
  rating: number;
  director: string;
  cast: string;
  language: string;
}

interface MovieContainerProps {
  searchTerm: string;
  activeTab: "now" | "upcoming";
}

export default function MovieContainer({ searchTerm, activeTab }: MovieContainerProps) {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

        // Load movies based on activeTab
        if (activeTab === "now") {
          setAllMovies(currentShow);
          setMovieList(currentShow);
        } else {
          setAllMovies(upcomingShow);
          setMovieList(upcomingShow);
        }
      } catch (error: any) {
        setIsError(error.message || "Failed to load movies");
        setAllMovies([]);
        setMovieList([]);
      } finally {
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
      }, 3000);
    }
  }, [searchTerm, allMovies]);

  if (isLoading) return <p className="text-white">Loading movies...</p>;
  if (isError) return <p className="text-red-500">Error: {isError}</p>;
  if (isSearching) return <p className="text-white">Searching movies...</p>;

  return (
    <div className="grid w-full gap-5 custom-cols mt-4 px-4">
      {showNoResults ? (
        <p className="text-white">No movies found.</p>
      ) : (
        movieList.map((movie) => (
          <MovieCard
            key={movie.id}
            id={movie.id}
            title={movie.title}
            releaseDate={movie.releaseDate}
            duration={movie.duration}
            image={movie.image}
          />
        ))
      )}
    </div>
  );
};
