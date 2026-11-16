/**
 * Tiny dependency-free toast store.
 *
 *   import { toast } from "@/lib/toast";
 *   toast.error("We couldn't save that.");
 *   toast.success("Saved!");
 *
 * Render <ToastHost /> once near the root (see ToastHost.tsx).
 * If you already have a toast library, replace the body of `toast.error` /
 * `toast.success` with calls to it and delete ToastHost.
 */

export type ToastTone = "error" | "success";

export interface ToastItem {
  id: number;
  message: string;
  tone: ToastTone;
}

const DISMISS_AFTER_MS = 5_000;
const MAX_VISIBLE = 3;
const EMPTY: ToastItem[] = [];

let toasts: ToastItem[] = EMPTY;
let nextId = 1;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((listener) => listener());

const dismiss = (id: number) => {
  toasts = toasts.filter((item) => item.id !== id);
  emit();
};

const push = (message: string, tone: ToastTone) => {
  // Don't stack identical messages (e.g. several queries failing on one outage)
  if (toasts.some((item) => item.message === message && item.tone === tone)) return;

  const id = nextId++;
  toasts = [...toasts, { id, message, tone }].slice(-MAX_VISIBLE);
  emit();

  if (typeof window !== "undefined") {
    window.setTimeout(() => dismiss(id), DISMISS_AFTER_MS);
  }
};

export const toast = {
  error: (message: string) => push(message, "error"),
  success: (message: string) => push(message, "success"),
  dismiss,
};

// For useSyncExternalStore
export const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};
export const getSnapshot = () => toasts;
export const getServerSnapshot = () => EMPTY;