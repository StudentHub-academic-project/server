import dotenv from 'dotenv';
import supertest from 'supertest';
import { app, server } from '../../src/api';
import { handleErrorSync } from '@stlib/utils';
import { PostModel, sequelize, UserModel } from '../../src/db';
import { SigninDto, SignupDto } from '../../src/auth/dto';
import { EdituserDto } from '../../src/user/dto';

dotenv.config();

describe('End to end tests', () => {
  let authtoken = '';

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

  describe('Auth', () => {
    describe('Sign up', () => {
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
            email: 'wrongemail',
            password: dto.password,
            password_repeat: dto.password,
          })
          .expect(400);
      });

      it('Should signup', async () => {
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

      it('Should throw if user already exists', async () => {
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

    describe('Sign in', () => {
      const dto: SigninDto = {
        email: 'email@email.com',
        password: '123456',
      };

      it('Should throw if no body provided', async () => {
        return supertest(app).post('/auth/signin').expect(400);
      });

      it('Should throw if email is wrong format', async () => {
        return supertest(app)
          .post('/auth/signin')
          .send({
            email: 'wrongmail',
            password: dto.password,
          })
          .expect(400);
      });

      it('Should signin', async () => {
        const response = await supertest(app)
          .post('/auth/signin')
          .send({
            email: dto.email,
            password: dto.password,
          })
          .expect(200);

        authtoken = response.body.token;
      });
    });
  });

  describe('User', () => {
    describe('/me get user', () => {
      it('Should throw if not logged in', () => {
        return supertest(app).get('/me').expect(401);
      });

      it('Should return user', () => {
        return supertest(app)
          .get('/me')
          .set('Authorization', `Bearer ${authtoken}`)
          .expect(200);
      });
    });

    describe('/username get user', () => {
      it('Should return user by username', () => {
        return supertest(app)
          .get('/user')
          .set('Authorization', `Bearer ${authtoken}`)
          .expect(200);
      })
    })

    describe('/me edit user', () => {
      const dto: EdituserDto = {
        username: 'newname',
        fullname: 'new full name',
      };

      it('Should throw if not logged in', () => {
        return supertest(app).patch('/me').expect(401);
      });

      it('Should return if body is empty', () => {
        return supertest(app)
          .patch('/me')
          .set('Authorization', `Bearer ${authtoken}`)
          .expect(200);
      });

      it('Should return even if wrong body params', () => {
        return supertest(app)
          .patch('/me')
          .set('Authorization', `Bearer ${authtoken}`)
          .send({
            notexistingparam: 'smth',
          })
          .expect(200);
      });

      it('Should edit user', () => {
        return supertest(app)
          .patch('/me')
          .set('Authorization', `Bearer ${authtoken}`)
          .send({
            username: dto.username,
            fullname: dto.fullname,
          })
          .expect(200);
      });
    });
  });
});
