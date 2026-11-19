"use client";

import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createQueryClient } from '@/lib/query-client';
import ToastHost from '@/components/ui/ToastHost';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  // useState's initializer runs once, so the client (and its cache) survives re-renders.
  // Defaults and the global error toast are configured in lib/query-client.ts.
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastHost />
    </QueryClientProvider>
  );
}