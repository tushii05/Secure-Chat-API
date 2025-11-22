"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMessage = createMessage;
exports.listMessages = listMessages;
const prismaClient_1 = __importDefault(require("../../prismaClient"));
const sockets_1 = require("../../sockets");
const HttpError_1 = require("../../utils/HttpError");
async function createMessage(conversationId, senderId, content, metadata) {
    try {
        const message = await prismaClient_1.default.message.create({
            data: { conversationId, senderId, content, metadata },
        });
        try {
            const io = (0, sockets_1.getIO)();
            io.to(`conversation_${conversationId}`).emit('message:new', message);
        }
        catch (e) {
            console.warn('Socket emit failed:', e);
        }
        return message;
    }
    catch (err) {
        throw new HttpError_1.HttpError(500, 'Failed to create message');
    }
}
async function listMessages(conversationId, limit = 20, cursor) {
    try {
        const messages = await prismaClient_1.default.message.findMany({
            where: { conversationId },
            take: limit,
            skip: cursor ? 1 : 0,
            cursor: cursor ? { id: cursor } : undefined,
            orderBy: { createdAt: 'asc' },
        });
        return messages;
    }
    catch (err) {
        throw new HttpError_1.HttpError(500, 'Failed to fetch messages');
    }
}
