import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Alert } from './schemas/alert.schema';
import { AlertState, AlertStateDocument } from './schemas/alert-state.schema';
import { CreateAlertDto } from './dto/create-alert.dto';
import { WeatherService } from '../weather/weather.service';
import { AlertDocument } from './types';
import { operatorMap } from './utils';

@Injectable()
export class AlertsService {
  constructor(
    @InjectModel(Alert.name) private readonly alertModel: Model<AlertDocument>,
    @InjectModel(AlertState.name)
    private readonly stateModel: Model<AlertStateDocument>,
    private readonly weather: WeatherService,
  ) {}

  private assertLocation(dto: CreateAlertDto) {
    const hasCity = !!dto.city?.trim();
    const hasCoords =
      Number.isFinite(dto.lat as number) && Number.isFinite(dto.lon as number);
    if (!hasCity && !hasCoords)
      throw new BadRequestException('Provide either city or lat+lon');
  }

  async create(dto: CreateAlertDto, userId: string) {
    this.assertLocation(dto);

    try {
      await this.weather.getCurrent({
        city: dto.city,
        lat: dto.lat,
        lon: dto.lon,
      });
    } catch (e: any) {
      if (e?.status === 400 || e?.name === 'BadRequestException') {
        throw new BadRequestException(
          'Invalid location. Try a different city/format (e.g., "10001 US" or "SW1").',
        );
      }
      throw e;
    }

    return this.alertModel.create({
      ...dto,
      city: dto.city?.trim() || undefined,
      userId: new Types.ObjectId(userId),
    });
  }

  findAll(userId: string) {
    return this.alertModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean();
  }

  async findOne(id: string, userId: string) {
    const doc = await this.alertModel
      .findOne({
        _id: id,
        userId: new Types.ObjectId(userId),
      })
      .lean();
    if (!doc) throw new NotFoundException('Alert not found');
    return doc;
  }

  async remove(id: string, userId: string) {
    await this.alertModel.deleteOne({
      _id: id,
      userId: new Types.ObjectId(userId),
    });
    await this.stateModel.deleteOne({
      alertId: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });
    return { ok: true };
  }

  async evaluateOne(id: string, userId: string) {
    const alert = await this.findOne(id, userId);

    try {
      const wx = await this.weather.getCurrent({
        city: alert.city,
        lat: alert.lat,
        lon: alert.lon,
      });

      const observed =
        alert.parameter === 'temperature'
          ? wx.temperature ?? NaN
          : alert.parameter === 'windSpeed'
          ? wx.windSpeed ?? NaN
          : alert.parameter === 'precipitation'
          ? wx.precipitation ?? NaN
          : NaN;

      if (!Number.isFinite(observed)) {
        throw new BadRequestException(
          'Observed value missing from weather response',
        );
      }

      const triggered = operatorMap(
        alert.threshold.op as any,
        observed,
        alert.threshold.value,
      );
      const now = new Date();

      await this.stateModel.updateOne(
        {
          alertId: new Types.ObjectId(alert._id),
          userId: new Types.ObjectId(userId),
        },
        { $set: { triggered, observedValue: observed, checkedAt: now } },
        { upsert: true },
      );

      return { triggered, observedValue: observed, checkedAt: now };
    } catch (e: any) {
      if (e?.status === 400 || e?.name === 'BadRequestException') {
        const now = new Date();
        await this.stateModel.updateOne(
          {
            alertId: new Types.ObjectId(alert._id),
            userId: new Types.ObjectId(userId),
          },
          { $set: { triggered: false, observedValue: null, checkedAt: now } },
          { upsert: true },
        );
        return {
          triggered: false,
          observedValue: null,
          checkedAt: now,
          error: 'Invalid location',
        };
      }
      throw e;
    }
  }

  async listCurrentTriggered(userId: string) {
    const uid = new Types.ObjectId(userId);
    const states = await this.stateModel
      .find({ userId: uid, triggered: true })
      .lean();
    if (!states.length) return [];

    const alertIds = states.map((s) => s.alertId);
    const alerts = await this.alertModel
      .find({ _id: { $in: alertIds }, userId: uid })
      .lean();

    const map = new Map(alerts.map((a) => [a._id.toString(), a]));
    return states
      .map((s) => ({
        alert: map.get(s.alertId.toString()) || null,
        state: {
          triggered: s.triggered,
          observedValue: s.observedValue,
          checkedAt: s.checkedAt,
        },
      }))
      .filter((x) => x.alert !== null);
  }
}
