"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../app"));
describe('Auth API', () => {
    const randomEmail = `${Date.now()}@test.com`;
    const password = '12345678';
    it('registers a user', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/register')
            .send({
            email: randomEmail,
            password,
            name: 'Tester'
        });
        expect([200, 201]).toContain(res.statusCode);
    });
    it('fails to register duplicate user', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/register')
            .send({
            email: randomEmail,
            password,
            name: 'Tester'
        });
        expect(res.statusCode).toBe(400);
    });
    it('fails login with wrong password', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({ email: randomEmail, password: 'wrongpass' });
        expect(res.statusCode).toBe(400);
    });
    it('logs in successfully', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({ email: randomEmail, password });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('access');
        expect(res.body).toHaveProperty('refresh');
    });
    it('validates missing fields', async () => {
        const res = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({ email: randomEmail });
        expect(res.statusCode).toBe(400);
    });
});
