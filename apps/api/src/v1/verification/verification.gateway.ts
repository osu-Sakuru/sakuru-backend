import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { VerificationServiceV1 } from './verification.service';

@WebSocketGateway({
  namespace: 'verification',
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class VerificationGatewayV1 {
  constructor(private readonly verificationService: VerificationServiceV1) {}

  @SubscribeMessage('verify')
  async listenForMessages(
    @MessageBody('user') user: number,
    @ConnectedSocket() client: Socket,
  ) {
    if (!user) return;

    if (await this.verificationService.subscribe(user, client)) {
      client.emit('verify', {
        user: user,
        status: 'pending',
      });
    } else {
      client.emit('verify', {
        user: user,
        status: 'failed',
      });
    }
  }
}
