import { IsBoolean, IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator';

export class ProduceMessageDto {
  @IsOptional()
  @IsString()
  key?: string;

  @IsNotEmpty()
  value: any;

  @IsOptional()
  @IsObject()
  headers?: Record<string, string>;

  @IsOptional()
  @IsBoolean()
  dryRun?: boolean;
}
