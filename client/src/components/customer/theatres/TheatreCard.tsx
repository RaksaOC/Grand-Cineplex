import React, { useState } from 'react';
import { Clock, Users, LaptopMinimal, XCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import AccessChoiceModal from '../useraccess/AccessChoiceModal';

interface Props {
  name: string;
  cinema_id: number;
  created_at: string;
  updated_at: string;
  movieId: number;
}

export default function TheatreCard({
  name,
  cinema_id,
  created_at,
  updated_at,
  movieId
}: Props) {
  const navigate = useNavigate();
  const availableSeats = 40;
  const totalSeats = 60;
  const showtimes = ["8:00", "10:00", "12:00", "2:30", "5:00", "7:30"];

  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleShowtimeClick = (time: string) => {
    setSelectedTime(time);
    setShowPopup(true);
  };

  const handleGuestContinue = () => {
    navigate(`/seats/${movieId}/${cinema_id}/${selectedTime}`);
  };

  const handleSignUp = () => {
    navigate('/SignUp');
  };

  return (
    <>
      <div className="flex flex-col gap-4 border border-gray-700 rounded-lg p-6 text-white w-full bg-gray-900/50 hover:bg-gray-800/50 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LaptopMinimal className="w-5 h-5 text-sky-500" />
            <div>
              <h2 className="text-lg font-bold text-white">{name}</h2>
              <p className="text-sm text-gray-400">Cinema ID: {cinema_id}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-gray-800/50 rounded-md p-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-300">Available Seats</span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-500">{availableSeats}</p>
            <p className="text-xs text-gray-400">of {totalSeats} total</p>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-sky-500" />
            <h4 className="text-sm font-semibold text-gray-300">Showtimes</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {showtimes.map((time, index) => (
              <button
                key={index}
                onClick={() => handleShowtimeClick(time)}
                className="rounded-md border border-gray-600 px-3 py-2 text-sm font-medium text-gray-300 hover:border-sky-500 hover:text-sky-400 hover:bg-sky-500/10 transition-all duration-200"
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>

      {showPopup && (
        <AccessChoiceModal
          onClose={() => setShowPopup(false)}
          onGuestContinue={handleGuestContinue}
          onSignUp={handleSignUp}
        />
      )}
    </>
  );
}
