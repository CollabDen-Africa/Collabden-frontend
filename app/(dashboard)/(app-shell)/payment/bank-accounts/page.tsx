"use client";

import React, { useState } from "react";
import { FiPlus, FiCheckCircle, FiCreditCard } from "react-icons/fi";
import EmptyState from "@/components/ui/EmptyState";
import AddEditBankAccountOverlay from "@/components/features/bank-account/AddEditBankAccount";
import BankVerificationOverlay from "@/components/features/bank-account/BankVerification";
import { usePayment } from "@/hooks/payment/usePayment";

export default function BankAccountsPage() {
  const { useBankAccounts, useAddBankAccount, useUpdateBankAccount, useRemoveBankAccount } = usePayment();
  const { data: bankData, isLoading } = useBankAccounts();
  const addBankMutation = useAddBankAccount();
  const updateBankMutation = useUpdateBankAccount();
  const removeBankMutation = useRemoveBankAccount();
  
  const accounts = bankData || [];
  
  // Overlay States
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<any | null>(null);

  // Remove Account
  const handleRemoveAccount = (id: string) => {
    removeBankMutation.mutate(id);
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
    if (editingAccount) {
      // UPDATE EXISTING
      updateBankMutation.mutate(
        { id: editingAccount.id, data },
        {
          onSuccess: () => {
          setIsAddEditOpen(false);
          setEditingAccount(null);
          },
        }
        );
      } else {
        // ADD NEW
        addBankMutation.mutate(data, {
          onSuccess: () => {
            setIsAddEditOpen(false);
            setIsVerificationOpen(true);
          },
        });
      }
    };

  return (
    <div className="flex flex-col w-full px-5 lg:px-0 pb-10">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between md:items-end w-full mb-10 gap-5">
        <div></div> 
        
        {/* Add Bank Account Button */}
        <button 
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 h-12 px-6 bg-primary-green/90 hover:bg-accent-green-bright/60 transition-colors rounded-full shadow-[0_4px_14px_rgba(115,191,68,0.3)] shrink-0"
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8 w-full">
          {accounts.map((account) => (
            <div 
              key={account.id}
              className="flex flex-col w-full bg-black/10 backdrop-blur-xl border border-white/30 rounded-[30px] p-6 lg:p-8 shadow-xl shadow-primary-blue/5 transition-transform hover:-translate-y-1 duration-300"
            >
              
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start w-full gap-4 mb-6">
                
                {/* Bank Details */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-raleway font-semibold text-[20px] lg:text-[24px] leading-9.5 text-white">
                      {account.bankName}
                    </h3>
                    {/* {account.isVerified && (
                      <div className="flex items-center gap-1.5 bg-primary-green/10 border border-primary-green/20 px-2.5 py-0.5 rounded-full">
                        <FiCheckCircle className="text-primary-green" size={14} />
                        <span className="font-raleway font-medium text-[13px] lg:text-[14px] text-primary-green">
                          Verified
                        </span>
                      </div>
                    )} */}
                  </div> 
                  
                  <span className="font-raleway font-normal text-[16px] lg:text-[18px] text-white/60">
                    {account.accountName} • ****{account.accountNumber?.slice(-4)}
                  </span>
                </div>

                {/* Primary Tag */}
                {account.isDefault && (
                  <div className="flex items-center justify-center bg-white/20 border border-white/30 px-4 py-1.5 rounded-full shrink-0 shadow-sm">
                    <span className="font-raleway font-medium text-[14px] lg:text-[16px] text-white">
                      Primary
                    </span>
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="flex items-center gap-3 w-full mt-auto pt-4">
                <button 
                  onClick={() => handleOpenEdit(account)}
                  className="flex-1 h-12 flex items-center justify-center bg-white/50 hover:bg-white/70 border border-white/60 rounded-full transition-colors"
                >
                  <span className="font-raleway font-medium text-[16px] text-primary-blue">
                    Edit
                  </span>
                </button>
                
                <button 
                  onClick={() => handleRemoveAccount(account.id)}
                  className="flex-1 h-12 flex items-center justify-center bg-accent-red/20 hover:bg-accent-red/40 border border-accent-red/30 rounded-full transition-colors"
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