import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

// 配置 WebSocket 网关
// 跨域来源从环境变量读取，生产环境应设为具体前端域名
@WebSocketGateway(3001, {
  cors: {
    origin: process.env.WS_ORIGIN || '*',
  },
  transports: ['websocket'],
})

// 连接 / 断开 / 消息监听
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  // 客户端连接成功触发
  handleConnection(client: Socket) {
    this.logger.log('客户端已连接：' + client.id);
  }

  // 客户端断开连接触发
  handleDisconnect(client: Socket) {
    this.logger.log('客户端已断开：' + client.id);
  }

  // 前端发送 message 消息，后端接收并返回
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.logger.log('前端发来消息：' + JSON.stringify(data));

    // 返回给前端
    return {
      status: 'success',
      msg: '后端已收到',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      data: data,
      clientId: client.id,
    };
  }

  // 测试接口
  @SubscribeMessage('test')
  handleTest(@MessageBody() data: any) {
    this.logger.log('测试消息：' + JSON.stringify(data));
    return { code: 200, text: 'WebSocket 连通啦！' };
  }

  // 监听客户端发送的 'events' 事件
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    this.logger.log('收到消息:' + data);
    return '服务端已收到: ' + data; // 返回给客户端的响应
  }

  // 广播消息给所有客户端
  @SubscribeMessage('broadcast')
  broadcastMessage(@MessageBody() data: string) {
    this.server.emit('message', data); // 向所有连接者广播
  }
}
