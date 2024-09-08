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
    <div className="flex justify-between items-center mt-8">
      {step > 1 && (
        <button
          type="button"
          onClick={prevStep}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
        >
          <ArrowLeft className="mr-2" size={18} />
          Previous
        </button>
      )}
      {step < 3 ? (
        <button 
          type="button" 
          onClick={nextStep} 
          className={`flex items-center px-6 py-3 bg-[#3582a1] text-white rounded-full hover:bg-[#2a6a84] transition-colors ml-auto ${!isStepValid ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!isStepValid}
        >
          Next
          <ArrowRight className="ml-2" size={18} />
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
    </div>
  );
};

export default FormNavigation;