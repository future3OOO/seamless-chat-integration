import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Autocomplete } from '@react-google-maps/api';

const PropertyDetailsForm = ({ formData, handleChange, errors, isLoaded }) => {
  const [isAddressValid, setIsAddressValid] = useState(false);
  const autocompleteRef = useRef(null);

  useEffect(() => {
    setIsAddressValid(formData.address.trim().length > 0);
  }, [formData.address]);

  const onLoad = (autocomplete) => {
    console.log('Autocomplete loaded:', autocomplete);
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      let formattedAddress = place.formatted_address;
      formattedAddress = formattedAddress.replace(/, New Zealand$/, '');
      handleChange({ target: { name: 'address', value: formattedAddress } });
    } else {
      console.warn('Autocomplete is not loaded yet!');
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Property Details</h2>
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
          Address {!isAddressValid && <span className="text-red-500">*</span>}
        </label>
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
                onChange={(e) => {
                  handleChange(e);
                  setIsAddressValid(e.target.value.trim().length > 0);
                }}
                placeholder="Enter a New Zealand address"
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] ${errors.address ? 'border-[#3582a1] bg-[#f0f7f9]' : 'border-gray-300'}`}
                required
              />
            </Autocomplete>
          ) : (
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={(e) => {
                handleChange(e);
                setIsAddressValid(e.target.value.trim().length > 0);
              }}
              placeholder="Enter a New Zealand address"
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] ${errors.address ? 'border-[#3582a1] bg-[#f0f7f9]' : 'border-gray-300'}`}
              required
            />
          )}
        </div>
        {errors.address && <p className="mt-1 text-xs text-[#3582a1]">{errors.address}</p>}
      </div>
    </>
  );
};

export default PropertyDetailsForm;