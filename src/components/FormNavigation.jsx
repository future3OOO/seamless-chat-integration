import React from 'react';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';
import SubmitButton from './SubmitButton';

const FormNavigation = ({ step, setStep, isStepValid, isLoading, errors, setIsSubmitClicked }) => {
  const nextStep = () => {
    if (isStepValid) {
      setStep(prevStep => Math.min(prevStep + 1, 3));
    }
  };

  const prevStep = () => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
  };

  return (
    <div className="flex flex-col mt-8 space-y-4 w-full">
      <div className="flex flex-col space-y-4 w-full">
        {step < 3 ? (
          <button 
            type="button" 
            onClick={nextStep} 
            className={`flex items-center justify-center px-6 py-3 bg-[#3582a1] text-white rounded-full hover:bg-[#2a6a84] transition-colors text-base font-semibold w-full ${!isStepValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isStepValid}
          >
            <span className="mr-2">Next</span>
            <ChevronRight className="h-5 w-5" />
          </button>
        ) : (
          <div className="w-full">
            <SubmitButton
              isLoading={isLoading}
              errors={errors}
              setIsSubmitClicked={setIsSubmitClicked}
              isDisabled={!isStepValid}
            />
          </div>
        )}
        {step > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center justify-center px-4 py-2 bg-transparent text-gray-500 hover:bg-gray-100 transition-colors text-sm font-medium w-full rounded-full"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span>Previous</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default FormNavigation;