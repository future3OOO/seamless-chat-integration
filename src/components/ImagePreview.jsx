import React from 'react';
import { Trash } from 'lucide-react';

const ImagePreview = ({ previewUrls, removeImage }) => {
  if (previewUrls.length === 0) return null;

  return (
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
  );
};

export default ImagePreview;