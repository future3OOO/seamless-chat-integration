import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { Autocomplete } from '@react-google-maps/api';
import { useFormContext } from '../FormContext';

const PropertyDetailsForm = () => {
  const { formState, handleChange, isLoaded, loadError } = useFormContext();
  const [isAddressValid, setIsAddressValid] = useState(false);
  const autocompleteRef = useRef(null);
  const addressInputRef = useRef(null);

  useEffect(() => {
    setIsAddressValid(formState.address.trim().length > 0);
  }, [formState.address]);

  useEffect(() => {
    if (addressInputRef.current) {
      addressInputRef.current.focus();
    }
  }, []);

  const onLoad = (autocomplete) => {
    console.log('Autocomplete loaded:', autocomplete);
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      console.log('Place changed:', place);
      let formattedAddress = place.formatted_address;
      formattedAddress = formattedAddress.replace(/, New Zealand$/, '');
      handleChange({ target: { name: 'address', value: formattedAddress } });
    }
  };

  if (loadError) {
    return <div>Error loading Google Maps API: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div>Loading Google Maps API...</div>;
  }

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg">
        <label htmlFor="address" className="block text-lg font-semibold text-gray-700 mb-2">
          Address {!isAddressValid && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <MapPin className="absolute left-4 top-4 text-[#3582a1]" size={24} />
          <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
            restrictions={{ country: "nz" }}
          >
            <input
              ref={addressInputRef}
              type="text"
              id="address"
              name="address"
              value={formState.address}
              onChange={(e) => {
                handleChange(e);
                setIsAddressValid(e.target.value.trim().length > 0);
              }}
              placeholder="Enter a New Zealand address"
              className="w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:border-[#3582a1] text-base bg-gray-50 transition-all duration-200 ease-in-out outline-none"
              style={{ borderColor: '#3582a1' }}
              required
              autoComplete="off"
            />
          </Autocomplete>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsForm;