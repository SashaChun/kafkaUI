import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, KafkaConfig } from 'kafkajs';

@Injectable()
export class KafkaService implements OnModuleInit, OnModuleDestroy {
  private kafka: Kafka;

  constructor(private readonly configService: ConfigService) {
    const kafkaCfg = this.configService.get<KafkaConfig>('kafka');
    this.kafka = new Kafka({
      ...kafkaCfg,
      retry: {
        retries: 5
      }
    });
  }

  async onModuleInit() {
    // Lazy init clients on demand.
  }

  async onModuleDestroy() {
    // kafkajs cleans up producers/consumers when disconnected by owners
  }

  createAdmin() {
    return this.kafka.admin();
  }

  createProducer() {
    return this.kafka.producer();
  }

  createConsumer(groupId: string) {
    return this.kafka.consumer({ groupId });
  }
}
