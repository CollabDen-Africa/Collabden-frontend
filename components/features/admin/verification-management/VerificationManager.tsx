import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import VerificationDashboard from './overview/VerificationDashboard';
import VerificationDetailsScreen from './VerificationDetails';
import VerificationHistoryScreen from './VerificationHistory';
import VerificationAuditLogScreen from './audit-log/VerificationAudit';
import VerificationDecisionModal from './DecisionModal';
import DocumentReviewScreen from './VerificationDocumentReview';


const MOCK_REQUESTS = [
  { 
    id: 'VRQ-0814', user: 'Amara Osei', initials: 'AO', userId: 'USR-0041', email: 'amara@mail.com', location: 'Accra, Ghana', accountType: 'Individual Artist', memberSince: 'Mar 4, 2024', type: 'Selfie + ID', status: 'Pending', attempts: 1, assigned: '—', date: 'Jul 12, 2025' 
  },
  { 
    id: 'VRQ-0811', user: 'Tolu Adeyemi', initials: 'TA', userId: 'USR-0102', email: 'tolu@mail.com', location: 'Abuja, Nigeria', accountType: 'Individual Artist', memberSince: 'Jan 14, 2025', type: 'Identity Document', status: 'Under Review', attempts: 1, assigned: 'Verification Admin', date: 'Jul 11, 2025' 
  },
  { 
    id: 'VRQ-0780', user: 'Marcus Lee', initials: 'ML', userId: 'USR-0318', email: 'marcus@mail.com', location: 'London, UK', accountType: 'Label/Manager', memberSince: 'Nov 2, 2023', type: 'Identity Document', status: 'Rejected', attempts: 3, assigned: 'Verification Admin', date: 'Jul 2, 2025' 
  }
];

type ViewState = 'dashboard' | 'details' | 'history' | 'audit' | 'review';

export default function VerificationManager() {
  // --- STATE ---
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [isDecisionModalOpen, setIsDecisionModalOpen] = useState(false);
  const activeRequest = MOCK_REQUESTS.find(req => req.id === selectedRequestId) || MOCK_REQUESTS[0];

  // --- NAVIGATION HANDLERS ---
  const navigateTo = (view: ViewState, requestId?: string) => {
    if (requestId) setSelectedRequestId(requestId);
    setCurrentView(view);
    window.scrollTo(0, 0); // Reset scroll on view change
  };

  const handleBackNavigation = () => {
      // If in the history view, go back to details. Otherwise, go back to the dashboard.
      if (currentView === 'history') {
        navigateTo('details', selectedRequestId || undefined);
      } else {
        navigateTo('dashboard');
      }
    };
  
    return (
      <div className="content-wrapper relative flex flex-col w-full min-h-screen bg-background custom-scrollbar">

        {/* Temporary Navigation Button */}
              {currentView !== 'dashboard' && (
                  <button 
                    onClick={handleBackNavigation}
                    className="flex items-center gap-2.5 text-white/45 hover:text-white transition-colors group"
                  >
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors">
                      <ArrowLeft size={14} />
                    </div>
                    <span className="font-raleway font-semibold text-[13px]">
                      {currentView === 'history' 
                        ? `Back to Request ${selectedRequestId || 'Details'}` 
                        : 'Back'}
                    </span>
                  </button>
              )}
  
        {/* Main Content Area */}
        <div className="flex flex-col flex-1 w-full relative">
          {currentView === 'dashboard' && (
            <VerificationDashboard 
              onViewDetails={(id) => navigateTo('details', id)} 
              onReviewDocument={(id) => navigateTo('review', id)}
              onViewAudit={() => navigateTo('audit')}
            />
          )}
          {currentView === 'details' && (
            <VerificationDetailsScreen 
              requestData={activeRequest}
            />
          )}
          {currentView === 'review' && (
            <DocumentReviewScreen
              data={activeRequest}
              onMakeDecision={() => setIsDecisionModalOpen(true)}
            />
                  )}
          {currentView === 'history' && (
            <VerificationHistoryScreen 
              requestData={activeRequest} 
              onBackToDetails={() => navigateTo('details')}
            />
          )}
          {currentView === 'audit' && (
            <VerificationAuditLogScreen />
          )}
        </div>
  
        {/* Decision Modal Overlay */}
        {isDecisionModalOpen && (
          <div className="fixed inset-0 z-50 flex justify-center items-start overflow-y-auto bg-black/60 backdrop-blur-sm pt-20 custom-scrollbar">
            <VerificationDecisionModal 
              requestData={activeRequest}
              onClose={() => setIsDecisionModalOpen(false)}
              onNavigate={(view: ViewState) => {
                setIsDecisionModalOpen(false);
                navigateTo(view);
              }}
            />
          </div>
        )}
      </div>
    );
  }