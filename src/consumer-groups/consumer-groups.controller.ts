import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ConsumerGroupsService } from './consumer-groups.service';
import { ResetOffsetDto } from './dto/reset-offset.dto';

@Controller('consumer-groups')
export class ConsumerGroupsController {
  constructor(private readonly service: ConsumerGroupsService) {}

  @Get()
  list() {
    return this.service.listGroups();
  }

  @Get(':groupId')
  details(@Param('groupId') groupId: string) {
    return this.service.getGroup(groupId);
  }

  @Post(':groupId/reset')
  reset(@Param('groupId') groupId: string, @Body() payload: ResetOffsetDto) {
    return this.service.resetOffsets(groupId, payload);
  }
}
