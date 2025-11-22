import request from 'supertest';
import app from '../app';

describe('Auth API', () => {
  const randomEmail = `${Date.now()}@test.com`;
  const password = '12345678';

  it('registers a user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        email: randomEmail,
        password,
        name: 'Tester'
      });

    expect([200, 201]).toContain(res.statusCode);
  });

  it('fails to register duplicate user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        email: randomEmail,
        password,
        name: 'Tester'
      });

    expect(res.statusCode).toBe(400);
  });

  it('fails login with wrong password', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: randomEmail, password: 'wrongpass' });

    expect(res.statusCode).toBe(400);
  });

  it('logs in successfully', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: randomEmail, password });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('access');
    expect(res.body).toHaveProperty('refresh');
  });

  it('validates missing fields', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({ email: randomEmail });

    expect(res.statusCode).toBe(400);
  });
});
