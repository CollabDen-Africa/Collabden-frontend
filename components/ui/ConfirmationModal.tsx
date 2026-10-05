"use client";

import React, { useState } from "react";
import { FiAlertTriangle, FiTrash2, FiInfo, FiCheck } from "react-icons/fi";
import Modal from "./Modal";

export type ConfirmationVariant = "danger" | "warning" | "primary" | "success";

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmationVariant;
  isLoading?: boolean;
  maxWidth?: string;
  icon?: React.ReactNode;
}

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  isLoading = false,
  maxWidth = "max-w-[460px]",
  icon,
}: ConfirmationModalProps) {
  const [internalLoading, setInternalLoading] = useState(false);
  const loading = isLoading || internalLoading;

  const handleConfirm = async () => {
    try {
      setInternalLoading(true);
      await onConfirm();
    } finally {
      setInternalLoading(false);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          iconBg: "bg-red-500/15 border-red-500/30 text-red-400",
          defaultIcon: <FiTrash2 size={24} />,
          buttonBg:
            "bg-red-500 hover:bg-red-600 text-white shadow-[0_4px_14px_rgba(239,68,68,0.35)] focus:ring-red-500",
        };
      case "warning":
        return {
          iconBg: "bg-amber-500/15 border-amber-500/30 text-amber-300",
          defaultIcon: <FiAlertTriangle size={24} />,
          buttonBg:
            "bg-amber-500 hover:bg-amber-600 text-white shadow-[0_4px_14px_rgba(245,158,11,0.35)] focus:ring-amber-500",
        };
      case "success":
        return {
          iconBg: "bg-primary-green/15 border-primary-green/30 text-primary-green",
          defaultIcon: <FiCheck size={24} />,
          buttonBg:
            "bg-primary-green hover:bg-accent-green-success text-white shadow-[0_4px_14px_rgba(115,191,68,0.35)] focus:ring-primary-green",
        };
      case "primary":
      default:
        return {
          iconBg: "bg-primary-blue/15 border-primary-blue/30 text-primary-blue",
          defaultIcon: <FiInfo size={24} />,
          buttonBg:
            "bg-primary-blue hover:brightness-110 text-white shadow-[0_4px_14px_rgba(30,144,255,0.35)] focus:ring-primary-blue",
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Modal
      isOpen={isOpen}
      onClose={loading ? () => {} : onClose}
      maxWidth={maxWidth}
      className="p-6 sm:p-7 pt-8 sm:pt-9"
      showCloseButton={!loading}
    >
      <div className="flex flex-col items-center text-center gap-4">
        {/* Icon Badge */}
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-sm ${variantStyles.iconBg}`}
        >
          {icon || variantStyles.defaultIcon}
        </div>

        {/* Title & Description */}
        <div className="flex flex-col gap-2">
          <h3 className="font-raleway font-bold text-[20px] text-white leading-tight">
            {title}
          </h3>
          <div className="font-raleway font-medium text-[14px] text-white/70 leading-relaxed">
            {description}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 w-full mt-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-3 px-5 rounded-full font-raleway font-semibold text-[14px] text-white/80 bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 py-3 px-5 rounded-full font-raleway font-semibold text-[14px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer ${variantStyles.buttonBg}`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
