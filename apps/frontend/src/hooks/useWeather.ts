import { useQuery } from "@tanstack/react-query";
import { getWeather, type WeatherDto } from "../lib/api";

export function useWeather(lat?: number, lon?: number) {
  const enabled = Number.isFinite(lat) && Number.isFinite(lon);

  return useQuery<WeatherDto, Error>({
    queryKey: ["weather", lat ?? null, lon ?? null],
    queryFn: () => getWeather({ lat, lon }),
    enabled,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: 120_000,
  });
}
