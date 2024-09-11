import React, { useEffect } from 'react';

const ProgressIndicator = ({ step, onStepClick }) => {
  const steps = ['Personal', 'Property', 'Issue'];
  const activeColor = '#2a6a84';
  const completedColor = '#3582a1';
  const inactiveColor = '#e2e8f0';

  useEffect(() => {
    const lineWidth = ((step - 1) / (steps.length - 1)) * 100;
    console.log(`Current step: ${step}`);
    console.log(`Progress line width: ${lineWidth}%`);
  }, [step]);

  return (
    <div className="mb-8 relative w-full">
      <div className="flex justify-between items-center">
        {steps.map((label, index) => (
          <div 
            key={index} 
            className="flex flex-col items-center relative z-10 cursor-pointer"
            onClick={() => onStepClick(index + 1)}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl transition-all duration-300 ease-in-out ${
                index + 1 === step
                  ? 'bg-[#2a6a84] scale-110 shadow-md'
                  : index + 1 < step
                  ? 'bg-[#3582a1]'
                  : 'bg-[#e2e8f0]'
              }`}
            >
              {index + 1}
            </div>
            <div
              className={`text-sm mt-2 font-medium transition-all duration-300 ${
                index + 1 === step ? 'text-[#2a6a84] font-bold' : 'text-gray-500'
              }`}
            >
              {label}
            </div>
          </div>
        ))}
      </div>
      <div
        className="absolute top-8 left-0 right-0 h-2 bg-[#e2e8f0]"
        style={{
          zIndex: 0,
          left: '32px',
          right: '32px',
        }}
      >
        <div
          className="h-full bg-[#3582a1] transition-all duration-300 ease-in-out"
          style={{
            width: `${((step - 1) / (steps.length - 1)) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressIndicator;