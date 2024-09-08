import React from 'react';
import { User, MapPin, Mail, FileText, Upload } from 'lucide-react';
import { Autocomplete } from '@react-google-maps/api';

const FormStep = ({ step, formData, errors, handleChange, isLoaded, onLoad, onPlaceChanged }) => {
  switch (step) {
    case 1:
      return (
        <>
          <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] ${errors.full_name ? 'border-[#3582a1] bg-[#f0f7f9]' : 'border-gray-300'}`}
                />
              </div>
              {errors.full_name && <p className="mt-1 text-xs text-[#3582a1]">{errors.full_name}</p>}
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
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-[#3582a1]">{errors.email}</p>}
            </div>
          </div>
        </>
      );
    case 2:
      return (
        <>
          <h2 className="text-2xl font-bold mb-4">Property Details</h2>
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              {isLoaded ? (
                <Autocomplete
                  onLoad={onLoad}
                  onPlaceChanged={onPlaceChanged}
                  restrictions={{ country: "nz" }}
                >
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter a New Zealand address"
                    className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] ${errors.address ? 'border-[#3582a1] bg-[#f0f7f9]' : 'border-gray-300'}`}
                  />
                </Autocomplete>
              ) : (
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter a New Zealand address"
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] ${errors.address ? 'border-[#3582a1] bg-[#f0f7f9]' : 'border-gray-300'}`}
                />
              )}
            </div>
            {errors.address && <p className="mt-1 text-xs text-[#3582a1]">{errors.address}</p>}
          </div>
        </>
      );
    case 3:
      return (
        <>
          <h2 className="text-2xl font-bold mb-4">Issue Description</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1">Describe Your Issue</label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                <textarea
                  id="issue"
                  name="issue"
                  value={formData.issue}
                  onChange={handleChange}
                  placeholder="Please provide details about your maintenance issue..."
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] min-h-[100px] ${errors.issue ? 'border-[#3582a1] bg-[#f0f7f9]' : 'border-gray-300'}`}
                ></textarea>
              </div>
              {errors.issue && <p className="mt-1 text-xs text-[#3582a1]">{errors.issue}</p>}
            </div>
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
              <div className="relative">
                <Upload className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="file"
                  id="images"
                  name="images"
                  onChange={handleChange}
                  accept="image/*"
                  multiple
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#3582a1] file:text-white hover:file:bg-[#2a6a84]"
                />
              </div>
            </div>
          </div>
        </>
      );
    default:
      return null;
  }
};

export default FormStep;