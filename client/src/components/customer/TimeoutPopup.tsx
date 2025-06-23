import React from "react";
import { XCircle } from "lucide-react";

interface TimeoutPopupProps {
  onClose?: () => void;
}

const TimeoutPopup = ({ onClose }: TimeoutPopupProps) => (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-gray-800 border border-red-600 text-center px-8 py-6 rounded-xl max-w-sm shadow-xl">
      <XCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
      <h2 className="text-xl font-bold text-white mb-2">Session Timeout</h2>
      <p className="text-gray-300 text-sm mb-4">
        You took too long to decided . Returning to previous page...
      </p>
      <p className="text-sm text-gray-500 italic">Redirecting in 3 seconds</p>
    </div>
  </div>
);

export default TimeoutPopup;
