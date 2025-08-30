import { HydratedDocument } from 'mongoose';
import { Alert } from './schemas/alert.schema';

export type AlertDocument = HydratedDocument<Alert>;
export type Parameter = 'temperature' | 'windSpeed' | 'precipitation';
export type Operator = 'gt' | 'gte' | 'lt' | 'lte' | 'eq';
