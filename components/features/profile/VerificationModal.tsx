"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FiX,
  FiShield,
  FiLock,
  FiCheckCircle,
  FiAlertCircle,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
} from "react-icons/fi";
import { useNinjaKYC } from "@/hooks/profile/useNinjaKYC";
import { ninjaKycSchema, type NinjaKYCInput } from "@/lib/validations/kyc.schema";
import Input from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import type { NinjaKYCResponse } from "@/services/ninja-kyc.service";
import {
  fingerprintAttempt,
  getCooldownRemaining,
  recordFailedAttempt,
  startCooldown,
  wasJustFailed,
  clearLastAttempt,
} from "@/lib/kyc-guard";

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  defaultFirstName?: string;
  defaultLastName?: string;
}

type Step = "form" | "confirm";

const maskNin = (nin: string) => {
  if (nin.length <= 4) return nin;
  return `${"•".repeat(nin.length - 4)}${nin.slice(-4)}`;
};

const formatDob = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function VerificationModal({
  isOpen,
  onClose,
  onSuccess,
  defaultFirstName = "",
  defaultLastName = "",
}: VerificationModalProps) {
  const { user } = useAuth();
  const userId = user?.id ?? "anon";
  const { mutate: identify, isPending } = useNinjaKYC();

  const [step, setStep] = React.useState<Step>("form");
  const [revealNin, setRevealNin] = React.useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = React.useState<number | null>(null);
  const [cooldownMs, setCooldownMs] = React.useState(0);
  const [toast, setToast] = React.useState<{
    message: string;
    tone: "success" | "error" | "warning";
  } | null>(null);

  const showToast = (message: string, tone: "success" | "error" | "warning") => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 5000);
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<NinjaKYCInput>({
    resolver: zodResolver(ninjaKycSchema),
    mode: "onChange",
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

  React.useEffect(() => {
    if (!isOpen) {
      setStep("form");
      setRevealNin(false);
      return;
    }
    setCooldownMs(getCooldownRemaining(userId));
  }, [isOpen, userId]);

  React.useEffect(() => {
    if (cooldownMs <= 0) return;
    const interval = setInterval(() => {
      const remaining = getCooldownRemaining(userId);
      setCooldownMs(remaining);
      if (remaining <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldownMs, userId]);

  const goToConfirm = () => {
    const { nin, dateOfBirth } = getValues();
    if (wasJustFailed(userId, fingerprintAttempt(nin, dateOfBirth))) {
      showToast(
        "You just tried these exact details. Edit at least one field before retrying.",
        "warning"
      );
      return;
    }
    setStep("confirm");
  };

  const submitVerified = (data: NinjaKYCInput) => {
    if (getCooldownRemaining(userId) > 0) {
      showToast("Please wait a moment before trying again.", "warning");
      return;
    }

    identify(data, {
      onSuccess: (response) => {
        const payload = response.data as NinjaKYCResponse;
        if (typeof payload.attemptsRemaining === "number") {
          setAttemptsRemaining(payload.attemptsRemaining);
        }

        if (payload.verified) {
          clearLastAttempt(userId);
          showToast("Identity verified successfully.", "success");
          reset();
          setTimeout(() => {
            onSuccess?.();
            onClose();
          }, 1500);
        } else {
          recordFailedAttempt(userId, fingerprintAttempt(data.nin, data.dateOfBirth));
          startCooldown(userId);
          setCooldownMs(getCooldownRemaining(userId));
          setStep("form");
          showToast(
            "Details do not match our records. Please double-check your NIN and date of birth.",
            "error"
          );
        }
      },
      onError: (error: unknown) => {
        const err = error as {
          response?: { status?: number; data?: { code?: string; attemptsRemaining?: number; retryAfter?: number } };
        };
        const status = err?.response?.status;
        const code = err?.response?.data?.code;
        const remaining = err?.response?.data?.attemptsRemaining;
        if (typeof remaining === "number") setAttemptsRemaining(remaining);

        recordFailedAttempt(userId, fingerprintAttempt(data.nin, data.dateOfBirth));
        startCooldown(userId);
        setCooldownMs(getCooldownRemaining(userId));
        setStep("form");

        let message = "Verification failed. Please check your details and try again.";
        if (code === "NIN_ALREADY_LINKED" || status === 409) {
          message =
            code === "ALREADY_VERIFIED"
              ? "Your identity has already been verified."
              : "This NIN is already linked to another account. If this is yours, contact support.";
        } else if (status === 429) {
          message = "Too many attempts. Please try again in 24 hours.";
        } else if (!status || status >= 500) {
          message = "Verification service is temporarily unavailable. Please try again later.";
        }
        showToast(message, "error");
      },
    });
  };

  if (!isOpen) return null;

  const values = getValues();
  const cooldownSec = Math.ceil(cooldownMs / 1000);
  const confirmDisabled = isPending || cooldownMs > 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[#111] border border-white/10 rounded-[24px] p-6 lg:p-8 flex flex-col gap-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-white/50 hover:text-white transition-colors"
          aria-label="Close"
        >
          <FiX size={18} />
        </button>

        <div className="flex items-center gap-3 pr-8">
          {step === "confirm" && (
            <button
              type="button"
              onClick={() => setStep("form")}
              className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              aria-label="Back"
            >
              <FiArrowLeft size={16} />
            </button>
          )}
          <div className="p-3 bg-primary-green/10 border border-primary-green/30 rounded-xl text-primary-green shrink-0">
            <FiShield size={22} />
          </div>
          <div>
            <h3 className="font-raleway font-bold text-[18px] text-white leading-tight">
              {step === "form" ? "Verify Your Identity" : "Confirm Your Details"}
            </h3>
            <p className="font-inter text-[13px] text-white/50 mt-0.5">
              {step === "form"
                ? "Enter your NIN and personal details below."
                : "Review carefully — wrong details still count as an attempt."}
            </p>
          </div>
        </div>

        {step === "form" && (
          <form onSubmit={handleSubmit(goToConfirm)} className="flex flex-col gap-4">
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
              Name is pulled from your profile. If it&apos;s wrong, update it in settings first —
              mismatches count toward your daily limit.
            </p>

            <Input
              label="NIN (National Identification Number)"
              variant="glass"
              placeholder="Enter your 11-digit NIN"
              maxLength={11}
              inputMode="numeric"
              error={errors.nin?.message}
              {...register("nin", {
                onChange: (e) => {
                  e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
                },
              })}
            />

            <Input
              label="Date of Birth"
              variant="glass"
              type="date"
              max={new Date().toISOString().split("T")[0]}
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
              disabled={!isValid || cooldownMs > 0}
              className="w-full bg-primary-green hover:bg-primary-green/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-raleway font-semibold text-[14px] px-8 py-3 rounded-full transition-colors shadow-[0_4px_14px_rgba(115,191,68,0.25)]"
            >
              {cooldownMs > 0 ? `Wait ${cooldownSec}s` : "Review Details"}
            </button>
          </form>
        )}

        {step === "confirm" && (
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
              <Row label="Name">
                {values.firstName} {values.lastName}
              </Row>
              <Row label="NIN">
                <div className="flex items-center gap-2">
                  <span className="font-mono tracking-wider">
                    {revealNin ? values.nin : maskNin(values.nin)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setRevealNin((v) => !v)}
                    className="text-white/40 hover:text-white"
                    aria-label={revealNin ? "Hide NIN" : "Show NIN"}
                  >
                    {revealNin ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                  </button>
                </div>
              </Row>
              <Row label="Date of Birth">{formatDob(values.dateOfBirth)}</Row>
            </div>

            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-amber-200 font-inter text-[12px] leading-relaxed">
              We&apos;ll check these against NIMC. A mismatch still counts as an attempt.
              {attemptsRemaining !== null && (
                <>
                  {" "}
                  You have <strong>{attemptsRemaining}</strong> attempt
                  {attemptsRemaining === 1 ? "" : "s"} remaining today.
                </>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep("form")}
                disabled={isPending}
                className="flex-1 border border-white/15 text-white/80 hover:bg-white/5 font-raleway font-semibold text-[14px] py-3 rounded-full transition-colors disabled:opacity-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => submitVerified(values)}
                disabled={confirmDisabled}
                className="flex-1 bg-primary-green hover:bg-primary-green/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-raleway font-semibold text-[14px] py-3 rounded-full transition-colors"
              >
                {isPending
                  ? "Verifying..."
                  : cooldownMs > 0
                  ? `Wait ${cooldownSec}s`
                  : "Confirm & Verify"}
              </button>
            </div>
          </div>
        )}

        {toast && (
          <div
            className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm font-semibold border ${
              toast.tone === "success"
                ? "bg-primary-green/20 border-primary-green/50 text-primary-green"
                : toast.tone === "warning"
                ? "bg-amber-500/20 border-amber-500/50 text-amber-300"
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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 last:border-b-0">
      <span className="font-inter text-[12px] text-white/50">{label}</span>
      <span className="font-inter text-[14px] text-white">{children}</span>
    </div>
  );
}
