const BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:3000";

export type WeatherDto = {
  time: string | null;
  temperature: number | null;
  windSpeed: number | null;
  precipitation: number | null;
};

export async function getWeather(params: {
  lat?: number;
  lon?: number;
  city?: string;
}) {
  const url = new URL("/weather", BASE);

  if (Number.isFinite(params.lat) && Number.isFinite(params.lon)) {
    url.searchParams.set("lat", String(params.lat));
    url.searchParams.set("lon", String(params.lon));
  } else if (params.city && params.city.trim()) {
    url.searchParams.set("city", params.city.trim());
  }

  const res = await fetch(url.toString(), {
    headers: { accept: "application/json" },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<WeatherDto>;
}
