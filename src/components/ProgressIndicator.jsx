import React, { useEffect } from 'react';

const ProgressIndicator = ({ step }) => {
  const steps = ['Personal', 'Property', 'Issue'];
  const lineColor = '#3582a1';

  useEffect(() => {
    const lineWidth = ((step - 1) / (steps.length - 1)) * 100;
    console.log(`Current step: ${step}`);
    console.log(`Progress line color: ${lineColor}`);
    console.log(`Progress line width: ${lineWidth}%`);
  }, [step]);

  return (
    <div className="mb-8 relative w-full">
      <div className="flex justify-between items-center">
        {steps.map((label, index) => (
          <div key={index} className="flex flex-col items-center relative z-10">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              index + 1 <= step ? 'bg-[#3582a1] text-white' : 'bg-white border-2 border-[#3582a1] text-[#3582a1]'
            } font-bold text-lg transition-all duration-300 ease-in-out shadow-md ${
              index + 1 === step ? 'scale-110' : ''
            }`}>
              {index + 1}
            </div>
            <div className="text-xs mt-2 font-medium text-gray-500">{label}</div>
          </div>
        ))}
      </div>
      <div className="absolute top-6 left-0 right-0 h-1 bg-gray-300" style={{ 
        zIndex: 0,
        left: '24px',
        right: '24px',
      }}>
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