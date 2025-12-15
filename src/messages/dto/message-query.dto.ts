import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class MessageQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  partition?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  fromOffset?: number;

  @IsOptional()
  @IsString()
  key?: string;
}
