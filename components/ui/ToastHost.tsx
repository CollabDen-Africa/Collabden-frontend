"use client";

import { useSyncExternalStore } from "react";
import { HiCheck } from "react-icons/hi";
import { FiX } from "react-icons/fi";
import { getServerSnapshot, getSnapshot, subscribe, toast } from "@/lib/toast";

/** Mount once, e.g. inside your Providers component, below QueryClientProvider. */
export default function ToastHost() {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (items.length === 0) return null;

  return (
    <div className="fixed right-5 top-5 lg:top-20 z-100 flex w-[calc(100vw-2.5rem)] max-w-sm flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          role={item.tone === "error" ? "alert" : "status"}
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm shadow-xl animate-in fade-in slide-in-from-top-2 duration-200 ${
            item.tone === "error"
              ? "border-red-400/40 bg-[#251515] text-red-200"
              : "border-primary-green/40 bg-[#15251e] text-white"
          }`}
        >
          {item.tone === "error" ? (
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-500/20 font-bold text-red-400">
              !
            </span>
          ) : (
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-green text-[#15251e]">
              <HiCheck size={16} />
            </span>
          )}
          <span className="flex-1 leading-6">{item.message}</span>
          <button
            type="button"
            onClick={() => toast.dismiss(item.id)}
            aria-label="Dismiss"
            className="mt-1 shrink-0 text-white/40 transition-colors hover:text-white"
          >
            <FiX size={14} />
          </button>
        </div>
      ))}
    </div>
  );
}