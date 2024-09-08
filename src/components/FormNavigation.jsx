import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
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
    <div className="flex flex-col mt-8 space-y-4">
      <div className="flex justify-between space-x-4">
        {step > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors text-base font-semibold flex-grow"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Previous
          </button>
        )}
        {step < 3 ? (
          <button 
            type="button" 
            onClick={nextStep} 
            className={`flex items-center justify-center px-6 py-3 bg-[#3582a1] text-white rounded-full hover:bg-[#2a6a84] transition-colors text-base font-semibold flex-grow ${!isStepValid ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isStepValid}
          >
            <span className="mr-2">Next</span>
            <ArrowRight className="h-5 w-5" />
          </button>
        ) : (
          <SubmitButton
            isLoading={isLoading}
            errors={errors}
            setIsSubmitClicked={setIsSubmitClicked}
            isDisabled={!isStepValid}
          />
        )}
      </div>
    </div>
  );
};

export default FormNavigation;