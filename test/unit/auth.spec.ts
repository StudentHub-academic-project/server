import {hashPassword} from "../../src/auth/auth.service";

describe('hashPassword', () => {
  it('should return a hashed string', async () => {
    const password = 'password123';
    const hash = await hashPassword(password);

    expect(typeof hash).toBe('string');
    expect(hash).not.toBe(password);
  });

  it('should return different hashes for the same password', async () => {
    const password = 'password123';
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    expect(hash1).not.toBe(hash2);
  });

  it('should return different hashes for similar passwords', async () => {
    const password1 = 'password123';
    const password2 = 'password1234';
    const hash1 = await hashPassword(password1);
    const hash2 = await hashPassword(password2);

    expect(hash1).not.toBe(hash2);
  });

  it('should return different hashes for different passwords', async () => {
    const password1 = 'password123';
    const password2 = 'differentPassword456';
    const hash1 = await hashPassword(password1);
    const hash2 = await hashPassword(password2);

    expect(hash1).not.toBe(hash2);
  });
});
