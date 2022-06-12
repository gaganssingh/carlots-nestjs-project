import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe(`signup`, () => {
    it('handles a signup request', async () => {
      expect.assertions(2);

      const newUser = { email: 'test@test1.com', password: '123456' };

      const user = await request(app.getHttpServer())
        .post(`/auth/signup`)
        .send(newUser)
        .expect(201);

      expect(user.body.id).toBeDefined();
      expect(user.body.email).toBe(newUser.email);
    });
  });

  describe(`current user`, () => {
    it(`returns the currently logged in user`, async () => {
      expect.assertions(2);

      const newUser = { email: 'test@test1.com', password: '123456' };
      const res = await request(app.getHttpServer())
        .post(`/auth/signup`)
        .send(newUser)
        .expect(201);

      const cookie = res.get('Set-Cookie');

      const user = await request(app.getHttpServer())
        .get(`/auth/whoami`)
        .set('Cookie', cookie)
        .expect(200);
      expect(user.body.id).toBeDefined();
      expect(user.body.email).toBe(newUser.email);
    });
  });
});
