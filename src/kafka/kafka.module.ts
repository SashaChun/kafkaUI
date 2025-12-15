import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { KafkaService } from './kafka.service';

@Global()
@Module({
  providers: [KafkaService, ConfigService],
  exports: [KafkaService]
})
export class KafkaModule {}
