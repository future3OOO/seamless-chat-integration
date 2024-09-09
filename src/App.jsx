import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PersonalInfoForm from './components/PersonalInfoForm';
import PropertyDetailsForm from './components/PropertyDetailsForm';
import IssueDescriptionForm from './components/IssueDescriptionForm';
import ThankYouMessage from './components/ThankYouMessage';
import NotFound from './components/NotFound';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-[#3582a1] to-[#8ecfdc] py-8 px-4 sm:py-12 md:py-8">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
          <Routes>
            <Route path="/" element={<Navigate to="/personal-info" replace />} />
            <Route path="/personal-info" element={<PersonalInfoForm />} />
            <Route path="/property-details" element={<PropertyDetailsForm />} />
            <Route path="/issue-description" element={<IssueDescriptionForm />} />
            <Route path="/thank-you" element={<ThankYouMessage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;