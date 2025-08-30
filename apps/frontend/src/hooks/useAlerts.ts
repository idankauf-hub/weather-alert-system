import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAlert,
  deleteAlert,
  evaluateAlert,
  listAlerts,
  type CreateAlertInput,
} from "../lib/alerts";
import { useAuth } from "../context/AuthContext";

export function useAlertsList() {
  const { authFetch, token, user } = useAuth();
  return useQuery({
    queryKey: ["alerts", user?._id ?? null],
    queryFn: () => listAlerts(authFetch),
    enabled: !!token,
    staleTime: 60_000,
  });
}

export function useCreateAlert() {
  const { authFetch } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateAlertInput) => createAlert(authFetch, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alerts"] });
    },
  });
}

export function useDeleteAlert() {
  const { authFetch } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteAlert(authFetch, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alerts"] });
      qc.invalidateQueries({ queryKey: ["states", "current"] });
    },
  });
}

export function useEvaluateAlert() {
  const { authFetch } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => evaluateAlert(authFetch, id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alerts"] });
      qc.invalidateQueries({ queryKey: ["states", "current"] });
    },
  });
}
