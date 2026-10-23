"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiX, FiShield, FiLock, FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import { useNinjaKYC } from "@/hooks/profile/useNinjaKYC";
import { ninjaKycSchema, type NinjaKYCInput } from "@/lib/validations/kyc.schema";
import Input from "@/components/ui/Input";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultFirstName?: string;
  defaultLastName?: string;
}

export default function VerificationModal({
  isOpen,
  onClose,
  onSuccess,
  defaultFirstName = "",
  defaultLastName = "",
}: VerificationModalProps) {
  const { mutate: identify, isPending } = useNinjaKYC();
  const [toast, setToast] = React.useState<{
    message: string;
    tone: "success" | "error";
  } | null>(null);

  const showToast = (message: string, tone: "success" | "error") => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 4000);
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<NinjaKYCInput>({
    resolver: zodResolver(ninjaKycSchema),
    defaultValues: {
      firstName: defaultFirstName,
      lastName: defaultLastName,
      nin: "",
      dateOfBirth: "",
    },
  });

  React.useEffect(() => {
    setValue("firstName", defaultFirstName);
    setValue("lastName", defaultLastName);
  }, [defaultFirstName, defaultLastName, setValue]);

  const onSubmit = (data: NinjaKYCInput) => {
    identify(data, {
      onSuccess: (response) => {
        if (response.data.verified) {
          showToast("Identity verified successfully.", "success");
          reset();
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 1500);
        } else {
          showToast(
            "Details do not match our records. Please check your NIN and personal information.",
            "error"
          );
        }
      },
      onError: (error: any) => {
        const status = error?.response?.status;
        const message =
          status === 429
            ? "Too many attempts. Please try again in 24 hours."
            : status === 409
            ? "Your identity has already been verified."
            : status >= 500 || !status
            ? "Verification service is temporarily unavailable. Please try again later."
            : "Verification failed. Please check your details and try again.";
        showToast(message, "error");
      },
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-[24px] p-6 lg:p-8 flex flex-col gap-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
        >
          <FiX size={18} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pr-8">
          <div className="p-3 bg-primary-green/10 border border-primary-green/30 rounded-xl text-primary-green shrink-0">
            <FiShield size={22} />
          </div>
          <div>
            <h3 className="font-raleway font-bold text-[18px] text-white leading-tight">
              Verify Your Identity
            </h3>
            <p className="font-inter text-[13px] text-white/50 mt-0.5">
              Enter your NIN and personal details below.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="font-inter text-[12px] text-white/50">First Name</span>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 font-inter text-[14px]">
                <FiLock size={12} className="text-white/30 shrink-0" />
                {defaultFirstName || "Not set"}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-inter text-[12px] text-white/50">Last Name</span>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white/60 font-inter text-[14px]">
                <FiLock size={12} className="text-white/30 shrink-0" />
                {defaultLastName || "Not set"}
              </div>
            </div>
          </div>
          <p className="font-inter text-[11px] text-white/30 -mt-2">
            To update your name, edit it in your profile settings first.
          </p>

          <Input
            label="NIN (National Identification Number)"
            variant="glass"
            placeholder="Enter your 11-digit NIN"
            maxLength={11}
            inputMode="numeric"
            error={errors.nin?.message}
            {...register("nin")}
          />

          <Input
            label="Date of Birth"
            variant="glass"
            type="date"
            error={errors.dateOfBirth?.message}
            {...register("dateOfBirth")}
          />

          <div className="flex items-center gap-2 text-white/40 mt-1">
            <FiLock size={12} className="text-primary-green shrink-0" />
            <span className="font-inter text-[11px]">
              Your data is encrypted and never shared.
            </span>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-primary-green hover:bg-primary-green/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-raleway font-semibold text-[14px] px-8 py-3 rounded-full transition-colors shadow-[0_4px_14px_rgba(115,191,68,0.25)]"
          >
            {isPending ? "Verifying..." : "Submit for Verification"}
          </button>
        </form>

        {/* Toast */}
        {toast && (
          <div
            className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold border ${
              toast.tone === "success"
                ? "bg-primary-green/20 border-primary-green/50 text-primary-green"
                : "bg-red-500/20 border-red-500/50 text-red-400"
            }`}
          >
            {toast.tone === "success" ? (
              <FiCheckCircle size={15} />
            ) : (
              <FiAlertCircle size={15} />
            )}
            {toast.message}
          </div>
        )}
      </div>
    </div>
  );
}
