import React, { useState, useEffect } from 'react';
import Logo from './assets/mw-logo.png';

const App = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    address: '',
    email: '',
    issue: '',
    image: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [logoError, setLogoError] = useState(false);

  useEffect(() => {
    console.log('App component mounted');
  }, []);

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

      const response = await fetchWithRetry('http://localhost:5000/submit', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Server response:', result);
        alert('Form submitted successfully! Selenium script is now processing.');
        setFormData({
          full_name: '',
          address: '',
          email: '',
          issue: '',
          image: null
        });
        window.open('http://localhost:5000/tapi.html', '_blank');
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

  const fetchWithRetry = async (url, options, maxRetries = 3) => {
    try {
      const response = await fetch(url, options);
      if (response.status === 429 && retryCount < maxRetries) {
        const retryAfter = response.headers.get('Retry-After') || 5;
        await new Promise(resolve => setTimeout(resolve, retryAfter * 1000));
        setRetryCount(prevCount => prevCount + 1);
        return fetchWithRetry(url, options, maxRetries);
      }
      return response;
    } catch (error) {
      if (retryCount < maxRetries) {
        setRetryCount(prevCount => prevCount + 1);
        return fetchWithRetry(url, options, maxRetries);
      }
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex justify-center mb-6">
          {!logoError ? (
            <img
              src={Logo}
              alt="MW Logo"
              className="w-32 h-32 mx-auto object-contain"
              onError={() => {
                console.error('Failed to load logo');
                setLogoError(true);
              }}
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-gray-500">
              Logo not found
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Selenium Form Project</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">Please fill out the form below to submit your issue.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="John Doe" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Main St, City, Country" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1">Issue</label>
            <textarea id="issue" name="issue" value={formData.issue} onChange={handleChange} placeholder="Describe your issue here..." required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
            <input type="file" id="image" name="image" onChange={handleChange} accept="image/*" className="w-full" />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors" disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default App;
