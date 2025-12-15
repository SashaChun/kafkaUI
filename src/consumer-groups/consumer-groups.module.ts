import { Module } from '@nestjs/common';
import { ConsumerGroupsController } from './consumer-groups.controller';
import { ConsumerGroupsService } from './consumer-groups.service';

@Module({
  controllers: [ConsumerGroupsController],
  providers: [ConsumerGroupsService]
})
export class ConsumerGroupsModule {}
