"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refresh = refresh;
exports.logout = logout;
const prismaClient_1 = __importDefault(require("../../prismaClient"));
const hash_1 = require("../../utils/hash");
const jwt_1 = require("../../utils/jwt");
const addDays_1 = __importDefault(require("date-fns/addDays"));
const HttpError_1 = require("../../utils/HttpError");
async function register(email, password, name) {
    const existing = await prismaClient_1.default.user.findUnique({ where: { email } });
    if (existing)
        throw new HttpError_1.HttpError(400, 'Email already in use');
    const passwordHash = await (0, hash_1.hash)(password);
    return prismaClient_1.default.user.create({ data: { email, passwordHash, name } });
}
async function login(email, password) {
    const user = await prismaClient_1.default.user.findUnique({ where: { email } });
    if (!user)
        throw new HttpError_1.HttpError(400, 'Invalid credentials');
    const ok = await (0, hash_1.compare)(password, user.passwordHash);
    if (!ok)
        throw new HttpError_1.HttpError(400, 'Invalid credentials');
    const access = (0, jwt_1.signAccess)({ sub: user.id, role: user.role });
    const refreshPlain = (0, jwt_1.makeRefresh)();
    const refreshHash = await (0, hash_1.hash)(refreshPlain);
    const expiresAt = (0, addDays_1.default)(new Date(), 7);
    await prismaClient_1.default.refreshToken.create({
        data: { userId: user.id, tokenHash: refreshHash, expiresAt },
    });
    return {
        access,
        refresh: refreshPlain,
        user: { id: user.id, email: user.email, name: user.name },
    };
}
async function refresh(refreshPlain) {
    const tokens = await prismaClient_1.default.refreshToken.findMany({ where: { revoked: false } });
    for (const t of tokens) {
        const match = await (0, hash_1.compare)(refreshPlain, t.tokenHash);
        if (match) {
            if (t.expiresAt < new Date())
                throw new HttpError_1.HttpError(401, 'Refresh token expired');
            await prismaClient_1.default.refreshToken.update({ where: { id: t.id }, data: { revoked: true } });
            const newPlain = (0, jwt_1.makeRefresh)();
            const newHash = await (0, hash_1.hash)(newPlain);
            const expiresAt = (0, addDays_1.default)(new Date(), 7);
            await prismaClient_1.default.refreshToken.create({ data: { userId: t.userId, tokenHash: newHash, expiresAt } });
            const user = await prismaClient_1.default.user.findUnique({ where: { id: t.userId } });
            const access = (0, jwt_1.signAccess)({ sub: user.id, role: user.role });
            return { access, refresh: newPlain };
        }
    }
    throw new HttpError_1.HttpError(401, 'Invalid refresh token');
}
async function logout(refreshPlain) {
    const tokens = await prismaClient_1.default.refreshToken.findMany({ where: { revoked: false } });
    for (const t of tokens) {
        const match = await (0, hash_1.compare)(refreshPlain, t.tokenHash);
        if (match) {
            await prismaClient_1.default.refreshToken.update({ where: { id: t.id }, data: { revoked: true } });
            return;
        }
    }
}
