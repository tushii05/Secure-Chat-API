"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConversation = createConversation;
exports.listConversations = listConversations;
const prismaClient_1 = __importDefault(require("../../prismaClient"));
const HttpError_1 = require("../../utils/HttpError");
async function createConversation(userAId, userBId) {
    const [a, b] = userAId < userBId ? [userAId, userBId] : [userBId, userAId];
    if (a === b) {
        throw new HttpError_1.HttpError(400, 'Cannot create conversation with self');
    }
    try {
        const conv = await prismaClient_1.default.conversation.upsert({
            where: { userAId_userBId: { userAId: a, userBId: b } },
            update: {},
            create: { userAId: a, userBId: b }
        });
        return conv;
    }
    catch (err) {
        throw new HttpError_1.HttpError(500, 'Failed to create conversation');
    }
}
async function listConversations(userId) {
    try {
        const convs = await prismaClient_1.default.conversation.findMany({
            where: { OR: [{ userAId: userId }, { userBId: userId }] },
            include: { messages: { take: 1, orderBy: { createdAt: 'desc' } } }
        });
        return convs;
    }
    catch (err) {
        throw new HttpError_1.HttpError(500, 'Failed to fetch conversations');
    }
}
