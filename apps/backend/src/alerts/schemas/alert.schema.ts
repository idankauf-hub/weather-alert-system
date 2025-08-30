import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Operator, Parameter } from '../types';

@Schema({ _id: false })
class Threshold {
  @Prop({ required: true, enum: ['gt', 'gte', 'lt', 'lte', 'eq'] })
  op: Operator;

  @Prop({ required: true, type: Number })
  value: number;
}

@Schema()
export class Alert {
  @Prop({ trim: true })
  name?: string;

  @Prop({ trim: true })
  description?: string;

  @Prop({ required: true, enum: ['temperature', 'windSpeed', 'precipitation'] })
  parameter: Parameter;

  @Prop({ required: true, type: Threshold })
  threshold: Threshold;

  @Prop({ trim: true })
  city?: string;

  @Prop({ type: Number, min: -90, max: 90 })
  lat?: number;

  @Prop({ type: Number, min: -180, max: 180 })
  lon?: number;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true, required: true })
  userId: Types.ObjectId;

  @Prop({ default: Date.now })
  createdAt: Date;
}
export const AlertSchema = SchemaFactory.createForClass(Alert);
AlertSchema.index({ parameter: 1, city: 1, lat: 1, lon: 1, createdAt: -1 });
