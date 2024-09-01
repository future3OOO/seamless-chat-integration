import React, { useState } from 'react';
import Logo from './assets/logo.svg';
import { User, MapPin, Mail, FileText, Upload, ChevronDown, ChevronUp } from 'lucide-react';

const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
      <div className="bg-[#3582a1] h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
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
  const [expandedSection, setExpandedSection] = useState('personal');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prevState => ({
        ...prevState,
        [name]: files[0]
      }));
      setImageSelected(true);
    } else {
      setFormData(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
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

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const calculateProgress = () => {
    const fields = ['full_name', 'email', 'address', 'issue'];
    const filledFields = fields.filter(field => formData[field].trim() !== '').length;
    return (filledFields / fields.length) * 100;
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
        
        <ProgressBar progress={calculateProgress()} />
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="border rounded-md overflow-hidden">
            <div
              className={`bg-gray-100 p-4 cursor-pointer flex justify-between items-center ${expandedSection === 'personal' ? 'border-b' : ''}`}
              onClick={() => toggleSection('personal')}
            >
              <h3 className="text-lg font-semibold">Personal Information</h3>
              {expandedSection === 'personal' ? <ChevronUp /> : <ChevronDown />}
            </div>
            {expandedSection === 'personal' && (
              <div className="p-4 space-y-4">
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
          </div>

          <div className="border rounded-md overflow-hidden">
            <div
              className={`bg-gray-100 p-4 cursor-pointer flex justify-between items-center ${expandedSection === 'property' ? 'border-b' : ''}`}
              onClick={() => toggleSection('property')}
            >
              <h3 className="text-lg font-semibold">Property Details</h3>
              {expandedSection === 'property' ? <ChevronUp /> : <ChevronDown />}
            </div>
            {expandedSection === 'property' && (
              <div className="p-4 space-y-4">
                <div className="relative">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, City, Country" required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border rounded-md overflow-hidden">
            <div
              className={`bg-gray-100 p-4 cursor-pointer flex justify-between items-center ${expandedSection === 'issue' ? 'border-b' : ''}`}
              onClick={() => toggleSection('issue')}
            >
              <h3 className="text-lg font-semibold">Issue Description</h3>
              {expandedSection === 'issue' ? <ChevronUp /> : <ChevronDown />}
            </div>
            {expandedSection === 'issue' && (
              <div className="p-4 space-y-4">
                <div className="relative">
                  <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1">Describe Your Issue</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                    <textarea id="issue" name="issue" value={formData.issue} onChange={handleChange} placeholder="Please provide details about your maintenance issue..." required className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] min-h-[100px]"></textarea>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="border rounded-md overflow-hidden">
            <div
              className={`bg-gray-100 p-4 cursor-pointer flex justify-between items-center ${expandedSection === 'image' ? 'border-b' : ''}`}
              onClick={() => toggleSection('image')}
            >
              <h3 className="text-lg font-semibold">Supporting Image</h3>
              {expandedSection === 'image' ? <ChevronUp /> : <ChevronDown />}
            </div>
            {expandedSection === 'image' && (
              <div className="p-4 space-y-4">
                <div className="relative">
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Upload Image (Optional)</label>
                  <div className="relative">
                    <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="file"
                      id="image"
                      name="image"
                      onChange={handleChange}
                      accept="image/*"
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#3582a1] file:text-white hover:file:bg-[#2a6a84]"
                    />
                  </div>
                </div>
                {imageSelected && (
                  <p className="text-sm text-green-600">Image selected: {formData.image.name}</p>
                )}
              </div>
            )}
          </div>
          
          <button type="submit" className="w-full bg-[#3582a1] text-white px-4 py-2 rounded hover:bg-[#2a6a84] transition-colors flex items-center justify-center" disabled={isLoading}>
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