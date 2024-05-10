import dotenv from 'dotenv';
import supertest from 'supertest';
import { app, server } from '../../src/api';
import { handleErrorSync } from '@stlib/utils';

dotenv.config();

describe('End to end tests', () => {
  afterAll(() => {
    server.close((error) => {
      handleErrorSync(error, {
        message: 'Server close error.',
        throw: true,
      });
    });
  });

  describe('GET /', () => {
    it('Should response with status 200', async () => {
      return supertest(app).get('/').expect(200);
    });
  });
});
