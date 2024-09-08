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
    <>
      <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name {!isNameValid && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleNameChange}
              placeholder="John Doe"
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] ${errors.full_name ? 'border-[#3582a1] bg-[#f0f7f9]' : 'border-gray-300'}`}
              autoComplete="name"
              required
            />
          </div>
          {errors.full_name && <p className="mt-1 text-xs text-[#3582a1]">{errors.full_name}</p>}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email {!isEmailValid && <span className="text-red-500">*</span>}
          </label>
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
              autoComplete="email"
              required
            />
          </div>
          {errors.email && <p className="mt-1 text-xs text-[#3582a1]">{errors.email}</p>}
        </div>
      </div>
    </>
  );
};

export default PersonalInfoForm;