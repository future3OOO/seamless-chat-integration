import React, { createContext, useContext, useReducer, useState, useCallback } from 'react';

const FormContext = createContext();

const initialFormState = {
  full_name: '',
  email: '',
  address: '',
  issue: '',
  images: []
};

const formReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'ADD_IMAGES':
      return { ...state, images: [...state.images, ...action.images].slice(0, 5) };
    case 'REMOVE_IMAGE':
      return { ...state, images: state.images.filter((_, i) => i !== action.index) };
    case 'RESET_FORM':
      return initialFormState;
    default:
      return state;
  }
};

export const FormProvider = ({ children }) => {
  const [formState, dispatch] = useReducer(formReducer, initialFormState);
  const [errors, setErrors] = useState({});
  const [previewUrls, setPreviewUrls] = useState([]);

  const validateField = useCallback((field, value) => {
    const errors = {};
    switch (field) {
      case 'full_name':
        if (!value.trim()) errors.full_name = 'Name is required';
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors.email = 'Valid email is required';
        break;
      case 'address':
        if (!value.trim()) errors.address = 'Address is required';
        break;
      case 'issue':
        if (!value.trim()) errors.issue = 'Issue description is required';
        break;
      default:
        break;
    }
    return errors;
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      const newImages = Array.from(files).slice(0, 5);
      dispatch({ type: 'ADD_IMAGES', images: newImages });
      const newPreviewUrls = newImages.map(file => URL.createObjectURL(file));
      setPreviewUrls(prevUrls => [...prevUrls, ...newPreviewUrls].slice(0, 5));
    } else {
      const newErrors = validateField(name, value);
      setErrors(prevErrors => ({ ...prevErrors, ...newErrors }));
      dispatch({ type: 'UPDATE_FIELD', field: name, value });
    }
  }, [validateField]);

  const removeImage = useCallback((index) => {
    dispatch({ type: 'REMOVE_IMAGE', index });
    setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  }, []);

  return (
    <FormContext.Provider value={{
      formState,
      dispatch,
      handleChange,
      removeImage,
      errors,
      setErrors,
      previewUrls,
      validateField
    }}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};