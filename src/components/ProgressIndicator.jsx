import React from 'react';

const ProgressIndicator = ({ step }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`w-1/3 h-2 ${
              s <= step ? 'bg-[#3582a1]' : 'bg-gray-200'
            } ${s === 1 ? 'rounded-l-full' : ''} ${
              s === 3 ? 'rounded-r-full' : ''
            }`}
          ></div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Personal</span>
        <span>Property</span>
        <span>Issue</span>
      </div>
    </div>
  );
};

export default ProgressIndicator;