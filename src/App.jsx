import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useLoadScript } from '@react-google-maps/api';
import PersonalInfoForm from './components/PersonalInfoForm';
import PropertyDetailsForm from './components/PropertyDetailsForm';
import IssueDescriptionForm from './components/IssueDescriptionForm';
import ThankYouMessage from './components/ThankYouMessage';
import NotFound from './components/NotFound';
import ProgressIndicator from './components/ProgressIndicator';
import FormNavigation from './components/FormNavigation';
import PoweredByLink from './components/PoweredByLink';
import { handleImageUpload } from './utils/imageUtils';
import Logo from './assets/logo.svg';

const App = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    address: '',
    issue: '',
    images: [],
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [previewUrls, setPreviewUrls] = useState([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  useEffect(() => {
    if (isSubmitClicked) {
      handleSubmit();
    }
  }, [isSubmitClicked]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setFormData(prevState => ({
        ...prevState,
        [name]: [...prevState.images, ...files]
      }));
      
      // Generate preview URLs for the new images
      const newPreviewUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls]);
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const removeImage = (index) => {
    setFormData(prevState => ({
      ...prevState,
      images: prevState.images.filter((_, i) => i !== index)
    }));
    setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };

  const validateStep = () => {
    const newErrors = {};
    switch (step) {
      case 1:
        if (!formData.full_name.trim()) newErrors.full_name = 'Full name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
        break;
      case 2:
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        break;
      case 3:
        if (!formData.issue.trim()) newErrors.issue = 'Issue description is required';
        break;
      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isStepValid = validateStep();

  const handleSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    if (!validateStep()) {
      setIsLoading(false);
      setIsSubmitClicked(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('full_name', formData.full_name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('issue', formData.issue);

      if (formData.images.length > 0) {
        const mergedImage = await handleImageUpload(formData.images);
        if (mergedImage) {
          formDataToSend.append('images', mergedImage, 'merged_image.jpg');
        }
      }

      const response = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      setStep(4);
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Failed to submit the form. Please try again.' });
    } finally {
      setIsLoading(false);
      setIsSubmitClicked(false);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#3582a1] to-[#8ecfdc] py-8 px-4 sm:py-12 md:py-8">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <img src={Logo} alt="Logo" className="w-32 h-32 mx-auto object-contain mb-6" />
          <Routes>
            <Route path="/" element={<Navigate to="/personal-info" replace />} />
            <Route
              path="/personal-info"
              element={
                <>
                  <ProgressIndicator step={1} onStepClick={setStep} />
                  <PersonalInfoForm
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                  />
                  <FormNavigation
                    step={1}
                    setStep={setStep}
                    isStepValid={isStepValid}
                    isLoading={isLoading}
                    errors={errors}
                    setIsSubmitClicked={setIsSubmitClicked}
                  />
                </>
              }
            />
            <Route
              path="/property-details"
              element={
                <>
                  <ProgressIndicator step={2} onStepClick={setStep} />
                  <PropertyDetailsForm
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    isLoaded={isLoaded}
                  />
                  <FormNavigation
                    step={2}
                    setStep={setStep}
                    isStepValid={isStepValid}
                    isLoading={isLoading}
                    errors={errors}
                    setIsSubmitClicked={setIsSubmitClicked}
                  />
                </>
              }
            />
            <Route
              path="/issue-description"
              element={
                <>
                  <ProgressIndicator step={3} onStepClick={setStep} />
                  <IssueDescriptionForm
                    formData={formData}
                    handleChange={handleChange}
                    errors={errors}
                    previewUrls={previewUrls}
                    removeImage={removeImage}
                  />
                  <FormNavigation
                    step={3}
                    setStep={setStep}
                    isStepValid={isStepValid}
                    isLoading={isLoading}
                    errors={errors}
                    setIsSubmitClicked={setIsSubmitClicked}
                  />
                </>
              }
            />
            <Route path="/thank-you" element={<ThankYouMessage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <PoweredByLink />
        </div>
      </div>
    </Router>
  );
};

export default App;