"use client";

import React, { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { FiSmartphone, FiLock, FiKey, FiLoader, FiMail } from "react-icons/fi";
import { useSecurity } from "@/hooks/security/useSecurity";
import { useProfile } from "@/hooks/profile/useProfile";
import profileService from "@/services/profile.service";

export default function ProfileSettingsSecurity() {
  const { useSetup2FA, useVerify2FA } = useSecurity();
  const setup2FAMutation = useSetup2FA();
  const verify2FAMutation = useVerify2FA();

  const { useCurrentProfile, useAddBackupEmail, useVerifyBackupEmail, useRemoveBackupEmail } = useProfile();
  const { data: currentProfile } = useCurrentProfile();
  const addBackupEmailMutation = useAddBackupEmail();
  const verifyBackupEmailMutation = useVerifyBackupEmail();
  const removeBackupEmailMutation = useRemoveBackupEmail();

  // Backup email state
  const [showBackupEmailForm, setShowBackupEmailForm] = useState(false);
  const [backupEmailInput, setBackupEmailInput] = useState("");
  const [backupEmailToken, setBackupEmailToken] = useState("");
  const [backupEmailStatus, setBackupEmailStatus] = useState<string | null>(null);
  const [awaitingBackupEmailVerification, setAwaitingBackupEmailVerification] = useState(false);

  const existingBackupEmail: string | null = currentProfile?.backupEmail ?? null;
  const backupEmailVerified: boolean = Boolean(currentProfile?.backupEmailVerified);
  const hasPendingBackupEmail = Boolean(existingBackupEmail) && !backupEmailVerified;

  const [show2FAModal, setShow2FAModal] = useState(false);
  const [qrCodeData, setQrCodeData] = useState<{ secret: string; qrCodeUrl: string } | null>(null);
  const [tokenInput, setTokenInput] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  // Password change state
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState<string | null>(null);

  // Math for the Security Score Progress Ring (92%)
  const percentage = is2FAEnabled ? 92 : 60;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleStart2FASetup = async () => {
    try {
      const res = await setup2FAMutation.mutateAsync();
      setQrCodeData(res);
      setShow2FAModal(true);
    } catch (err) {
      console.error("Failed to setup 2FA:", err);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim()) return;
    try {
      await verify2FAMutation.mutateAsync(tokenInput);
      setIs2FAEnabled(true);
      setShow2FAModal(false);
      setQrCodeData(null);
      setTokenInput("");
    } catch (err) {
      console.error("Verification failed:", err);
    }
  };

  const handleAddBackupEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!backupEmailInput.trim()) return;
    try {
      await addBackupEmailMutation.mutateAsync(backupEmailInput.trim());
      setBackupEmailStatus("Verification code sent — check that inbox.");
      setAwaitingBackupEmailVerification(true);
    } catch (err: any) {
      setBackupEmailStatus(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Failed to add backup email"
      );
    }
  };

  const handleVerifyBackupEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!backupEmailToken.trim()) return;
    try {
      await verifyBackupEmailMutation.mutateAsync(backupEmailToken.trim());
      setBackupEmailStatus("Backup email verified!");
      setAwaitingBackupEmailVerification(false);
      setBackupEmailInput("");
      setBackupEmailToken("");
      setTimeout(() => {
        setShowBackupEmailForm(false);
        setBackupEmailStatus(null);
      }, 1500);
    } catch (err: any) {
      setBackupEmailStatus(
        err.response?.data?.error ||
          err.response?.data?.message ||
          err.message ||
          "Verification failed"
      );
    }
  };

  const handleRemoveBackupEmail = async () => {
    try {
      await removeBackupEmailMutation.mutateAsync();
      setBackupEmailStatus("Backup email removed.");
      setAwaitingBackupEmailVerification(false);
      setBackupEmailInput("");
      setBackupEmailToken("");
    } catch (err: any) {
      setBackupEmailStatus(err.response?.data?.message || "Failed to remove backup email");
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordStatus("Passwords do not match");
      return;
    }
    try {
      await profileService.changePassword({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setPasswordStatus("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setShowPasswordForm(false), 2000);
    } catch (err: any) {
      setPasswordStatus(err.response?.data?.message || "Failed to change password");
    }
  };

  return (
    <div className="flex flex-col w-full flex-1 gap-6 animate-in fade-in duration-300 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-1.5 mb-3">
        <h1 className="font-raleway font-semibold text-[26.4px] leading-8.5 text-white/90">
          Security & Verification
        </h1>
        <p className="font-raleway font-normal text-[20.5px] leading-7.25 text-text-muted">
          Protect your account and verify your identity
        </p>
      </div>

      {/* Security Score Card */}
      <div className="w-full bg-white/10 border border-[#73BF44]/20 rounded-[35px] p-8.75 flex flex-row items-center gap-7.5 backdrop-blur-md">
        {/* Score Ring */}
        <div className="relative w-26.75 h-26.75 flex items-center justify-center shrink-0">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 107 107">
            <circle cx="53.5" cy="53.5" r={radius} stroke="white" strokeOpacity="0.2" strokeWidth="6" fill="transparent" />
            <circle
              cx="53.5" cy="53.5" r={radius} stroke="#73BF44" strokeWidth="6" fill="transparent" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} className="transition-all duration-1000"
            />
          </svg>
          <span className="absolute font-raleway font-normal text-[28px] text-white">
            {percentage}%
          </span>
        </div>

        {/* Score Info */}
        <div className="flex flex-col flex-1">
          <span className="font-raleway font-semibold text-[23.4px] text-white mb-1">
            Security Score
          </span>
          <span className="font-inter font-normal text-[20.5px] text-text-muted mb-3">
            {is2FAEnabled ? "Your account is well protected" : "Enable 2FA to secure your account"}
          </span>
          <div className="flex gap-4">
            <span className={`font-raleway font-normal text-[17.6px] ${is2FAEnabled ? "text-primary-green" : "text-text-muted"}`}>2FA</span>
            <span className="font-raleway font-normal text-[17.6px] text-accent-soft-blue">Identity</span>
            <span className="font-raleway font-normal text-[17.6px] text-accent-soft-blue">Password</span>
          </div>
        </div>
      </div>

      {/* Two-Factor Authentication Card */}
      <div className="w-full bg-white/10 border border-white/10 rounded-[35px] flex flex-col backdrop-blur-md overflow-hidden">
        <div className="px-8.75 py-5.75 border-b-[1.6px] border-white/5 flex flex-col">
          <span className="font-raleway font-medium text-[20.5px] text-white/90">
            Two-Factor Authentication
          </span>
          <span className="font-raleway font-normal text-[17.6px] text-text-muted mt-0.5">
            Add an extra layer of security
          </span>
        </div>

        <div className="p-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* SMS Option */}
          <button className="flex items-start gap-4.5 p-6 border-[1.6px] border-white/20 rounded-[23.4px] text-left hover:bg-white/5 transition-colors opacity-55">
            <FiSmartphone size={24} className="text-white shrink-0 mt-1" />
            <div className="flex flex-col">
              <span className="font-inter font-medium text-[20.5px] text-white">SMS Code Verification</span>
              <span className="font-inter font-medium text-[17.6px] text-text-muted mt-1.5">
                Coming soon — receive OTP codes via text
              </span>
            </div>
          </button>

          {/* Authenticator App Option */}
          <button
            onClick={is2FAEnabled ? undefined : handleStart2FASetup}
            disabled={is2FAEnabled || setup2FAMutation.isPending}
            className={`flex items-start gap-4.5 p-6 border-[1.6px] rounded-[23.4px] text-left relative overflow-hidden group transition-all ${
              is2FAEnabled ? "bg-primary-green border-border-muted/35" : "border-white/20 hover:bg-white/5"
            }`}
          >
            <FiKey size={24} className="text-white shrink-0 mt-1 z-10" />
            <div className="flex flex-col flex-1 z-10">
              <div className="flex justify-between items-start w-full">
                <span className="font-inter font-medium text-[20.5px] text-white">Authenticator App</span>
                <div className="bg-white/15 rounded-full px-3 py-0.5">
                  <span className="font-inter font-medium text-[17.6px] text-white">
                    {is2FAEnabled ? "Active" : "Setup"}
                  </span>
                </div>
              </div>
              <span className="font-inter font-medium text-[17.6px] text-white/80 mt-1.5">
                Use Google Authenticator or Authy to receive security tokens
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 2FA Setup Modal */}
      {show2FAModal && qrCodeData && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1A2530] border border-white/10 rounded-[30px] p-8 max-w-md w-full flex flex-col items-center">
            <h3 className="font-raleway font-semibold text-[22px] text-white mb-2">Scan QR Code</h3>
            <p className="text-white/60 text-[14px] text-center mb-6">
              Scan this QR code with Google Authenticator or Authy, then enter the 6-digit verification code below.
            </p>

            <div className="bg-white p-4 rounded-xl mb-6">
              <Image
                src={qrCodeData.qrCodeUrl}
                alt="2FA QR Code"
                width={180}
                height={180}
                unoptimized
              />
            </div>

            <form onSubmit={handleVerify2FA} className="w-full flex flex-col gap-4">
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                className="w-full h-[50px] rounded-xl bg-black/30 border border-white/10 text-center text-white text-[20px] tracking-widest outline-none focus:border-primary-green"
              />
              <div className="flex gap-3 w-full mt-2">
                <Button
                  type="submit"
                  disabled={verify2FAMutation.isPending}
                  className="flex-1 bg-primary-green text-white"
                >
                  {verify2FAMutation.isPending ? <FiLoader className="animate-spin m-auto" /> : "Verify & Enable"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShow2FAModal(false);
                    setQrCodeData(null);
                  }}
                  className="flex-1 text-white border-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Password Card */}
      <div className="w-full bg-white/10 border border-white/10 rounded-[35px] px-7.25 py-7.25 flex flex-col gap-6 backdrop-blur-md">
        <div className="flex flex-row items-center gap-6 w-full">
          <div className="w-[58.6px] h-[58.6px] bg-[#1E2E3A] border-2 border-border-muted/25 rounded-[23.4px] flex items-center justify-center shrink-0">
            <FiLock size={24} className="text-accent-soft-blue/60" />
          </div>

          <div className="flex flex-col flex-1">
            <span className="font-raleway font-medium text-[20.5px] text-white/90">Password</span>
            <span className="font-raleway font-normal text-[17.6px] text-accent-soft-blue/70">
              Manage your password and credentials
            </span>
          </div>

          <Button
            variant="outline"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="px-5! py-2! text-[17.6px] text-text-muted! border-white/10 hover:text-white! hover:bg-card-bg!"
          >
            {showPasswordForm ? "Close" : "Change"}
          </Button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="w-full flex flex-col gap-4 mt-2 border-t border-white/5 pt-4 animate-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] text-white/70">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full h-[45px] rounded-xl bg-black/20 border border-white/10 px-4 text-white outline-none focus:border-primary-green"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] text-white/70">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-[45px] rounded-xl bg-black/20 border border-white/10 px-4 text-white outline-none focus:border-primary-green"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] text-white/70">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-[45px] rounded-xl bg-black/20 border border-white/10 px-4 text-white outline-none focus:border-primary-green"
              />
            </div>

            {passwordStatus && (
              <span className={`text-[14px] ${passwordStatus.includes("success") ? "text-primary-green" : "text-red-400"}`}>
                {passwordStatus}
              </span>
            )}

            <Button type="submit" className="bg-primary-green text-white self-start px-6">
              Update Password
            </Button>
          </form>
        )}
      </div>

      {/* Backup Email Card */}
      <div className="w-full bg-white/10 border border-white/10 rounded-[35px] px-7.25 py-7.25 flex flex-col gap-6 backdrop-blur-md">
        <div className="flex flex-row items-center gap-6 w-full">
          <div className="w-[58.6px] h-[58.6px] bg-[#1E2E3A] border-2 border-border-muted/25 rounded-[23.4px] flex items-center justify-center shrink-0">
            <FiMail size={24} className="text-accent-soft-blue/60" />
          </div>

          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-raleway font-medium text-[20.5px] text-white/90">Backup Email</span>
            <span className="font-raleway font-normal text-[17.6px] text-accent-soft-blue/70 truncate">
              {existingBackupEmail
                ? `${existingBackupEmail} · ${backupEmailVerified ? "Verified" : "Pending verification"}`
                : "Recover your account if you lose access to your primary email"}
            </span>
          </div>

          {existingBackupEmail && backupEmailVerified ? (
            <Button
              variant="outline"
              onClick={handleRemoveBackupEmail}
              disabled={removeBackupEmailMutation.isPending}
              className="px-5! py-2! text-[17.6px] text-text-muted! border-white/10 hover:text-white! hover:bg-card-bg!"
            >
              {removeBackupEmailMutation.isPending ? <FiLoader className="animate-spin" /> : "Remove"}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setShowBackupEmailForm(!showBackupEmailForm);
                setBackupEmailStatus(null);
                if (hasPendingBackupEmail) setAwaitingBackupEmailVerification(true);
              }}
              className="px-5! py-2! text-[17.6px] text-text-muted! border-white/10 hover:text-white! hover:bg-card-bg!"
            >
              {showBackupEmailForm ? "Close" : hasPendingBackupEmail ? "Verify" : "Add"}
            </Button>
          )}
        </div>

        {showBackupEmailForm && !(existingBackupEmail && backupEmailVerified) && (
          <div className="w-full flex flex-col gap-4 mt-2 border-t border-white/5 pt-4 animate-in slide-in-from-top-4 duration-300">
            {!awaitingBackupEmailVerification && !hasPendingBackupEmail && (
              <form onSubmit={handleAddBackupEmail} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] text-white/70">Backup email address</label>
                  <input
                    type="email"
                    required
                    value={backupEmailInput}
                    onChange={(e) => setBackupEmailInput(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-[45px] rounded-xl bg-black/20 border border-white/10 px-4 text-white outline-none focus:border-primary-green"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={addBackupEmailMutation.isPending}
                  className="bg-primary-green text-white self-start px-6"
                >
                  {addBackupEmailMutation.isPending ? <FiLoader className="animate-spin" /> : "Send verification code"}
                </Button>
              </form>
            )}

            {(awaitingBackupEmailVerification || hasPendingBackupEmail) && (
              <form onSubmit={handleVerifyBackupEmail} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[14px] text-white/70">
                    Enter the 6-digit code sent to {existingBackupEmail || backupEmailInput}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={backupEmailToken}
                    onChange={(e) => setBackupEmailToken(e.target.value)}
                    placeholder="000000"
                    className="w-full h-[50px] rounded-xl bg-black/30 border border-white/10 px-4 text-center text-white text-[20px] tracking-widest outline-none focus:border-primary-green"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={verifyBackupEmailMutation.isPending}
                    className="bg-primary-green text-white px-6"
                  >
                    {verifyBackupEmailMutation.isPending ? <FiLoader className="animate-spin" /> : "Verify"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleRemoveBackupEmail}
                    disabled={removeBackupEmailMutation.isPending}
                    className="text-text-muted! border-white/10 hover:text-white! hover:bg-card-bg!"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {backupEmailStatus && (
              <span
                className={`text-[14px] ${
                  backupEmailStatus.toLowerCase().includes("fail") || backupEmailStatus.toLowerCase().includes("failed")
                    ? "text-red-400"
                    : "text-primary-green"
                }`}
              >
                {backupEmailStatus}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}