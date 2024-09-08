import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import Logo from './assets/logo.svg';
import PersonalInfoForm from './components/PersonalInfoForm';
import PropertyDetailsForm from './components/PropertyDetailsForm';
import IssueDescriptionForm from './components/IssueDescriptionForm';
import ProgressIndicator from './components/ProgressIndicator';
import FormNavigation from './components/FormNavigation';
import PoweredByLink from './components/PoweredByLink';
import ThankYouMessage from './components/ThankYouMessage';
import { debounce } from 'lodash';

const libraries = ['places'];

const App = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    address: '',
    issue: '',
    images: []
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [isStepValid, setIsStepValid] = useState(false);
  const containerRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      const newImages = Array.from(files).slice(0, 5); // Limit to 5 images
      setFormData(prevState => ({
        ...prevState,
        images: [...prevState.images, ...newImages].slice(0, 5)
      }));
      
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
      setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls].slice(0, 5));
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  }, []);

  const removeImage = useCallback((index) => {
    setFormData(prevState => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index)
    }));
    setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  }, []);

  const validateStep = useCallback(() => {
    let isValid = false;
    let newErrors = {};

    switch (step) {
      case 1:
        isValid = formData.full_name.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
        if (formData.full_name.trim() === '') newErrors.full_name = 'Name is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Valid email is required';
        break;
      case 2:
        isValid = formData.address.trim() !== '';
        if (formData.address.trim() === '') newErrors.address = 'Address is required';
        break;
      case 3:
        isValid = formData.issue.trim() !== '';
        if (formData.issue.trim() === '') newErrors.issue = 'Issue description is required';
        break;
      default:
        isValid = false;
    }
    setErrors(newErrors);
    setIsStepValid(isValid);
  }, [step, formData]);

  useEffect(() => {
    validateStep();
  }, [validateStep]);

  const debouncedSubmit = useCallback(
    debounce(async (formDataToSend) => {
      try {
        const response = await fetch('http://localhost:5000/submit', {
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
        console.error('Error submitting form:', error);
        setErrors({ submit: error.message || 'Network error. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }, 500),
    []
  );

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!isSubmitClicked || !isStepValid || isLoading) return;
    
    setIsLoading(true);
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'images') {
        formData[key].forEach((image) => {
          formDataToSend.append('images', image);
        });
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });

    debouncedSubmit(formDataToSend);
  }, [formData, isSubmitClicked, isStepValid, isLoading, debouncedSubmit]);

  const handleStepChange = (newStep) => {
    if (newStep >= 1 && newStep <= 3) {
      setStep(newStep);
    }
  };

  if (isSubmitted) {
    return <ThankYouMessage />;
  }

  if (loadError) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <p className="text-xl font-semibold text-red-600">Error loading Google Maps</p>
    </div>;
  }

  if (!isLoaded) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      <p className="text-xl font-semibold ml-4">Loading Google Maps...</p>
    </div>;
  }

  return (
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
            {step === 1 && <PersonalInfoForm formData={formData} handleChange={handleChange} errors={errors} />}
            {step === 2 && <PropertyDetailsForm formData={formData} handleChange={handleChange} errors={errors} isLoaded={isLoaded} />}
            {step === 3 && <IssueDescriptionForm formData={formData} handleChange={handleChange} errors={errors} previewUrls={previewUrls} removeImage={removeImage} />}
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
  );
};

export default App;