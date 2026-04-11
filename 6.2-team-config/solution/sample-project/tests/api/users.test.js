const request = require('supertest');
const express = require('express');
const usersRouter = require('../../src/api/users');

jest.mock('../../src/db', () => ({
  query: jest.fn(),
}));
jest.mock('../../src/services/auth', () => ({
  authMiddleware: (req, res, next) => {
    req.user = { id: 1, email: 'test@example.com', role: 'admin' };
    next();
  },
}));

const db = require('../../src/db');
const app = express();
app.use(express.json());
app.use('/users', usersRouter);

describe('Users API', () => {
  afterEach(() => jest.clearAllMocks());

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      db.query.mockResolvedValue({ rows: [{ id: 1, name: 'Alice', email: 'alice@test.com' }] });
      const res = await request(app).get('/users');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.count).toBe(1);
    });

    it('should return 500 on database error', async () => {
      db.query.mockRejectedValue(new Error('Connection refused'));
      const res = await request(app).get('/users');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /users/:id', () => {
    it('should return a single user', async () => {
      db.query.mockResolvedValue({ rows: [{ id: 1, name: 'Alice' }] });
      const res = await request(app).get('/users/1');
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Alice');
    });

    it('should return 404 for non-existent user', async () => {
      db.query.mockResolvedValue({ rows: [] });
      const res = await request(app).get('/users/999');
      expect(res.status).toBe(404);
    });
  });

  describe('POST /users', () => {
    it('should create a new user', async () => {
      const newUser = { name: 'Bob', email: 'bob@test.com', role: 'user' };
      db.query.mockResolvedValue({ rows: [{ id: 2, ...newUser }] });
      const res = await request(app).post('/users').send(newUser);
      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Bob');
    });
  });
});
