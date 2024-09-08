import React from 'react';

const PoweredByLink = () => {
  return (
    <div className="mt-8 text-center text-sm text-gray-500">
      Powered by{' '}
      <a 
        href="https://propertypartner.co.nz/maintenance" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-[#3582a1] hover:underline"
      >
        Property Partner
      </a>
    </div>
  );
};

export default PoweredByLink;