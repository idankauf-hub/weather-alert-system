import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { REDIS } from '../redis/redis.module';

type Args = { lat?: number; lon?: number; city?: string };

@Injectable()
export class WeatherService {
  private readonly apiKey = this.cfg.get<string>('TOMORROW_API_KEY') ?? '';

  constructor(
    private readonly cfg: ConfigService,
    @Inject(REDIS) private readonly redis: Redis,
  ) {}

  async getCurrent({ lat, lon, city }: Args) {
    const hasCoords = Number.isFinite(lat) && Number.isFinite(lon);
    const hasCity = !!city && city?.trim().length > 0;

    if (!hasCoords && !hasCity) {
      throw new BadRequestException('Provide either lat+lon or city');
    }

    const key = hasCoords
      ? `wx:coords:${lat}:${lon}`
      : `wx:city:${city ?? ''.trim().toLowerCase()}`;

    const cached = await this.redis.get(key);
    if (cached) return JSON.parse(cached);

    const location = hasCoords
      ? `${lat},${lon}`
      : encodeURIComponent((city ?? '').trim());

    // const url = `https://api.tomorrow.io/v4/weather/realtime?location=${location}&units=metric`;

    // const res = await fetch(url, { headers: { apikey: this.apiKey } });
    // if (!res.ok) {
    //   const txt = await res.text();
    //   if (res.status === 400) {
    //     throw new BadRequestException('Invalid location');
    //   }
    //   throw new Error(`Weather API error ${res.status}: ${txt}`);
    // }

    // const data = await res.json();

    const data = {
      data: {
        time: '2023-01-26T07:48:00Z',
        values: {
          cloudBase: 0.07,
          cloudCeiling: 0.07,
          cloudCover: 100,
          dewPoint: 0.88,
          freezingRainIntensity: 0,
          humidity: 96,
          precipitationProbability: 0,
          pressureSurfaceLevel: 984.57,
          rainIntensity: 0,
          sleetIntensity: 0,
          snowIntensity: 0,
          temperature: 1.88,
          temperatureApparent: -0.69,
          uvHealthConcern: 0,
          uvIndex: 0,
          visibility: 9.9,
          weatherCode: 1001,
          windDirection: 10,
          windGust: 3.38,
          windSpeed: 2.38,
        },
      },
      location: {
        lat: 43.653480529785156,
        lon: -79.3839340209961,
        name: 'Old Toronto, Toronto, Golden Horseshoe, Ontario, Canada',
        type: 'administrative',
      },
    };
    const v = data?.data?.values ?? {};

    const minimal = {
      time: data?.data?.time ?? null,
      temperature: v.temperature ?? null,
      windSpeed: v.windSpeed ?? null,
      precipitation: v.precipitationProbability ?? null,
    };

    await this.redis.set(key, JSON.stringify(minimal), 'EX', 120);

    return minimal;
  }
}
