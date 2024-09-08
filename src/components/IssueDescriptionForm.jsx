import React, { useState, useEffect, useRef } from 'react';
import { FileText, Upload, Trash, Camera } from 'lucide-react';

const IssueDescriptionForm = ({ formData, handleChange, errors, previewUrls, removeImage }) => {
  const [isIssueValid, setIsIssueValid] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    setIsIssueValid(formData.issue.trim().length > 0);
  }, [formData.issue]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [formData.issue]);

  const handleTextareaChange = (e) => {
    handleChange(e);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="space-y-8 w-full max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Issue Description</h2>
      <div className="bg-white rounded-lg shadow-sm">
        <label htmlFor="issue" className="block text-xl font-semibold text-gray-700 mb-3 px-4 pt-4">
          Describe Your Issue {!isIssueValid && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <FileText className="absolute left-4 top-4 text-[#3582a1]" size={24} />
          <textarea
            ref={textareaRef}
            id="issue"
            name="issue"
            value={formData.issue}
            onChange={handleTextareaChange}
            placeholder="Describe your maintenance issue here"
            className="w-full pl-14 pr-4 py-4 border-2 rounded-lg focus:ring-2 focus:ring-[#3582a1] focus:border-[#3582a1] min-h-[150px] text-base resize-none overflow-hidden bg-gray-50 transition-all duration-200 ease-in-out"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              lineHeight: '1.5',
              fontSize: '16px',
              borderColor: '#3582a1',
            }}
            required
          ></textarea>
        </div>
        {errors.issue && <p className="mt-2 text-sm text-red-600 px-4">{errors.issue}</p>}
      </div>
      <div className="bg-[#f0f7f9] p-6 rounded-lg border-2 border-[#3582a1]">
        <h3 className="text-xl font-semibold mb-4 text-[#3582a1] flex items-center">
          <Camera className="mr-3 text-[#3582a1]" size={24} />
          Upload Photos (Recommended)
        </h3>
        <p className="text-base text-gray-600 mb-6">
          Adding photos helps us understand and address your issue more quickly.
        </p>
        <div className="relative">
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <label
            htmlFor="images"
            className="flex items-center justify-center w-full px-6 py-4 border-2 border-[#3582a1] rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors"
          >
            <Upload className="mr-3 text-[#3582a1]" size={24} />
            <span className="text-lg font-medium text-[#3582a1]">Choose photos</span>
          </label>
        </div>
        {previewUrls.length > 0 && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors"
                  onClick={() => removeImage(index)}
                >
                  <Trash size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueDescriptionForm;