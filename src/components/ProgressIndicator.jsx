import React from 'react';

const ProgressIndicator = ({ step }) => {
  const steps = [
    { number: 1, label: 'Personal' },
    { number: 2, label: 'Property' },
    { number: 3, label: 'Issue' },
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center relative">
        {steps.map((s, index) => (
          <div key={s.number} className="flex flex-col items-center relative z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                s.number <= step
                  ? 'bg-[#3582a1] text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {s.number}
            </div>
            <span className={`mt-2 text-xs ${
              s.number <= step ? 'text-[#3582a1] font-semibold' : 'text-gray-500'
            }`}>
              {s.label}
            </span>
            {index < steps.length - 1 && (
              <div
                className={`absolute top-5 -right-1/2 w-full h-1 ${
                  s.number < step ? 'bg-[#3582a1]' : 'bg-gray-200'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressIndicator;