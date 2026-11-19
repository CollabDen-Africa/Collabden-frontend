import { MutationCache, QueryCache, QueryClient, type Mutation } from "@tanstack/react-query";
import { handleApiError } from "@/lib/error-handler";
import { getFriendlyError, type ErrorContext } from "@/lib/error-messages";
import { toast } from "@/lib/toast";

/**
 * Metadata a hook can attach to a query/mutation:
 *
 *   useMutation({ mutationFn, meta: { errorContext: "bank.add" } })
 *   useMutation({ mutationFn, meta: { errorContext: "auth.login", toast: false } })
 *
 * - errorContext: which friendly wording to use (see error-messages.ts).
 *                 No errorContext = no toast (the error is still logged for mutations).
 *                 Can be a function of the mutation's variables when one hook covers
 *                 several actions (e.g. approve / request changes / reject):
 *                   errorContext: (v) => v.status === "REJECTED" ? "a.reject" : "a.approve"
 * - toast: false  = the page shows its own inline error, so don't also toast.
 */
export interface AppMeta extends Record<string, unknown> {
  errorContext?: ErrorContext | ((variables: any) => ErrorContext);
  toast?: boolean;
}

declare module "@tanstack/react-query" {
  interface Register {
    queryMeta: AppMeta;
    mutationMeta: AppMeta;
  }
}

const report = (error: unknown, meta: AppMeta | undefined, variables?: unknown) => {
  handleApiError(error); 
  if (!meta?.errorContext || meta.toast === false) return;
  const context =
    typeof meta.errorContext === "function" ? meta.errorContext(variables) : meta.errorContext;
  toast.error(getFriendlyError(error, context).message);
};

// The Mutation object's position in onError's arguments differs between
// TanStack Query v5 minor versions, so find it by shape instead of by index.
const findMutation = (args: unknown[]) =>
  args.find(
    (arg): arg is Mutation<unknown, unknown, unknown, unknown> =>
      typeof arg === "object" && arg !== null && "mutationId" in arg && "options" in arg
  );

export const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
    mutationCache: new MutationCache({
      onError: (error, ...rest) => {
        const mutation = findMutation(rest);
        report(error, mutation?.options.meta, mutation?.state.variables);
      },
    }),
    queryCache: new QueryCache({
      onError: (error, query) => {
        // Only toast when there's nothing to show. A failed background refetch
        // (polling, window refocus) shouldn't pop up over data the user can see.
        if (query.state.data !== undefined) return;
        if (!query.meta?.errorContext) return;
        report(error, query.meta);
      },
    }),
  });