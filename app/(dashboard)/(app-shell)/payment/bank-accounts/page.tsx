"use client";

import React, { useState } from "react";
import { FiPlus, FiCheckCircle, FiCreditCard } from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";
import AddEditBankAccountOverlay from "@/components/features/bank-account/AddEditBankAccount";
import BankVerificationOverlay from "@/components/features/bank-account/BankVerification";

// --- MOCK DATA ---
const MOCK_BANK_ACCOUNTS: any[] = [
  {
    id: "ba_1",
    bankName: "Chase Bank",
    accountType: "Checking",
    accountEnding: "4567",
    isPrimary: true,
    isVerified: true,
  },
  {
    id: "ba_2",
    bankName: "Wells Fargo",
    accountType: "Savings",
    accountEnding: "8901",
    isPrimary: false,
    isVerified: true,
  },
];

export default function BankAccountsPage() {
  const [accounts, setAccounts] = useState(MOCK_BANK_ACCOUNTS);
  
  // Overlay States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any | null>(null);

  // Remove Account
  const handleRemoveAccount = (id: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== id));
  };

  // Open Add flow
  const handleOpenAdd = () => {
    setEditingAccount(null);
    setIsAddEditOpen(true);
  };

  // Open Edit flow
  const handleOpenEdit = (account: any) => {
    setEditingAccount(account);
    setIsAddEditOpen(true);
  };

  // Handle Save (Add or Update)
  const handleSaveAccount = (data: any) => {
    let updatedAccounts = [...accounts];

    // If new account is marked primary, unmark all others
    if (data.isPrimary) {
      updatedAccounts = updatedAccounts.map(acc => ({ ...acc, isPrimary: false }));
    }

    if (editingAccount) {
      // UPDATE EXISTING
      updatedAccounts = updatedAccounts.map(acc => 
        acc.id === editingAccount.id 
          ? { 
              ...acc, 
              ...data, 
              accountEnding: data.accountNumber.slice(-4) 
            } 
          : acc
      );
    } else {
      // ADD NEW
      updatedAccounts.push({
        id: `ba_${Date.now()}`,
        bankName: data.bankName,
        accountType: data.accountType,
        accountEnding: data.accountNumber.slice(-4),
        isPrimary: data.isPrimary,
        isVerified: true // Auto-verified for this demo 
      });
    }

    setAccounts(updatedAccounts);
    setIsAddEditOpen(false);
    
    // Only show the success overlay if adding a new account
    if (!editingAccount) {
      setIsVerificationOpen(true);
    }
  };

  return (
    <div className="flex flex-col w-full px-[20px] lg:px-0 pb-[40px]">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between md:items-end w-full mb-[40px] gap-[20px]">
        <div></div> 
        
        {/* Add Bank Account Button */}
        <button 
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-[8px] h-[48px] px-[24px] bg-primary-green/90 hover:bg-accent-green-bright/60 transition-colors rounded-full shadow-[0_4px_14px_rgba(115,191,68,0.3)] shrink-0"
        >
          <FiPlus className="text-white" size={18} strokeWidth={2.5} />
          <span className="font-raleway font-semibold text-[15px] lg:text-[16px] text-white whitespace-nowrap">
            Add Bank Account
          </span>
        </button>
      </div>

      {/* Empty State */}
      {accounts.length === 0 ? (
        <EmptyState 
          icon={<FiCreditCard size={32} strokeWidth={1.5} />}
          title="No Bank Accounts Linked"
          description="Add a bank account to fund your wallet and withdraw your available funds."
          actionLabel="Link Bank Account"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-[24px] lg:gap-[32px] w-full">
          {accounts.map((account) => (
            <div 
              key={account.id}
              className="flex flex-col w-full bg-black/10 backdrop-blur-xl border border-white/30 rounded-[30px] p-[24px] lg:p-[32px] shadow-xl shadow-primary-blue/5 transition-transform hover:-translate-y-1 duration-300"
            >
              
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start w-full gap-[16px] mb-[24px]">
                
                {/* Bank Details */}
                <div className="flex flex-col gap-[8px]">
                  <div className="flex items-center gap-[12px]">
                    <h3 className="font-raleway font-semibold text-[20px] lg:text-[24px] leading-[38px] text-white">
                      {account.bankName}
                    </h3>
                    {account.isVerified && (
                      <div className="flex items-center gap-[6px] bg-primary-green/10 border border-primary-green/20 px-[10px] py-[2px] rounded-full">
                        <FiCheckCircle className="text-primary-green" size={14} />
                        <span className="font-raleway font-medium text-[13px] lg:text-[14px] text-primary-green">
                          Verified
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <span className="font-raleway font-normal text-[16px] lg:text-[18px] text-white/60">
                    {account.accountType} • ****{account.accountEnding}
                  </span>
                </div>

                {/* Primary Tag */}
                {account.isPrimary && (
                  <div className="flex items-center justify-center bg-white/20 border border-white/30 px-[16px] py-[6px] rounded-full shrink-0 shadow-sm">
                    <span className="font-raleway font-medium text-[14px] lg:text-[16px] text-white">
                      Primary
                    </span>
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-[12px] w-full mt-auto pt-[16px]">
                <button 
                  onClick={() => handleOpenEdit(account)}
                  className="flex-1 h-[48px] flex items-center justify-center bg-white/50 hover:bg-white/70 border border-white/60 rounded-full transition-colors"
                >
                  <span className="font-raleway font-medium text-[16px] text-primary-blue">
                    Edit
                  </span>
                </button>
                
                <button 
                  onClick={() => handleRemoveAccount(account.id)}
                  className="flex-1 h-[48px] flex items-center justify-center bg-accent-red/20 hover:bg-accent-red/40 border border-accent-red/30 rounded-full transition-colors"
                >
                  <span className="font-raleway font-medium text-[16px] text-accent-red-alt">
                    Remove
                  </span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* OVERLAYS */}
      <AddEditBankAccountOverlay 
        isOpen={isAddEditOpen}
        initialData={editingAccount}
        onClose={() => setIsAddEditOpen(false)}
        onSave={handleSaveAccount}
      />

      <BankVerificationOverlay 
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
      />

    </div>
  );
}