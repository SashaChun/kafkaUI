import { Logger } from '@nestjs/common';
import { OnGatewayConnection, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ namespace: '/ws/metrics', cors: true })
export class MetricsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MetricsGateway.name);

  handleConnection() {
    this.logger.log('Client connected to metrics stream');
  }

  broadcast(metric: any) {
    this.server.emit('metric', metric);
  }
}
