"use client";

import React, { useState } from 'react';
import { ApplicationModalStep1 } from './ApplicationStep1';
import { ApplicationModalStep2 } from './ApplicationStep2';
import { ApplicationModalStep3 } from './ApplicationStep3';
import { ApplicationModalStep4 } from './ApplicationStep4';
import { ApplicationModalStep5 } from './ApplicationStep5';
import { ViewApplicationModal } from './ViewApplication';

export function ApplicationModalManager({ isOpen, onClose, project }) {
  const [step, setStep] = useState(1);
  const [appData, setAppData] = useState({
    introduction: '',
    portfolio: ''
  });
  const [showApplication, setShowApplication] = useState(false);

  // If the modal isn't open or no project is selected, don't render anything
  if (!isOpen || !project) return null;

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);
  
  const handleResetAndClose = () => {
    setStep(1);
    setAppData({ introduction: '', portfolio: '' });
    setShowApplication(false);
    onClose();
  };

  // Create the data payload for the ViewApplicationModal based on what is typed
    const completedApplication = {
      projectTitle: project.title,
      role: project.roles || 'Applicant', 
      status: 'Submitted',
      dateApplied: 'Just now',
      pitch: appData.introduction,
      portfolio: appData.portfolio
    };
  
    // If "View Applications" is clicked, intercept the render and show the receipt modal
    if (showApplication) {
      return (
        <ViewApplicationModal 
          isOpen={true} 
          onClose={handleResetAndClose} 
          application={completedApplication} 
        />
      );
    }

  // Format the data for Step 4's review screen based on what the user entered
  const reviewData = {
    introduction: appData.introduction.trim() !== '' ? 'Written' : 'Not written',
    portfolio: appData.portfolio !== '' ? 'Attached' : 'Skipped'
  };

  switch (step) {
    case 1:
      return <ApplicationModalStep1 onClose={handleResetAndClose} onNext={handleNext} projectData={project} />;
    case 2:
      return <ApplicationModalStep2 onClose={handleResetAndClose} onNext={handleNext} onBack={handleBack} projectData={project} appData={appData} setAppData={setAppData} />;
    case 3:
      return <ApplicationModalStep3 onClose={handleResetAndClose} onNext={handleNext} onBack={handleBack} projectData={project} appData={appData} setAppData={setAppData} />;
    case 4:
      return <ApplicationModalStep4 onClose={handleResetAndClose} onNext={handleNext} onBack={handleBack} projectData={project} applicationData={reviewData} />;
    case 5:
      return <ApplicationModalStep5 onClose={handleResetAndClose} onViewApplications={() => setShowApplication(true)} projectData={project} />;
    default:
      return null;
  }
}