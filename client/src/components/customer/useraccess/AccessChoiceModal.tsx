import React from "react";
import { XCircle } from "lucide-react";

interface AccessChoiceModalProps {
  onClose: () => void;
  onGuestContinue: () => void;
  onSignUp: () => void;
}

const AccessChoiceModal = ({
  onClose,
  onGuestContinue,
  onSignUp,
}: AccessChoiceModalProps) => {
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-sm w-full p-6 shadow-2xl text-center relative">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          <XCircle className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-white mb-2">
          Continue as Guest or Sign Up?
        </h2>
        <p className="text-gray-400 mb-4">
          Choose how you'd like to proceed.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onGuestContinue}
            className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md font-semibold"
          >
            Continue as Guest
          </button>
          <button
            onClick={onSignUp}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md font-semibold"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessChoiceModal;
