import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type AlertStateDocument = HydratedDocument<AlertState>;

@Schema()
export class AlertState {
  @Prop({
    type: Types.ObjectId,
    ref: 'Alert',
    required: true,
    unique: true,
    index: true,
  })
  alertId: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  triggered: boolean;

  @Prop({ type: Number })
  observedValue?: number;

  @Prop({ required: true })
  checkedAt: Date;
}
export const AlertStateSchema = SchemaFactory.createForClass(AlertState);

AlertStateSchema.index({ userId: 1, triggered: 1, checkedAt: -1 });
