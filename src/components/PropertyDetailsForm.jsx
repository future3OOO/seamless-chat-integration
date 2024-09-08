import React from 'react';
import { MapPin } from 'lucide-react';
import { Autocomplete } from '@react-google-maps/api';

const PropertyDetailsForm = ({ formData, handleChange, errors, isLoaded }) => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Property Details</h2>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          {isLoaded ? (
            <Autocomplete
              onLoad={(autocomplete) => {
                // You can add any additional logic here if needed
              }}
              onPlaceChanged={() => {
                // You can add logic to handle place selection here
              }}
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
};

export default PropertyDetailsForm;