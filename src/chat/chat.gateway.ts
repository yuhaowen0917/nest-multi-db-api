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

// 配置 WebSocket 网关
// 跨域允许所有前端访问
@WebSocketGateway(3001, {
  cors: {
    origin: '*',
  },
  transports: ['websocket'],
})

// 连接 / 断开 / 消息监听
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  // 客户端连接成功触发
  handleConnection(client: Socket) {
    console.log('客户端已连接：', client.id);
  }

  // 客户端断开连接触发
  handleDisconnect(client: Socket) {
    console.log('客户端已断开：', client.id);
  }

  // 前端发送 message 消息，后端接收并返回
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    console.log('前端发来消息：', data);

    // client.emit('message', {
    //   status: 'success',
    //   msg: '后端已收到',
    //   data: {
    //     data,
    //     clientId: client.id,
    //   },
    // });

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
    console.log('测试消息：', data);
    return { code: 200, text: 'WebSocket 连通啦！' };
  }

  // 监听客户端发送的 'events' 事件
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    console.log('收到消息:', data);
    return '服务端已收到: ' + data; // 返回给客户端的响应
  }

  // 广播消息给所有客户端
  @SubscribeMessage('broadcast')
  broadcastMessage(@MessageBody() data: string) {
    this.server.emit('message', data); // 向所有连接者广播
  }
}
