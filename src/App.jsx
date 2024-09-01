import React, { useState, useCallback, useEffect } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import Logo from './assets/logo.svg';
import { User, MapPin, Mail, FileText, Upload, ArrowLeft, ArrowRight } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = 'AIzaSyD9mK1jRtZAOGBohiiiMHv72TFzIsjbfNc';

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

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
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

  const nextStep = useCallback(() => {
    const stepErrors = validateStep(step, formData);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      setStep(prevStep => Math.min(prevStep + 1, 3));
    }
  }, [step, formData]);

  const prevStep = useCallback(() => {
    setStep(prevStep => Math.max(prevStep - 1, 1));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const stepErrors = validateStep(3, formData);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      setIsLoading(true);
      try {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          if (key === 'images') {
            formData[key].forEach((image, index) => {
              formDataToSend.append(`image_${index}`, image);
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
          throw new Error('Server response was not ok');
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({ submit: error.message });
      } finally {
        setIsLoading(false);
      }
    }
  }, [formData]);

  useEffect(() => {
    const stepErrors = validateStep(step, formData);
    setErrors(stepErrors);
  }, [step, formData]);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] ${errors.full_name ? 'border-[#3582a1] bg-[#f0f7f9]' : 'border-gray-300'}`}
                  />
                </div>
                {errors.full_name && <p className="mt-1 text-xs text-[#3582a1]">{errors.full_name}</p>}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] ${errors.email ? 'border-[#3582a1] bg-[#f0f7f9]' : 'border-gray-300'}`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-[#3582a1]">{errors.email}</p>}
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Property Details</h2>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                {isLoaded && !loadError ? (
                  <Autocomplete
                    onLoad={onLoad}
                    onPlaceChanged={onPlaceChanged}
                    restrictions={{ country: "nz" }}
                  >
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Enter a New Zealand address"
                      className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] ${errors.address ? 'border-[#3582a1] bg-[#f0f7f9]' : 'border-gray-300'}`}
                    />
                  </Autocomplete>
                ) : (
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter a New Zealand address"
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] ${errors.address ? 'border-[#3582a1] bg-[#f0f7f9]' : 'border-gray-300'}`}
                  />
                )}
              </div>
              {errors.address && <p className="mt-1 text-xs text-[#3582a1]">{errors.address}</p>}
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Issue Description</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1">Describe Your Issue</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea
                    id="issue"
                    name="issue"
                    value={formData.issue}
                    onChange={handleChange}
                    placeholder="Please provide details about your maintenance issue..."
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] min-h-[100px] ${errors.issue ? 'border-[#3582a1] bg-[#f0f7f9]' : 'border-gray-300'}`}
                  ></textarea>
                </div>
                {errors.issue && <p className="mt-1 text-xs text-[#3582a1]">{errors.issue}</p>}
              </div>
              <div>
                <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
                <div className="relative">
                  <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="file"
                    id="images"
                    name="images"
                    onChange={handleChange}
                    accept="image/*"
                    multiple
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#3582a1] file:text-white hover:file:bg-[#2a6a84]"
                  />
                </div>
                {previewUrls.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {previewUrls.map((url, index) => (
                      <img key={index} src={url} alt={`Preview ${index + 1}`} className="w-24 h-24 object-cover rounded-md" />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

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
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="Logo" className="w-32 h-32 mx-auto object-contain" />
        </div>
        <h1 className="text-3xl font-bold mb-2 text-center text-gray-800">Maintenance Request</h1>
        <p className="text-sm text-gray-600 mb-6 text-center">Let's get your issue resolved quickly and efficiently!</p>
        
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-1/3 h-2 ${
                  s <= step ? 'bg-[#3582a1]' : 'bg-gray-200'
                } ${s === 1 ? 'rounded-l-full' : ''} ${
                  s === 3 ? 'rounded-r-full' : ''
                }`}
              ></div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Personal</span>
            <span>Property</span>
            <span>Issue</span>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
          {renderStep()}
          
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
              <button
                type="button"
                onClick={handleSubmit}
                className="flex items-center px-4 py-2 bg-[#3582a1] text-white rounded hover:bg-[#2a6a84] transition-colors ml-auto disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || Object.keys(errors).length > 0}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Submitting...
                  </>
                ) : 'Submit Request'}
              </button>
            )}
          </div>
        </form>
        
        {errors.submit && (
          <div className="mt-4 p-3 bg-[#f0f7f9] border border-[#3582a1] text-[#3582a1] rounded">
            {errors.submit}
          </div>
        )}
      </div>
      <style jsx global>{`
        .pac-container {
          font-family: 'Inter', sans-serif;
        }
        .pac-container::after {
          content: "Powered by Property Partner";
          padding: 5px;
          text-align: right;
          font-size: 12px;
          color: #666;
        }
      `}</style>
    </div>
  );
};

export default App;