"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMsg = createMsg;
exports.getMessages = getMessages;
const service = __importStar(require("./messages.service"));
const HttpError_1 = require("../../utils/HttpError");
async function createMsg(req, res, next) {
    try {
        const { conversationId, content, metadata } = req.body;
        const senderId = req.user.id;
        if (!content || content.trim().length === 0) {
            throw new HttpError_1.HttpError(400, "Message content is required");
        }
        const message = await service.createMessage(Number(conversationId), senderId, content, metadata);
        res.status(201).json(message);
    }
    catch (err) {
        next(err);
    }
}
async function getMessages(req, res, next) {
    try {
        const conversationId = Number(req.params.id);
        const limit = Number(req.query.limit || 20);
        const cursor = req.query.cursor ? Number(req.query.cursor) : undefined;
        const messages = await service.listMessages(conversationId, limit, cursor);
        res.json(messages);
    }
    catch (err) {
        next(err);
    }
}
