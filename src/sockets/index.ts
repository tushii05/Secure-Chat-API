import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import config from '../config';

let io: Server | null = null;

export default function attachSockets(server: HttpServer) {
  io = new Server(server, { cors: { origin: true, credentials: true } });

  io.use((socket: Socket, next) => {
    try {
      const token = socket.handshake.auth?.token as string | undefined;
      if (!token) return next(new Error('Authentication error'));
      const payload = jwt.verify(token, config.jwt.accessSecret) as any;
      (socket as any).data = { userId: payload.sub };
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = (socket as any).data.userId;

    socket.on('join:conversation', (conversationId: number) => {
      socket.join(`conversation_${conversationId}`);
    });

    socket.on('leave:conversation', (conversationId: number) => {
      socket.leave(`conversation_${conversationId}`);
    });

    socket.on('typing:start', ({ conversationId }) => {
      socket.to(`conversation_${conversationId}`).emit('typing:start', { conversationId, userId });
    });

    socket.on('typing:stop', ({ conversationId }) => {
      socket.to(`conversation_${conversationId}`).emit('typing:stop', { conversationId, userId });
    });

    socket.on('message:seen', ({ conversationId, messageId }) => {
      socket.to(`conversation_${conversationId}`).emit('message:seen', { conversationId, messageId, userId });
    });

    socket.on('disconnect', () => {});
  });
}

export function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io as Server;
}
