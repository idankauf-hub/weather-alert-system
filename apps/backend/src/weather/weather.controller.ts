import { Controller, Get, Query } from '@nestjs/common';
import { WeatherService } from './weather.service';

@Controller('weather')
export class WeatherController {
  constructor(private readonly weather: WeatherService) {}

  @Get()
  getCurrent(
    @Query('lat') lat?: string,
    @Query('lon') lon?: string,
    @Query('city') city?: string,
  ) {
    const nlat = lat ? Number(lat) : undefined;
    const nlon = lon ? Number(lon) : undefined;
    return this.weather.getCurrent({ lat: nlat, lon: nlon, city });
  }
}
