import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateTopicDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @Min(1)
  partitions: number;

  @IsInt()
  @Min(1)
  replicationFactor: number;

  @IsOptional()
  config?: Record<string, string>;
}
