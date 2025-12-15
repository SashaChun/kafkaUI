import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class ResetOffsetDto {
  @IsIn(['earliest', 'latest', 'timestamp', 'exact'])
  mode: 'earliest' | 'latest' | 'timestamp' | 'exact';

  @IsOptional()
  @IsInt()
  @Min(0)
  timestamp?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsString()
  topic?: string;
}
