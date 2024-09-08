import React, { useState, useEffect } from 'react';
import { User, Mail } from 'lucide-react';

const PersonalInfoForm = ({ formData, handleChange, errors }) => {
  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  useEffect(() => {
    setIsNameValid(formData.full_name.trim().length > 0);
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email));
  }, [formData.full_name, formData.email]);

  const handleNameChange = (e) => {
    console.log('Name changed:', e.target.value);
    handleChange(e);
  };

  return (
    <div className="space-y-6 sm:space-y-8 w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg">
        <label htmlFor="full_name" className="block text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">
          Full Name {!isNameValid && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <User className="absolute left-4 top-4 text-[#3582a1]" size={24} />
          <input
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleNameChange}
            placeholder="John Doe"
            className="w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-[#3582a1] focus:border-[#3582a1] text-base sm:text-lg bg-gray-50 transition-all duration-200 ease-in-out"
            style={{ borderColor: '#3582a1' }}
            autoComplete="name"
            required
          />
        </div>
        {errors.full_name && <p className="mt-2 text-sm text-red-600">{errors.full_name}</p>}
      </div>
      <div className="bg-white rounded-lg">
        <label htmlFor="email" className="block text-lg sm:text-xl font-semibold text-gray-700 mb-2 sm:mb-3">
          Email {!isEmailValid && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-4 text-[#3582a1]" size={24} />
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-[#3582a1] focus:border-[#3582a1] text-base sm:text-lg bg-gray-50 transition-all duration-200 ease-in-out"
            style={{ borderColor: '#3582a1' }}
            autoComplete="email"
            required
          />
        </div>
        {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
      </div>
    </div>
  );
};

export default PersonalInfoForm;