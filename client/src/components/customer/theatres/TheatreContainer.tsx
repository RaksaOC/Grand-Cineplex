import React from 'react';
import TheatreCard from './TheatreCard';
import { MapPin } from "lucide-react";
import { TheatersData } from '../FakeData';

interface Props {
  movieId: number;
}

export default function TheatreContainer({ movieId }: Props) {
  return (
    <div className="flex flex-col gap-4 w-full lg:border-l border-gray-700 lg:pl-4 py-4">
      <div className="flex flex-row justify-start items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-sky-500" />
        <h1 className="text-xl font-bold text-white">Showing in Grand Cineplex CADT</h1>
      </div>

      <div className="space-y-4 lg:max-h-[600px] lg:overflow-y-auto pr-2 lg:scrollbar-thin lg:scrollbar-thumb-sky-500 lg:scrollbar-track-gray-800">
        {TheatersData.map((theatre) => (
          <TheatreCard 
            key={theatre.id} 
            name={theatre.name}
            cinema_id={theatre.cinema_id}
            created_at={theatre.created_at}
            updated_at={theatre.updated_at}
            movieId={movieId}
          />
        ))}
      </div>
    </div>
  );
}
