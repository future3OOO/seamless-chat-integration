import React from 'react';

const ProgressIndicator = ({ step }) => {
  const steps = ['Personal', 'Property', 'Issue'];

  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        {steps.map((label, index) => (
          <div key={index} className="text-sm font-medium text-gray-500">
            {label}
          </div>
        ))}
      </div>
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#3582a1] h-2 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-6 h-6 rounded-full border-2 ${
                index + 1 <= step ? 'bg-[#3582a1] border-[#3582a1]' : 'bg-white border-gray-300'
              } -mt-3 transition-all duration-300 ease-in-out`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressIndicator;