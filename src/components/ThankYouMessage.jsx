import React from 'react';
import Logo from '../assets/logo.svg';

const ThankYouMessage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
      <img src={Logo} alt="Logo" className="w-32 h-32 mx-auto object-contain mb-6" />
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Thank You!</h2>
      <p className="text-gray-600 mb-4">Your maintenance request has been submitted successfully.</p>
      <p className="text-gray-600">You will receive an email from Tapi within 30 minutes with further instructions.</p>
    </div>
  </div>
);

export default ThankYouMessage;