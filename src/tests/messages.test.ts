import request from 'supertest';
import app from '../app';

describe('Messages', () => {
  let token: string;
  let userEmail = `${Date.now()}@msg.com`;

  beforeAll(async () => {
    await request(app)
      .post('/auth/register')
      .send({ email: userEmail, password: '12345678', name: 'MsgUser' });

    const login = await request(app)
      .post('/auth/login')
      .send({ email: userEmail, password: '12345678' });

    token = login.body.access;
  });

  it('requires auth to post message', async () => {
    const res = await request(app)
      .post('/messages')
      .send({ conversationId: 1, content: 'Test' });

    expect(res.statusCode).toBe(401);
  });

  it('posts message when authenticated', async () => {
    const res = await request(app)
      .post('/messages')
      .set('Authorization', `Bearer ${token}`)
      .send({ conversationId: 1, content: 'Hello there!' });

    expect([200, 201]).toContain(res.statusCode);
  });

});
