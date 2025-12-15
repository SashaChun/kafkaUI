import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import { ProduceMessageDto } from './dto/produce-message.dto';
import { MessageQueryDto } from './dto/message-query.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly kafkaService: KafkaService) {}

  async fetchMessages(topic: string, query: MessageQueryDto) {
    const consumer = this.kafkaService.createConsumer(`kafka-ui-${topic}-${Date.now()}`);
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: true });

    const messages: any[] = [];
    await consumer.run({
      partitionsConsumedConcurrently: 1,
      eachMessage: async ({ message, partition }) => {
        if (query.partition !== undefined && query.partition !== partition) {
          return;
        }
        messages.push({
          partition,
          offset: message.offset,
          key: message.key?.toString(),
          value: message.value?.toString(),
          headers: message.headers
        });
        if (messages.length >= 50) {
          await consumer.stop();
        }
      }
    });

    await consumer.disconnect();
    return messages;
  }

  async produce(topic: string, payload: ProduceMessageDto) {
    if (payload.dryRun) {
      return { status: 'dry-run', topic, payload };
    }
    const producer = this.kafkaService.createProducer();
    await producer.connect();
    try {
      await producer.send({
        topic,
        messages: [
          {
            key: payload.key,
            value: typeof payload.value === 'string' ? payload.value : JSON.stringify(payload.value),
            headers: payload.headers
          }
        ]
      });
      return { status: 'sent', topic };
    } finally {
      await producer.disconnect();
    }
  }
}
