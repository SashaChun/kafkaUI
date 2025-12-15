import { Injectable } from '@nestjs/common';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateConfigDto } from './dto/update-config.dto';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class TopicsService {
  constructor(private readonly kafkaService: KafkaService) {}

  async listTopics() {
    const admin = this.kafkaService.createAdmin();
    await admin.connect();
    try {
      const topics = await admin.fetchTopicMetadata();
      return topics.topics.map((topic) => ({
        name: topic.name,
        partitions: topic.partitions.length,
        replicationFactor: topic.partitions[0]?.replicas.length || 0,
        config: {},
        totalSize: 0,
        messages: 0
      }));
    } finally {
      await admin.disconnect();
    }
  }

  async getTopic(name: string) {
    const admin = this.kafkaService.createAdmin();
    await admin.connect();
    try {
      const metadata = await admin.fetchTopicMetadata({ topics: [name] });
      return metadata.topics[0];
    } finally {
      await admin.disconnect();
    }
  }

  async createTopic(payload: CreateTopicDto) {
    const admin = this.kafkaService.createAdmin();
    await admin.connect();
    try {
      await admin.createTopics({
        topics: [
          {
            topic: payload.name,
            numPartitions: payload.partitions,
            replicationFactor: payload.replicationFactor,
            configEntries: payload.config
              ? Object.entries(payload.config).map(([name, value]) => ({ name, value }))
              : []
          }
        ]
      });
      return { status: 'created', topic: payload.name };
    } finally {
      await admin.disconnect();
    }
  }

  async updateConfig(topic: string, payload: UpdateConfigDto) {
    const admin = this.kafkaService.createAdmin();
    await admin.connect();
    try {
      await admin.alterConfigs({
        resources: [
          {
            type: admin.resourceTypes.TOPIC,
            name: topic,
            configEntries: Object.entries(payload.config).map(([name, value]) => ({ name, value }))
          }
        ]
      });
      return { status: 'updated', topic };
    } finally {
      await admin.disconnect();
    }
  }

  async deleteTopic(topic: string) {
    const admin = this.kafkaService.createAdmin();
    await admin.connect();
    try {
      await admin.deleteTopics({ topics: [topic] });
      return { status: 'deleted', topic };
    } finally {
      await admin.disconnect();
    }
  }
}
