import { useQuery } from "@tanstack/react-query";
import { getDisputeById } from "@/services/admin/disputes.service";

export const useDispute = (id: string) => {
  return useQuery({
    queryKey: ["adminDispute", id],
    queryFn: () => getDisputeById(id),
    enabled: !!id,
  });
};
