const { generateToken, verifyToken, hashPassword, comparePassword } = require('../../src/services/auth');

describe('Auth Service', () => {
  const mockUser = { id: 1, email: 'test@example.com', role: 'user' };

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(mockUser);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token and return decoded payload', () => {
      const token = generateToken(mockUser);
      const decoded = verifyToken(token);
      expect(decoded.id).toBe(mockUser.id);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
    });

    it('should return null for an invalid token', () => {
      const result = verifyToken('invalid.token.string');
      expect(result).toBeNull();
    });

    it('should return null for an expired token', () => {
      const result = verifyToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZXhwIjoxfQ.abc');
      expect(result).toBeNull();
    });
  });

  describe('hashPassword / comparePassword', () => {
    it('should hash and verify a password', async () => {
      const password = 'secure-password-123';
      const hash = await hashPassword(password);
      expect(hash).not.toBe(password);
      const match = await comparePassword(password, hash);
      expect(match).toBe(true);
    });

    it('should reject an incorrect password', async () => {
      const hash = await hashPassword('correct-password');
      const match = await comparePassword('wrong-password', hash);
      expect(match).toBe(false);
    });
  });
});
