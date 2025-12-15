import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { MessageQueryDto } from './dto/message-query.dto';
import { ProduceMessageDto } from './dto/produce-message.dto';
import { MessagesService } from './messages.service';

@Controller('topics/:topic/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  read(@Param('topic') topic: string, @Query() query: MessageQueryDto) {
    return this.messagesService.fetchMessages(topic, query);
  }

  @Post()
  produce(@Param('topic') topic: string, @Body() payload: ProduceMessageDto) {
    return this.messagesService.produce(topic, payload);
  }
}
