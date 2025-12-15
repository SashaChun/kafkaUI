import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka/kafka.service';
import { ResetOffsetDto } from './dto/reset-offset.dto';

@Injectable()
export class ConsumerGroupsService {
  constructor(private readonly kafkaService: KafkaService) {}

  async listGroups() {
    const admin = this.kafkaService.createAdmin();
    await admin.connect();
    try {
      const groups = await admin.listGroups();
      return groups.groups;
    } finally {
      await admin.disconnect();
    }
  }

  async getGroup(groupId: string) {
    const admin = this.kafkaService.createAdmin();
    await admin.connect();
    try {
      const description = await admin.describeGroups([groupId]);
      return description.groups[0];
    } finally {
      await admin.disconnect();
    }
  }

  async resetOffsets(groupId: string, payload: ResetOffsetDto) {
    const admin = this.kafkaService.createAdmin();
    await admin.connect();
    try {
      switch (payload.mode) {
        case 'earliest':
          await admin.resetOffsets({ groupId, earliest: true, topics: payload.topic ? [payload.topic] : undefined });
          break;
        case 'latest':
          await admin.resetOffsets({ groupId, latest: true, topics: payload.topic ? [payload.topic] : undefined });
          break;
        case 'timestamp':
          if (!payload.timestamp) throw new Error('timestamp required');
          await admin.setOffsets({
            groupId,
            topics: [
              {
                topic: payload.topic || '',
                partitions: [{ partition: 0, offset: payload.timestamp.toString() }]
              }
            ]
          });
          break;
        case 'exact':
          if (payload.offset === undefined) throw new Error('offset required');
          await admin.setOffsets({
            groupId,
            topics: [
              {
                topic: payload.topic || '',
                partitions: [{ partition: 0, offset: payload.offset.toString() }]
              }
            ]
          });
          break;
        default:
          break;
      }
      return { status: 'reset', groupId };
    } finally {
      await admin.disconnect();
    }
  }
}
