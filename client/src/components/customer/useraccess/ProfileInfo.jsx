import React from "react";
import { getInitials } from "../support";

// Show the user profile

export const ProfileInfo = ({ onLogout }) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full font-medium bg-slate-600">
        {getInitials("Ra Fat")}
      </div>
      <div>
        <p className="text-sm font-medium">RaFat</p>
        <button className="text-sm underline cursor-pointer" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};
