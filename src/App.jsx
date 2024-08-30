import React, { useState, useEffect } from 'react';

const App = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    address: '',
    email: '',
    issue: '',
    image: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
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
    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const response = await fetch('/submit', {
        method: 'POST',
        body: data,
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
      } else if (response.status === 429) {
        throw new Error('Too many requests. Please try again later.');
      } else {
        throw new Error('Server response was not ok.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-2xl font-bold text-gray-800">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Error</h2>
          <p className="text-center text-gray-800">{error}</p>
          <button onClick={() => setError(null)} className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Selenium Form Project</h2>
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

// Note: This comment is to demonstrate the changes needed in package.json
// Add the following scripts to package.json:
// "scripts": {
//   "dev": "vite",
//   "build": "vite build",
//   "build:dev": "vite build --mode development",
//   "preview": "vite preview"
// }

export default App;
