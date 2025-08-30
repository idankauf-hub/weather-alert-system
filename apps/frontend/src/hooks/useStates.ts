import { useQuery } from "@tanstack/react-query";
import { listCurrentStates, type TriggeredItem } from "../lib/states";
import { useAuth } from "../context/AuthContext";

export function useCurrentStates() {
  const { authFetch, token, user } = useAuth();
  return useQuery<TriggeredItem[]>({
    queryKey: ["states", "current", user?._id ?? null],
    queryFn: () => listCurrentStates(authFetch),
    enabled: !!token,
    staleTime: 30_000,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useTriggeredIdSet() {
  const { authFetch, token, user } = useAuth();
  return useQuery({
    queryKey: ["states", "current", "ids", user?._id ?? null],
    queryFn: async () => {
      const items = await listCurrentStates(authFetch);
      return new Set(items.map((i) => i.alert._id));
    },
    enabled: !!token,
    staleTime: 15_000,
    refetchInterval: 30_000,
  });
}
