import React, { useState, useEffect, useRef } from 'react';
import { User, Mail } from 'lucide-react';

const PersonalInfoForm = ({ formData, handleChange, errors }) => {
  const [isNameValid, setIsNameValid] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const nameInputRef = useRef(null);

  useEffect(() => {
    setIsNameValid(formData.full_name.trim().length > 0);
    setIsEmailValid(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email));
  }, [formData.full_name, formData.email]);

  useEffect(() => {
    if (nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, []);

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg">
        <label htmlFor="full_name" className="block text-lg font-semibold text-gray-700 mb-2">
          Full Name {!isNameValid && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <User className="absolute left-4 top-4 text-[#3582a1]" size={24} />
          <input
            ref={nameInputRef}
            type="text"
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            placeholder="John Doe"
            className="w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:border-[#3582a1] text-base bg-gray-50 transition-all duration-200 ease-in-out outline-none"
            style={{ borderColor: '#3582a1' }}
            autoComplete="name"
            required
          />
        </div>
      </div>
      <div className="bg-white rounded-lg">
        <label htmlFor="email" className="block text-lg font-semibold text-gray-700 mb-2">
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
            className="w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:border-[#3582a1] text-base bg-gray-50 transition-all duration-200 ease-in-out outline-none"
            style={{ borderColor: '#3582a1' }}
            autoComplete="email"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoForm;