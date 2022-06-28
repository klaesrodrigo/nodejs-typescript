import { ForecastPoint, StormGlass } from '@src/clients/stormGlass';
import e from 'express';

export enum BeachPosition {
  S = 'S',
  N = 'N',
  W = 'W',
  E = 'E',
}

export interface Beach {
  lat: number;
  lng: number;
  name: string;
  position: BeachPosition;
  user: string;
}

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {}

export class Forecast {
  constructor(protected stormGlass = new StormGlass()) {}

  public async processForecastForBeaches(
    beaches: Beach[]
  ): Promise<BeachForecast[]> {
    const poinstWithCorrectSources: BeachForecast[] = [];
    for (const beach of beaches) {
      const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
      const enrichedBeachData = points.map((e) => ({
        ...{
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1,
        },
        ...e,
      }));

      poinstWithCorrectSources.push(...enrichedBeachData);
    }
    return poinstWithCorrectSources;
  }
}
