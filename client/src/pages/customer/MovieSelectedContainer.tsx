import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { currentShow, upcomingShowJune } from "../components/FakeData";
import Header from "../components/homecomponents/Header";
import Footer from "../components/Footer";
import MovieSelectedCard from "../components/movie/MovieSelectedCard";
import TheatreContainer from "../components/theatres/TheatreContainer";
import LoadingSpinner from "../components/LoadingSpinner";


interface Movie {
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

export default function MovieChosen() {
  const { id } = useParams<{ id: string }>();

  const movie: Movie | undefined =
    currentShow.find((m) => m.id === Number(id)) ||
    upcomingShowJune.find((m) => m.id === Number(id));

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!movie) {
    return <p className="text-white p-4">Movie not found</p>;
  }

  return (
    <div className="min-h-screen bg-[#171c20] text-white">
      <Header />
      <div className="px-[20px] sm:px-[60px] md:px-[100px] lg:px-[180px] py-6">   
        <div className="relative flex flex-row justify-center items-start gap-4 ">
          <div className="wrapper relative max-w-7xl w-full flex lg:flex-row gap-4 flex-col">
            <div className="w-full lg:w-80  lg:top-22 lg:left-0 lg:h-full flex-shrink-0 z-10">
              <MovieSelectedCard movie={movie} />
            </div> 
            <div className="flex-1">
              <TheatreContainer movieId={movie.id} />
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

