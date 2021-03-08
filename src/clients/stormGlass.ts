import { ClientInternalError } from "@src/util/errors/ClientRequestError";
import { StormGlassResponseError } from "@src/util/errors/StormGlassResponseError";
import { AxiosStatic } from "axios";

export interface StormGlassPointSource {
  [key: string]: number;
}

export interface StormGlassPoint {
  time: string;
  readonly waveHeight: StormGlassPointSource;
  readonly waveDirection: StormGlassPointSource;
  readonly swellDirection: StormGlassPointSource;
  readonly swellHeight: StormGlassPointSource;
  readonly swellPeriod: StormGlassPointSource;
  readonly windDirection: StormGlassPointSource;
  readonly windSpeed: StormGlassPointSource;
}

export interface StormGlassForecastResponse {
  hours: StormGlassPoint[];
}

export interface ForecastPoint {
  time: string;
  waveHeight: number;
  waveDirection: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  windDirection: number;
  windSpeed: number;
}

export class StormGlass {
    readonly stormGlassAPIParams =
    'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
    readonly stormGlassAPISource = 'noaa';

    constructor(protected request: AxiosStatic){}

    public async fetchPoints(lat: number, lng: number): Promise<{}> {
      try {
        const response = await this.request.get<StormGlassForecastResponse>(
            `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`,
            {
              headers: {
                Authorization: 'fake-token',
              },
            }
          );
          return this.normalizeResponse(response.data);
      } catch (err) {
        if(err.response && err.response.status) {          
          throw new StormGlassResponseError(`Error: ${JSON.stringify(err.response.data)} Code: ${err.response.status}`)
        }
        throw new ClientInternalError(err.message)
      }
    }

    private normalizeResponse(
      points: StormGlassForecastResponse
    ): ForecastPoint[] {
      return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
        swellDirection: point.swellDirection[this.stormGlassAPISource],
        swellHeight: point.swellHeight[this.stormGlassAPISource],
        swellPeriod: point.swellPeriod[this.stormGlassAPISource],
        time: point.time,
        waveDirection: point.waveDirection[this.stormGlassAPISource],
        waveHeight: point.waveHeight[this.stormGlassAPISource],
        windDirection: point.windDirection[this.stormGlassAPISource],
        windSpeed: point.windSpeed[this.stormGlassAPISource],
      }));
    }
  
    private isValidPoint(point: Partial<StormGlassPoint>): boolean {
      return !!(
        point.time &&
        point.swellDirection?.[this.stormGlassAPISource] &&
        point.swellHeight?.[this.stormGlassAPISource] &&
        point.swellPeriod?.[this.stormGlassAPISource] &&
        point.waveDirection?.[this.stormGlassAPISource] &&
        point.waveHeight?.[this.stormGlassAPISource] &&
        point.windDirection?.[this.stormGlassAPISource] &&
        point.windSpeed?.[this.stormGlassAPISource]
      );
    }
}