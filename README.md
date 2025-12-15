# Kafka UI Backend (NestJS)

This service provides the API layer for administrating Kafka clusters without exposing Kafka directly to the browser. It follows the requirements shared earlier: NestJS, KafkaJS client, JWT auth, WebSocket metrics, Prometheus-compatible metrics, and Dockerized deployment.

## Features
- Cluster overview, topic management, message browsing/production, consumer group offset management, audit logging, and metrics streaming endpoints.
- Kafka connection modes: PLAINTEXT, SASL/PLAIN, SASL/SCRAM, SSL (cert/key) via environment variables.
- Global validation with `class-validator`, JWT-based auth strategy, and modular NestJS design ready for scaling.
- Multi-stage Dockerfile and `docker-compose.yml` for local development with Kafka broker.

## Configuration
Set the following environment variables (examples shown):

```bash
KAFKA_BROKERS=broker1:9092,broker2:9092
KAFKA_CLIENT_ID=kafka-ui
KAFKA_SSL=true
KAFKA_SASL_MECHANISM=scram-sha-512
KAFKA_USERNAME=admin
KAFKA_PASSWORD=secret
JWT_SECRET=change-me
PORT=3000
```

## Running locally
1. Install dependencies (add `--legacy-peer-deps` if registry restrictions appear):
   ```bash
   npm install
   ```
2. Start the API:
   ```bash
   npm run start:dev
   ```
3. Or run with Docker Compose (includes Kafka broker):
   ```bash
   docker-compose up --build
   ```

## Testing
Run unit tests and e2e tests:

```bash
npm test
npm run test:e2e
```

## Endpoints (high level)
- `GET /api/cluster/overview`
- `GET /api/topics` | `GET /api/topics/:topic` | `POST /api/topics` | `PATCH /api/topics/:topic/config` | `DELETE /api/topics/:topic`
- `GET /api/topics/:topic/messages` | `POST /api/topics/:topic/produce`
- `GET /api/consumer-groups` | `GET /api/consumer-groups/:groupId` | `POST /api/consumer-groups/:groupId/reset`
- `GET /metrics`
- `GET /api/audit/logs`
- WebSocket: `/ws/metrics`

## Notes
- No direct browser-to-Kafka connections—everything flows through this backend.
- Avoid deprecated Kafka APIs; KafkaJS handles interactions with retry/timeout strategies that can be extended inside `KafkaService`.
- Add OpenAPI documentation via `@nestjs/swagger` before production rollout.

