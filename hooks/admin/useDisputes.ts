import { useQuery } from "@tanstack/react-query";
import { getDisputes, DisputesParams } from "@/services/admin/disputes.service";

export const useDisputes = (params: DisputesParams) => {
  return useQuery({
    queryKey: ["adminDisputes", params],
    queryFn: () => getDisputes(params),
    staleTime: 30_000,
  });
};
