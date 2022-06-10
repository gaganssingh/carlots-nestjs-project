import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    // Mocked UsersService
    fakeUsersService = {
      findOne: (id: number) =>
        Promise.resolve({
          id,
          email: 'test@test.com',
          password: '123456',
        } as User),
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: '123456' } as User]),
      // remove: () => {},
      // update: () => {}
    };

    // Mocked AuthService
    fakeAuthService = {
      // signup: () => {},
      signin: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe(`findAllUsers`, () => {
    it(`returns all users with given email`, async () => {
      expect.assertions(2);

      const users = await controller.findAllUsers('test@test.com');
      expect(users.length).toBe(1);
      expect(users[0].email).toBe('test@test.com');
    });
  });

  describe(`findOne`, () => {
    it(`throws an error is user with given id not found`, async () => {
      expect.assertions(1);

      fakeUsersService.findOne = () => null;

      const user = controller.findUser('20');
      await expect(user).rejects.toBeInstanceOf(NotFoundException);
    });

    it(`return one user by a given id`, async () => {
      expect.assertions(2);

      const user = await controller.findUser('1');
      expect(user.id).toBe(1);
      expect(user.email).toBe('test@test.com');
    });
  });

  describe(`signin`, () => {
    it(`signs in and returns the user`, async () => {
      const session = {
        userId: 1000,
      };

      const user = await controller.signin(
        { email: 'test@test.com', password: '123456' },
        session,
      );
      expect(user.id).toBe(1);
      expect(session.userId).toEqual(1);
    });
  });
});
