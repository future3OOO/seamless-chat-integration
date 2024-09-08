import React, { useState, useEffect } from 'react';
import { FileText, Upload, Trash } from 'lucide-react';

const IssueDescriptionForm = ({ formData, handleChange, errors, previewUrls, removeImage }) => {
  const [isIssueValid, setIsIssueValid] = useState(false);

  useEffect(() => {
    setIsIssueValid(formData.issue.trim().length > 0);
  }, [formData.issue]);

  return (
    <>
      <h2 className="text-2xl font-bold mb-4">Issue Description</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="issue" className="block text-sm font-medium text-gray-700 mb-1">
            Describe Your Issue {!isIssueValid && <span className="text-red-500">*</span>}
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
            <textarea
              id="issue"
              name="issue"
              value={formData.issue}
              onChange={handleChange}
              placeholder="Please provide details about your maintenance issue..."
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3582a1] min-h-[100px] ${errors.issue ? 'border-[#3582a1] bg-[#f0f7f9]' : 'border-gray-300'}`}
              required
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
          {previewUrls.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    onClick={() => removeImage(index)}
                  >
                    <Trash size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default IssueDescriptionForm;