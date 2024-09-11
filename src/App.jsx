import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { debounce } from 'lodash';

import Logo from './assets/logo.svg'; // Correct relative path
import PersonalInfoForm from './components/PersonalInfoForm';
import PropertyDetailsForm from './components/PropertyDetailsForm';
import IssueDescriptionForm from './components/IssueDescriptionForm';
import ProgressIndicator from './components/ProgressIndicator';
import FormNavigation from './components/FormNavigation';
import PoweredByLink from './components/PoweredByLink';
import ThankYouMessage from './components/ThankYouMessage';
import ErrorBoundary from './components/ErrorBoundary';
import { FormProvider, useFormContext } from './FormContext'; // Import FormContext

const libraries = ['places'];

const App = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [isStepValid, setIsStepValid] = useState(false);
  const containerRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const { formState, errors, setErrors, validateField } = useFormContext();

  const validateStep = useCallback(() => {
    let isValid = true;
    let newErrors = {};
    const fieldsToValidate = step === 1 ? ['full_name', 'email'] : step === 2 ? ['address'] : ['issue'];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formState[field]);
      if (Object.keys(error).length) isValid = false;
      newErrors = { ...newErrors, ...error };
    });
    
    setErrors(newErrors);
    setIsStepValid(isValid);
  }, [step, formState, validateField, setErrors]);

  useEffect(() => {
    validateStep();
  }, [validateStep]);

  const debouncedSubmit = useMemo(
    () => debounce(async (formDataToSend) => {
      const endpoint = process.env.NODE_ENV === 'production' 
        ? 'https://your-api-endpoint.com/submit' 
        : 'http://localhost:5000/submit';
        
      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          body: formDataToSend,
        });

        if (response.ok) {
          setIsSubmitted(true);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Server error');
        }
      } catch (error) {
        setErrors(prevErrors => ({ ...prevErrors, submit: error.message || 'Network error. Please try again.' }));
      } finally {
        setIsLoading(false);
      }
    }, 500),
    [setErrors]
  );

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!isSubmitClicked || !isStepValid || isLoading) return;

    setIsLoading(true);
    const formDataToSend = new FormData();
    Object.entries(formState).forEach(([key, value]) => {
      if (key === 'images') {
        value.forEach((image) => formDataToSend.append('images', image));
      } else {
        formDataToSend.append(key, value);
      }
    });

    debouncedSubmit(formDataToSend);
  }, [formState, isSubmitClicked, isStepValid, isLoading, debouncedSubmit]);

  const handleStepChange = useCallback((newStep) => {
    if (newStep >= 1 && newStep <= 3) {
      setStep(newStep);
    }
  }, []);

  // Add useMemo here to memoize renderForm and prevent unnecessary re-renders
  const renderForm = useMemo(() => {
    switch (step) {
      case 1:
        return <PersonalInfoForm />;
      case 2:
        return <PropertyDetailsForm />;
      case 3:
        return <IssueDescriptionForm />;
      default:
        return null;
    }
  }, [step]); // Dependencies include 'step'

  if (isSubmitted) {
    return <ThankYouMessage />;
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl font-semibold text-red-600">Error loading Google Maps</p>
        <button onClick={() => window.location.reload()} className="mt-4 p-2 bg-blue-500 text-white rounded">Reload</button>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        <p className="text-xl font-semibold ml-4">Loading Google Maps...</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3582a1] to-[#8ecfdc] py-8 px-4 sm:py-12 bg-pattern md:py-8">
        <div ref={containerRef} className="bg-white p-6 rounded-lg w-full max-w-3xl mx-auto flex flex-col">
          <div className="flex flex-col items-center mb-4">
            <img src={Logo} alt="Logo" className="h-16 w-auto object-contain mb-2" />
            <h1 className="text-2xl font-bold text-gray-800 mb-1 text-center">Maintenance Request</h1>
            <p className="text-base text-gray-600 text-center max-w-md">Let's get your issue resolved quickly and efficiently!</p>
          </div>
          <div className="w-full max-w-2xl mx-auto mb-4">
            <ProgressIndicator step={step} onStepClick={handleStepChange} />
          </div>
          <form onSubmit={handleSubmit} className="flex-grow flex flex-col w-full max-w-2xl mx-auto">
            <div className="flex-grow overflow-y-auto">
              {renderForm} {/* Now memoized with useMemo */}
            </div>
            <FormNavigation 
              step={step} 
              setStep={setStep} 
              isStepValid={isStepValid} 
              isLoading={isLoading} 
              errors={errors} 
              setIsSubmitClicked={setIsSubmitClicked} 
            />
          </form>
          {errors.submit && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {errors.submit}
            </div>
          )}
          <PoweredByLink />
        </div>
      </div>
    </ErrorBoundary>
  );
};

const AppWithProvider = () => (
  <FormProvider>
    <App />
  </FormProvider>
);

export default AppWithProvider;
