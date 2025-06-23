// This is the navbar for all page

import React from 'react';
import { Link } from 'react-router-dom';
import { Clapperboard, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gray-900 h-18 w-full mb-4 flex items-center overflow-hidden">
      <div className="flex items-center justify-between font-bold text-white w-full px-[20px] sm:px-[60px] md:px-[100px] lg:px-[180px]"> 
        <Link className="text-xl flex gap-2 " to="/"><Clapperboard/> Grand-Cineplex</Link>
        <Link className="text-xl hover:underline" to="/SignUp">Sign Up</Link>
      </div>
    </header>
  );
}
