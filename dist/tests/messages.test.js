"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('Messages', () => {
    let token;
    let userEmail = `${Date.now()}@msg.com`;
    beforeAll(async () => {
        await (0, supertest_1.default)(app_1.default)
            .post('/auth/register')
            .send({ email: userEmail, password: '12345678', name: 'MsgUser' });
        const login = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({ email: userEmail, password: '12345678' });
        token = login.body.access;
    });
    it('requires auth to post message', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/messages')
            .send({ conversationId: 1, content: 'Test' });
        expect(res.statusCode).toBe(401);
    });
    it('posts message when authenticated', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/messages')
            .set('Authorization', `Bearer ${token}`)
            .send({ conversationId: 1, content: 'Hello there!' });
        expect([200, 201]).toContain(res.statusCode);
    });
});
