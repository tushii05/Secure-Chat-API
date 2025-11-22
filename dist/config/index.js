"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.default = {
    port: Number(process.env.PORT || 4000),
    nodeEnv: process.env.NODE_ENV || 'development',
    jwt: {
        accessSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'access-secret',
        refreshSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh-secret',
        accessExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
        refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
    },
    uploadsDir: process.env.UPLOADS_DIR || './uploads',
    maxFileSize: Number(process.env.MAX_FILE_SIZE || 5242880),
    rateLimit: {
        windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
        max: Number(process.env.RATE_LIMIT_MAX || 100)
    }
};
