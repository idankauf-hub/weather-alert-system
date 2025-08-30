import {
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ThresholdDto {
  @IsIn(['gt', 'gte', 'lt', 'lte', 'eq'])
  op: 'gt' | 'gte' | 'lt' | 'lte' | 'eq';

  @Type(() => Number)
  @IsNumber()
  value: number;
}

export class CreateAlertDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsString() description?: string;

  @IsIn(['temperature', 'windSpeed', 'precipitation'])
  parameter: 'temperature' | 'windSpeed' | 'precipitation';

  @ValidateNested()
  @Type(() => ThresholdDto)
  threshold: ThresholdDto;

  @IsOptional()
  @IsString()
  city?: string;

  @ValidateIf((o) => !o.city)
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  lat?: number;

  @ValidateIf((o) => !o.city)
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  lon?: number;
}
