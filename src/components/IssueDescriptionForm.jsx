import React, { useState, useEffect, useRef } from 'react';
import { FileText, Upload, Trash, Camera } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { useFormContext } from '../FormContext.jsx'; // Update this import path

const IssueDescriptionForm = () => {
  const { formState, handleChange, errors, previewUrls, removeImage } = useFormContext();
  const [isIssueValid, setIsIssueValid] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const textareaRef = useRef(null);
  const [totalSize, setTotalSize] = useState(0);

  useEffect(() => {
    setIsIssueValid(formState.issue.trim().length > 0);
    setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [formState.issue]);

  const handleResize = () => {
    setIsMobile(window.innerWidth <= 768);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
      textareaRef.current.focus();
    }
  }, []);

  const handleTextareaChange = (e) => {
    handleChange(e);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const onDrop = (acceptedFiles, rejectedFiles) => {
    setUploadError('');
    const newTotalSize = totalSize + acceptedFiles.reduce((sum, file) => sum + file.size, 0);
    
    if (newTotalSize > 30 * 1024 * 1024) {
      setUploadError('Total file size exceeds 30MB limit. Please remove some files.');
      return;
    }

    setTotalSize(newTotalSize);
    handleChange({ target: { name: 'images', files: [...formState.images, ...acceptedFiles] } });

    if (rejectedFiles.length > 0) {
      setUploadError('Some files were not accepted. Please ensure you are uploading image files (jpg, jpeg, png, gif).');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif']
    },
    maxFiles: 5,
  });

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg">
        <label htmlFor="issue" className="block text-lg font-semibold text-gray-700 mb-2">
          Describe Your Issue {!isIssueValid && <span className="text-red-500">*</span>}
        </label>
        <div className="relative">
          <FileText className="absolute left-4 top-4 text-[#3582a1]" size={24} />
          <textarea
            ref={textareaRef}
            id="issue"
            name="issue"
            value={formState.issue}
            onChange={handleTextareaChange}
            placeholder="Describe your maintenance issue here"
            className="w-full pl-12 pr-4 py-4 border-2 rounded-lg focus:border-[#3582a1] min-h-[150px] text-base resize-none overflow-hidden bg-gray-50 transition-all duration-200 ease-in-out outline-none"
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              lineHeight: '1.5',
              borderColor: '#3582a1',
            }}
            required
          ></textarea>
        </div>
      </div>
      <div className="bg-[#f0f7f9] p-4 rounded-lg border-2 border-[#3582a1]">
        <h3 className="text-lg font-semibold mb-3 text-[#3582a1] flex items-center">
          <Camera className="mr-3 text-[#3582a1]" size={24} />
          Upload Photos (Recommended)
        </h3>
        <p className="text-base text-gray-600 mb-4">
          Adding photos helps us understand and address your issue more quickly. (Max 5 images, 30MB total)
        </p>
        {!isMobile ? (
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <div className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-[#3582a1] rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
              <Upload className="mr-3 text-[#3582a1]" size={24} />
              <span className="text-base font-medium text-[#3582a1]">
                {isDragActive ? "Drop the files here" : "Drag 'n' drop some files here, or click to select files"}
              </span>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <label htmlFor="mobile-image-upload" className="flex items-center justify-center w-full px-4 py-6 border-2 border-[#3582a1] rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
              <Upload className="mr-3 text-[#3582a1]" size={24} />
              <span className="text-base font-medium text-[#3582a1]">Tap to select files</span>
            </label>
            <input
              id="mobile-image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onDrop(Array.from(e.target.files), [])}
              className="hidden"
            />
          </div>
        )}
        {uploadError && (
          <p className="text-red-500 mt-2">{uploadError}</p>
        )}
        {previewUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4">
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