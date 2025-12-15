import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
  clientId: process.env.KAFKA_CLIENT_ID || 'kafka-ui',
  brokers: (process.env.KAFKA_BROKERS || '').split(',').filter(Boolean),
  ssl: process.env.KAFKA_SSL === 'true',
  sasl: process.env.KAFKA_USERNAME
    ? {
        mechanism: (process.env.KAFKA_SASL_MECHANISM as any) || 'plain',
        username: process.env.KAFKA_USERNAME,
        password: process.env.KAFKA_PASSWORD
      }
    : undefined,
  connectionTimeout: parseInt(process.env.KAFKA_CONNECTION_TIMEOUT || '15000', 10),
  authenticationTimeout: parseInt(process.env.KAFKA_AUTH_TIMEOUT || '15000', 10)
}));
