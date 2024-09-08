import React, { useState, useCallback, useEffect } from 'react';
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import Logo from './assets/logo.svg';
import { User, MapPin, Mail, FileText, Upload, ArrowLeft, ArrowRight, Trash } from 'lucide-react';
import ImagePreview from './components/ImagePreview';
import FormStep from './components/FormStep';
import SubmitButton from './components/SubmitButton';

const libraries = ['places'];

const validateStep = (step, formData) => {
  let stepErrors = {};
  switch (step) {
    case 1:
      if (!formData.full_name.trim()) stepErrors.full_name = 'Full name is required';
      if (!formData.email.trim()) stepErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) stepErrors.email = 'Email is invalid';
      break;
    case 2:
      if (!formData.address.trim()) stepErrors.address = 'Address is required';
      break;
    case 3:
      if (!formData.issue.trim()) stepErrors.issue = 'Issue description is required';
      break;
    default:
      break;
  }
  return stepErrors;
};

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
  const [autocomplete, setAutocomplete] = useState(null);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const onLoad = useCallback((autocomplete) => {
    setAutocomplete(autocomplete);
  }, []);

  const onPlaceChanged = () => {
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      let formattedAddress = place.formatted_address;
      formattedAddress = formattedAddress.replace(/, New Zealand$/, '');
      setFormData(prevState => ({
        ...prevState,
        address: formattedAddress,
      }));
    }
  };

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
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);

    setFormData(prevState => ({
      ...prevState,
      images: newImages
    }));
    setPreviewUrls(newPreviewUrls);
  }, [formData.images, previewUrls]);

  const nextStep = useCallback(() => {
    const stepErrors = validateStep(step, formData);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      setStep(prevStep => Math.min(prevStep + 1, 3));
    }
    setIsSubmitClicked(false);
  }, [step, formData]);

  const prevStep = useCallback(() => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
    setIsSubmitClicked(false);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
  
    if (!isSubmitClicked) return;
  
    const stepErrors = validateStep(3, formData);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
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
    }
  }, [formData, isSubmitClicked]);

  useEffect(() => {
    const stepErrors = validateStep(step, formData);
    setErrors(stepErrors);
  }, [step, formData]);

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <img src={Logo} alt="Logo" className="w-32 h-32 mx-auto object-contain mb-6" />
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Thank You!</h2>
          <p className="text-gray-600 mb-4">Your maintenance request has been submitted successfully.</p>
          <p className="text-gray-600">You will receive an email from Tapi within 30 minutes with further instructions.</p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">Error loading Google Maps</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-xl font-semibold">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3582a1] to-[#8ecfdc] p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl min-h-[630px] transition-all duration-300">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="Logo" className="w-32 h-32 mx-auto object-contain" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Maintenance Request</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">Let's get your issue resolved quickly and efficiently!</p>
        
        <FormStep step={step} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormStep
            step={step}
            formData={formData}
            errors={errors}
            handleChange={handleChange}
            isLoaded={isLoaded}
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
          />
          
          <ImagePreview previewUrls={previewUrls} removeImage={removeImage} />
          
          <div className="flex justify-between mt-6">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
              >
                <ArrowLeft className="mr-2" size={18} />
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center px-4 py-2 bg-[#3582a1] text-white rounded hover:bg-[#2a6a84] transition-colors ml-auto"
              >
                Next
                <ArrowRight className="ml-2" size={18} />
              </button>
            ) : (
              <SubmitButton
                isLoading={isLoading}
                errors={errors}
                setIsSubmitClicked={setIsSubmitClicked}
              />
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