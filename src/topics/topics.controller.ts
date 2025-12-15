import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { TopicsService } from './topics.service';

@Controller('topics')
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  @Get()
  list() {
    return this.topicsService.listTopics();
  }

  @Get(':topic')
  details(@Param('topic') topic: string) {
    return this.topicsService.getTopic(topic);
  }

  @Post()
  create(@Body() payload: CreateTopicDto) {
    return this.topicsService.createTopic(payload);
  }

  @Patch(':topic/config')
  updateConfig(@Param('topic') topic: string, @Body() payload: UpdateConfigDto) {
    return this.topicsService.updateConfig(topic, payload);
  }

  @Delete(':topic')
  delete(@Param('topic') topic: string) {
    return this.topicsService.deleteTopic(topic);
  }
}
