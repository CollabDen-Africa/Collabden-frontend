import React, { useState } from 'react';
import { Shield, Info, AlertCircle } from 'lucide-react';
import { Tabs } from '@/components/ui/Tabs'; 
import GeneralSettings from './GeneralTab';
import UsersPane from './users/UsersTab';
import MarketplacePane from './MarketplaceTab';
import PaymentsPane from './payment/PaymentsTab';
import NotificationsTab from './notifications/NotificationsTab';
import FeaturesTab from './FeaturesTab';
import ChangeHistoryTab from './ChangeHistoryTab';
import ConfirmChangeModal from './users/ConfirmChangeModal';
import ConfirmPaymentChangeModal from './payment/ConfirmPaymentChangeModal';

interface SettingsManagerProps {
  currentUser?: {
    role: string;
    accessLevel: string;
  };
}

export default function SettingsManager({ 
  currentUser = { role: 'Super Admin', accessLevel: 'Full Access' } 
}: SettingsManagerProps) {
  const tabList = [
    'General', 
    'Users', 
    'Marketplace', 
    'Payments', 
    'Notifications', 
    'Features', 
    'Change History'
  ];
  
  const [activeTab, setActiveTab] = useState('General');
  const [modals, setModals] = useState({ confirmUserChange: false, confirmPaymentChange: false });
  const [modalPayload, setModalPayload] = useState<any>({});
  const toggleModal = (modalName: keyof typeof modals, isOpen: boolean) => {
    setModals((prev) => ({ ...prev, [modalName]: isOpen }));
  };

  // Dynamic Content Configuration
  const headerContent: Record<string, any> = {
    'General': { 
      title: 'General Settings', 
      desc: 'Configure platform-wide behaviour, user rules, and feature availability. All changes are logged.',
      banner: { 
        type: 'warning', 
        text: 'Access to Platform Settings is restricted by role. Super Admins have full access. Finance Admins access payment settings only. Other roles cannot modify platform settings.' 
      }
    },
    'Users': { 
      title: 'Users & Access Controls', 
      desc: 'Configure how user accounts behave, who can register, and profile rules' 
    },
    'Marketplace': { 
      title: 'Marketplace Settings', 
      desc: 'Control marketplace availability, project-posting rules, and discovery' 
    },
    'Payments': { 
      title: 'Payment & Platform Fee Settings', 
      desc: 'Manage transaction fees, withdrawal rules, and supported payment methods.',
      banner: { 
        type: 'info', 
        text: 'Finance Admins may view but cannot modify payment configurations. Ensure changes comply with regional financial regulations.' 
      }
    },
    'Notifications': { title: 'Notifications', desc: 'Configure platform-wide alerts.' },
    'Features': { title: 'Features', desc: 'Toggle system features.' },
    'Change History': { title: 'Change History', desc: 'Audit log of all settings changes.' },
  };

  const activeHeader = headerContent[activeTab] || { title: activeTab, desc: 'Settings configuration.' };

  return (
    <div className="flex flex-col w-full max-w-400 bg-[#0A0A0A] text-white font-sans mx-auto rounded-xl border border-white/5 shadow-2xl overflow-hidden">
      
      {/* Header & Banner */}
      <div className="flex flex-col p-6 md:p-8 pb-0">
        
        {/* Title & Badge Row */}
        <div className="flex flex-row justify-between items-start w-full mb-6">
          <div className="flex flex-col">
            <h1 className="font-['Raleway'] font-bold text-xl leading-7.5">
              {activeHeader.title}
            </h1>
            <p className="font-['Raleway'] text-xs text-white/45 mt-1">
              {activeHeader.desc}
            </p>
          </div>
          <div className="flex items-center px-3 py-1.5 gap-1.5 bg-primary-green/10 border border-primary-green/20 rounded-lg shrink-0">
            <Shield className="w-3 h-3 text-primary-green" />
            <span className="font-bold text-[11px] text-primary-green">
              {currentUser.role} — {currentUser.accessLevel}
            </span>
          </div>
        </div>

        {/* Conditional Info Banner */}
        {activeHeader.banner && (
          <div className={`flex flex-row items-center p-3 gap-2.5 w-full border rounded-xl mb-6 ${
            activeHeader.banner.type === 'info' 
              ? 'bg-[#11EA9B]/4 border-[#11EA9B]/20 text-[#11EA9B]' 
              : 'bg-[#E2C806]/4 border-[#E2C806]/20 text-[#E2C806]'
          }`}>
            {activeHeader.banner.type === 'info' ? (
              <Info className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            )}
            <p className="font-['Inter'] text-[11px] leading-relaxed">
              {activeHeader.banner.text}
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <Tabs 
        tabs={tabList} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      <div className="flex flex-col p-6 md:p-8 w-full bg-[#050505]/50">
        {activeTab === 'General' && (
          <GeneralSettings />
        )}
        {activeTab === 'Users' && (
          <UsersPane onTriggerConfirm={() => toggleModal('confirmUserChange', true)} />
        )}
        {activeTab === 'Marketplace' && (
          <MarketplacePane />
        )}
        {activeTab === 'Payments' && (
          <PaymentsPane onTriggerConfirm={() => toggleModal('confirmPaymentChange', true)} />
        )}
        {activeTab === 'Notifications' && (
          <NotificationsTab />
        )}
        {activeTab === 'Features' && (
          <FeaturesTab />
        )}
        {activeTab === 'Change History' && (
          <ChangeHistoryTab />
        )}
      </div>

      {/* Modals */}
      <ConfirmChangeModal 
        isOpen={modals.confirmUserChange} 
        onClose={() =>  
          toggleModal('confirmUserChange', false)}
        onConfirm={() =>
          toggleModal('confirmUserChange', false)}
          title={modalPayload.title}
          subtitle={modalPayload.subtitle}
          impactTitle={modalPayload.impactTitle}
          impactList={modalPayload.impactList}
      />
      
      <ConfirmPaymentChangeModal 
        isOpen={modals.confirmPaymentChange} 
        onClose={() => toggleModal('confirmPaymentChange', false)}
        onConfirm={() =>
          toggleModal('confirmPaymentChange', false)}
        changes={modalPayload.changes}
      />
    </div>
  );
}