import React from 'react';

const TailwindTest = () => {
  return (
    <div className="p-4 m-4 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors">
      <h2 className="text-2xl font-bold mb-2">Tailwind Test</h2>
      <p className="text-sm">If you can see this styled box, Tailwind is working!</p>
    </div>
  );
};

export default TailwindTest;