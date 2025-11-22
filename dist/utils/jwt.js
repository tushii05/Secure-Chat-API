"use strict";
// import jwt from 'jsonwebtoken';
// import { randomBytes } from 'crypto';
// import config from '../config';
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signAccess = signAccess;
exports.verifyAccess = verifyAccess;
exports.makeRefresh = makeRefresh;
// export function signAccess(payload: object) {
//   return jwt.sign(payload, config.jwt.accessSecret, { expiresIn: config.jwt.accessExpiresIn });
// }
// export function verifyAccess(token: string) {
//   return jwt.verify(token, config.jwt.accessSecret);
// }
// export function makeRefresh() {
//   return randomBytes(64).toString('hex');
// }
const jwt = __importStar(require("jsonwebtoken"));
const crypto_1 = require("crypto");
const config_1 = __importDefault(require("../config"));
// Sign an access token
function signAccess(payload) {
    return jwt.sign(payload, config_1.default.jwt.accessSecret, {
        // explicitly mark options as SignOptions
        expiresIn: config_1.default.jwt.accessExpiresIn,
    });
}
// Verify an access token
function verifyAccess(token) {
    const decoded = jwt.verify(token, config_1.default.jwt.accessSecret);
    if (typeof decoded === 'string') {
        throw new Error('Invalid token payload');
    }
    const payload = decoded;
    if (!payload.sub || !payload.role) {
        throw new Error('Invalid token payload structure');
    }
    return {
        sub: Number(payload.sub), // FIX — Cast safely
        role: payload.role,
    };
}
// Generate a random refresh token
function makeRefresh() {
    return (0, crypto_1.randomBytes)(64).toString('hex');
}
