import React from 'react';
import { Send } from 'lucide-react';

const SubmitButton = ({ isLoading, errors, setIsSubmitClicked, isDisabled }) => (
  <button
    type="submit"
    className={`flex items-center justify-center px-6 py-5 bg-[#3582a1] text-white rounded-full hover:bg-[#2a6a84] transition-all duration-300 text-base font-semibold w-full ${
      isDisabled || isLoading || Object.keys(errors).length > 0
        ? 'opacity-50 cursor-not-allowed'
        : 'shadow-md hover:shadow-lg hover:translate-y-[-2px]'
    }`}
    disabled={isDisabled || isLoading || Object.keys(errors).length > 0}
    onClick={() => setIsSubmitClicked(true)}
  >
    {isLoading ? (
      <span className="flex items-center justify-center">
        <svg
          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Submitting...
      </span>
    ) : (
      <>
        <span className="mr-2">Submit Request</span>
        <Send className="h-5 w-5 flex-shrink-0" />
      </>
    )}
  </button>
);

export default SubmitButton;