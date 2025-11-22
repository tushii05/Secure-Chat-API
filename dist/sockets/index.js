"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = attachSockets;
exports.getIO = getIO;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
let io = null;
function attachSockets(server) {
    io = new socket_io_1.Server(server, { cors: { origin: true, credentials: true } });
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;
            if (!token)
                return next(new Error('Authentication error'));
            const payload = jsonwebtoken_1.default.verify(token, config_1.default.jwt.accessSecret);
            socket.data = { userId: payload.sub };
            next();
        }
        catch (err) {
            next(new Error('Authentication error'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.data.userId;
        socket.on('join:conversation', (conversationId) => {
            socket.join(`conversation_${conversationId}`);
        });
        socket.on('leave:conversation', (conversationId) => {
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
        socket.on('disconnect', () => { });
    });
}
function getIO() {
    if (!io)
        throw new Error('Socket.io not initialized');
    return io;
}
