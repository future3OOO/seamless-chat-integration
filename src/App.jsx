import React, { useState, useCallback, useEffect } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import Logo from './assets/logo.svg';
import { User, MapPin, Mail, FileText, Upload, ArrowLeft, ArrowRight, Trash } from 'lucide-react';
import PersonalInfoForm from './components/PersonalInfoForm';
import PropertyDetailsForm from './components/PropertyDetailsForm';
import IssueDescriptionForm from './components/IssueDescriptionForm';
import ProgressIndicator from './components/ProgressIndicator';
import SubmitButton from './components/SubmitButton';
import ThankYouMessage from './components/ThankYouMessage';

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

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      const newImages = Array.from(files);
      setFormData(prevState => ({
        ...prevState,
        images: [...prevState.images, ...newImages]
      }));
      
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
      setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
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
    switch (step) {
      case 1:
        isValid = formData.full_name.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
        break;
      case 2:
        isValid = formData.address.trim() !== '';
        break;
      case 3:
        isValid = formData.issue.trim() !== '';
        break;
      default:
        isValid = false;
    }
    setIsStepValid(isValid);
  }, [step, formData]);

  useEffect(() => {
    validateStep();
  }, [validateStep]);

  const nextStep = useCallback(() => {
    if (isStepValid) {
      setErrors({});
      setStep(prevStep => Math.min(prevStep + 1, 3));
      setIsSubmitClicked(false);
    }
  }, [isStepValid]);

  const prevStep = useCallback(() => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
    setIsSubmitClicked(false);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!isSubmitClicked || !isStepValid) return;
    
    setIsLoading(true);
    try {
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
  }, [formData, isSubmitClicked, isStepValid]);

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
      <p className="text-xl font-semibold">Loading Google Maps...</p>
    </div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3582a1] to-[#8ecfdc] p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl min-h-[630px] transition-all duration-300">
        <img src={Logo} alt="Logo" className="w-24 h-24 mx-auto object-contain mb-6" />
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Maintenance Request</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">Let's get your issue resolved quickly and efficiently!</p>
        
        <ProgressIndicator step={step} />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && <PersonalInfoForm formData={formData} handleChange={handleChange} errors={errors} />}
          {step === 2 && <PropertyDetailsForm formData={formData} handleChange={handleChange} errors={errors} isLoaded={isLoaded} />}
          {step === 3 && <IssueDescriptionForm formData={formData} handleChange={handleChange} errors={errors} previewUrls={previewUrls} removeImage={removeImage} />}
          
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button type="button" onClick={prevStep} className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                <ArrowLeft className="mr-2" size={18} />
                Previous
              </button>
            )}
            {step < 3 ? (
              <button 
                type="button" 
                onClick={nextStep} 
                className={`flex items-center px-4 py-2 bg-[#3582a1] text-white rounded hover:bg-[#2a6a84] transition-colors ml-auto ${!isStepValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={!isStepValid}
              >
                Next
                <ArrowRight className="ml-2" size={18} />
              </button>
            ) : (
              <SubmitButton isLoading={isLoading} errors={errors} setIsSubmitClicked={setIsSubmitClicked} isDisabled={!isStepValid} />
            )}
          </div>
        </form>
        
        {errors.submit && (
          <div className="mt-4 p-3 bg-[#f0f7f9] border border-[#3582a1] text-[#3582a1] rounded">
            {errors.submit}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;