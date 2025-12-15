import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class ClusterService {
  constructor(private readonly kafkaService: KafkaService) {}

  async getOverview() {
    const admin = this.kafkaService.createAdmin();
    await admin.connect();
    try {
      const [brokers, topics, groups, metadata] = await Promise.all([
        admin.describeCluster(),
        admin.listTopics(),
        admin.listGroups(),
        admin.fetchTopicMetadata()
      ]);
      return {
        brokers: brokers.brokers,
        controller: brokers.controller,
        version: metadata.clusterId,
        topics: topics.length,
        partitions: metadata.topics.reduce((sum, t) => sum + t.partitions.length, 0),
        consumerGroups: groups.groups.length,
        online: true
      };
    } catch (error) {
      return { online: false, error: (error as Error).message };
    } finally {
      await admin.disconnect();
    }
  }
}
