import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { ClusterModule } from './cluster/cluster.module';
import { ConsumerGroupsModule } from './consumer-groups/consumer-groups.module';
import { KafkaModule } from './kafka/kafka.module';
import { MessagesModule } from './messages/messages.module';
import { MetricsModule } from './metrics/metrics.module';
import { TopicsModule } from './topics/topics.module';
import kafkaConfig from './config/kafka.config';
import securityConfig from './config/security.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [kafkaConfig, securityConfig]
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.PINO_LOG_LEVEL || 'info',
        transport: process.env.NODE_ENV !== 'production' ? { target: 'pino-pretty' } : undefined
      }
    }),
    KafkaModule,
    AuthModule,
    ClusterModule,
    TopicsModule,
    MessagesModule,
    ConsumerGroupsModule,
    MetricsModule,
    AuditModule
  ]
})
export class AppModule {}
