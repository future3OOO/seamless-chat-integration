import React from 'react';
import { User, Mail } from 'lucide-react';

const PersonalInfoForm = ({ formData, handleChange, errors }) => (
  <>
    <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
    <div className="space-y-4">
      <div className="flex space-x-4">
        <div className="flex-1">
          <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name || ''}
              onChange={handleChange}
              placeholder="John"
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] ${errors.first_name ? 'border-[#3582a1] bg-[#f0f7f9]' : 'border-gray-300'}`}
              autoComplete="given-name"
            />
          </div>
          {errors.first_name && <p className="mt-1 text-xs text-[#3582a1]">{errors.first_name}</p>}
        </div>
        <div className="flex-1">
          <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name || ''}
              onChange={handleChange}
              placeholder="Doe"
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] ${errors.last_name ? 'border-[#3582a1] bg-[#f0f7f9]' : 'border-gray-300'}`}
              autoComplete="family-name"
            />
          </div>
          {errors.last_name && <p className="mt-1 text-xs text-[#3582a1]">{errors.last_name}</p>}
        </div>
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
            autoComplete="email"
          />
        </div>
        {errors.email && <p className="mt-1 text-xs text-[#3582a1]">{errors.email}</p>}
      </div>
    </div>
  </>
);

export default PersonalInfoForm;