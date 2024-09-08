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
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-bold mb-2">Issue Description</h2>
      <div className="bg-white p-3 rounded-md border border-gray-300 shadow-sm">
        <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1">
          Describe Your Issue {!isIssueValid && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
          <textarea
            ref={textareaRef}
            id="issue"
            name="issue"
            value={formData.issue}
            onChange={handleTextareaChange}
            placeholder="Please provide details about your maintenance issue..."
            className="w-full max-w-[350px] mx-auto pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] min-h-[100px] text-base resize-none overflow-hidden"
            style={{
              width: '100%',
              maxWidth: '350px',
              minHeight: '100px',
              height: 'auto',
              overflowY: 'hidden'
            }}
            required
          ></textarea>
        </div>
        {errors.issue && <p className="mt-1 text-xs text-[#3582a1]">{errors.issue}</p>}
      </div>
      <div className="bg-[#f0f7f9] p-3 rounded-md border border-[#3582a1] max-w-[350px] mx-auto">
        <h3 className="text-sm font-semibold mb-1 text-[#3582a1] flex items-center">
          <Camera className="mr-1" size={14} />
          Upload Photos (Optional)
        </h3>
        <p className="text-xs text-gray-600 mb-2">
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
            className="flex items-center justify-center w-full px-2 py-1 border border-[#3582a1] rounded-md cursor-pointer bg-white hover:bg-gray-50 transition-colors"
          >
            <Upload className="mr-1 text-[#3582a1]" size={12} />
            <span className="text-xs font-medium text-[#3582a1]">Choose photos</span>
          </label>
        </div>
        {previewUrls.length > 0 && (
          <div className="mt-2 grid grid-cols-4 gap-1">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-md"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600"
                  onClick={() => removeImage(index)}
                >
                  <Trash size={8} />
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