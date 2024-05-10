import dotenv from 'dotenv';
import supertest from 'supertest';
import { app, server } from '../../src/api';
import { handleErrorSync } from '@stlib/utils';
import { PostModel, sequelize, UserModel } from '../../src/db';
import { SignupDto } from '../../src/auth/dto';

dotenv.config();

describe('End to end tests', () => {
  beforeAll(async () => {
    try {
      await sequelize.authenticate();
      await UserModel.sync({ force: true });
      await PostModel.sync({ force: true });
      return console.log('Database connection established successfully.');
    } catch (error) {
      handleErrorSync(error, { throw: true });
    }
  });

  afterAll(async () => {
    server.close((error) => {
      handleErrorSync(error, {
        message: 'Server close error.',
        throw: true,
      });
    });
    await UserModel.drop();
  });

  describe('GET /', () => {
    it('Should response with status 200', async () => {
      return supertest(app).get('/').expect(200);
    });
  });

  describe('Auth module', () => {
    const dto: SignupDto = {
      username: 'user',
      fullname: 'user name',
      email: 'email@email.com',
      password: '123456',
    };

    it('Should throw if no body provided', async () => {
      return supertest(app).post('/auth/signup').expect(400);
    });

    it('Should throw if email is wrong format', async () => {
      return supertest(app)
        .post('/auth/signup')
        .send({
          username: dto.username,
          fullname: dto.fullname,
          email: dto.email,
          password: dto.password,
          password_repeat: dto.password,
        })
        .expect(201);
    });

    it('Should signup', async () => {
      return supertest(app)
        .post('/auth/signup')
        .send({
          username: dto.username,
          fullname: dto.fullname,
          email: 'wrongemail',
          password: dto.password,
          password_repeat: dto.password,
        })
        .expect(400);
    });

    it('Should thjrow if user already exists', async () => {
      return supertest(app)
        .post('/auth/signup')
        .send({
          username: dto.username,
          fullname: dto.fullname,
          email: dto.email,
          password: dto.password,
          password_repeat: dto.password,
        })
        .expect(403);
    });
  });
});
