const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3000";

export type Alert = {
  _id: string;
  name?: string;
  description?: string;
  parameter: "temperature" | "windSpeed" | "precipitation";
  threshold: { op: "gt" | "gte" | "lt" | "lte" | "eq"; value: number };
  city?: string;
  lat?: number;
  lon?: number;
  createdAt: string;
};

export type CreateAlertInput = Omit<Alert, "_id" | "createdAt">;

export async function listAlerts(fetcher: typeof fetch): Promise<Alert[]> {
  const res = await fetcher(`${BASE}/alerts`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createAlert(
  fetcher: typeof fetch,
  body: CreateAlertInput
): Promise<Alert> {
  const res = await fetcher(`${BASE}/alerts`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteAlert(fetcher: typeof fetch, id: string) {
  const res = await fetcher(`${BASE}/alerts/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function evaluateAlert(fetcher: typeof fetch, id: string) {
  const res = await fetcher(`${BASE}/alerts/${id}/evaluate`, {
    method: "POST",
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<{
    triggered: boolean;
    observedValue: number;
    checkedAt: string;
  }>;
}
