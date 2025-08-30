const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3000";

export type TriggeredItem = {
  alert: {
    _id: string;
    name?: string;
    parameter: "temperature" | "windSpeed" | "precipitation";
    threshold: { op: "gt" | "gte" | "lt" | "lte" | "eq"; value: number };
    city?: string;
    lat?: number;
    lon?: number;
  };
  state: { triggered: boolean; observedValue: number; checkedAt: string };
};

export async function listCurrentStates(
  fetcher: typeof fetch
): Promise<TriggeredItem[]> {
  const res = await fetcher(`${BASE}/states/current`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
