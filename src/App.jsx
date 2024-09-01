import React, { useState } from 'react';
import Logo from './assets/logo.svg';
import { Upload, User, MapPin, Mail, FileText, ChevronRight, ChevronLeft } from 'lucide-react';

const ProgressIndicator = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-between mb-8">
      {[...Array(totalSteps)].map((_, index) => (
        <div key={index} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${index < currentStep ? 'bg-[#3582a1] text-white' : 'bg-gray-200 text-gray-600'}`}>
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div className={`h-1 w-full ${index < currentStep - 1 ? 'bg-[#3582a1]' : 'bg-gray-200'}`}></div>
          )}
        </div>
      ))}
    </div>
  );
};

const App = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    address: '',
    email: '',
    issue: '',
    image: null
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Server response:', result);
        setFormData({
          full_name: '',
          address: '',
          email: '',
          issue: '',
          image: null
        });
        setIsSubmitted(true);
      } else {
        const errorText = await response.text();
        throw new Error(`Server response was not ok. Status: ${response.status}, Message: ${errorText}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#3582a1] to-[#8ecfdc] p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="Logo" className="w-32 h-32 mx-auto object-contain" />
        </div>
        <h2 className="text-3xl font-bold mb-2 text-center text-gray-800">Maintenance Request</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">Let's get your issue resolved quickly and efficiently!</p>
        
        <ProgressIndicator currentStep={currentStep} totalSteps={4} />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
              <div className="relative">
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="John Doe" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1]" />
                </div>
              </div>
              <div className="relative">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1]" />
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Property Details</h3>
              <div className="relative">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, City, Country" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1]" />
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Issue Description</h3>
              <div className="relative">
                <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1">Describe Your Issue</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                  <textarea id="issue" name="issue" value={formData.issue} onChange={handleChange} placeholder="Please provide details about your maintenance issue..." required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] min-h-[100px]"></textarea>
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4">Supporting Image</h3>
              <div className="relative">
                <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Upload Image (Optional)</label>
                <div className="relative">
                  <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input type="file" id="image" name="image" onChange={handleChange} accept="image/*" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#3582a1] file:text-white hover:file:bg-[#2a6a84]" />
                </div>
              </div>
            </div>
          )}
          
          <div className="flex justify-between mt-8">
            {currentStep > 1 && (
              <button type="button" onClick={prevStep} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors flex items-center">
                <ChevronLeft size={18} className="mr-2" /> Previous
              </button>
            )}
            {currentStep < 4 ? (
              <button type="button" onClick={nextStep} className="bg-[#3582a1] text-white px-4 py-2 rounded hover:bg-[#2a6a84] transition-colors flex items-center ml-auto">
                Next <ChevronRight size={18} className="ml-2" />
              </button>
            ) : (
              <button type="submit" className="bg-[#3582a1] text-white px-4 py-2 rounded hover:bg-[#2a6a84] transition-colors flex items-center ml-auto" disabled={isLoading}>
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
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;