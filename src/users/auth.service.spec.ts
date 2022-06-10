import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe(`[AuthService]`, () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // mocked users service
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        // When the AuthService asks for UsersService,
        // give it the mocked object "fakeUsersService"
        {
          provide: UsersService, // AuthService looking for this
          useValue: fakeUsersService, // Give it this faked version
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  describe(`general test`, () => {
    it(`can create an instance of the auth service`, async () => {
      expect(service).toBeDefined();
    });
  });

  describe(`signup`, () => {
    it(`successfully signup a new user and returns a hashed password`, async () => {
      expect.assertions(5);
      const newUser = {
        email: 'test@test.com',
        password: '123456789qwerty',
      } as User;

      const user = await service.signup(newUser.email, newUser.password);
      expect(user.email).toBe(newUser.email);
      expect(user.password).not.toBe(newUser.password);

      const [salt, hash] = user.password.split('.');
      expect(salt).toBeDefined();
      expect(salt).toHaveLength(16);
      expect(hash).toHaveLength(64);
    });

    it(`throws an error if signup email already exists`, async () => {
      expect.assertions(1);

      fakeUsersService.find = () =>
        Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

      const response = service.signup('test@test.com', '1234567890');
      await expect(response).rejects.toBeInstanceOf(BadRequestException);
    });
    //
  });

  describe(`signin`, () => {
    it(`throws an error if email not found`, async () => {
      expect.assertions(1);
      const response = service.signin('doesnot@exist.com', '1234567890');

      await expect(response).rejects.toBeInstanceOf(NotFoundException);
    });

    // ALTERNATIVE TEST
    // // Prefer the above as that has a clear expect
    it(`throws an error if email not found ALTERNATIVE`, async () => {
      try {
        await service.signin('doesnot@exist.com', '1234567890');
      } catch (error) {}
    });

    it(`throws an error if password is invalid`, async () => {
      expect.assertions(1);

      fakeUsersService.find = () =>
        Promise.resolve([
          { email: 'test@test.com', password: '123456' } as User,
        ]);
      const response = service.signin('test@test.com', 'abcdef');
      await expect(response).rejects.toBeInstanceOf(BadRequestException);

      // ALTERNATIVE
      // try {
      //   await service.signin('test@test.com', 'abcdef');
      // } catch (error) {}
    });

    it.only(`returns a user on providing correct user and password`, async () => {
      const createTestUser = await service.signup('test@test.com', '123456');
      const testPassword = createTestUser.password;

      fakeUsersService.find = () =>
        Promise.resolve([
          { email: 'test@test.com', password: testPassword } as User,
        ]);

      const user = await service.signin('test@test.com', '123456');
      expect(user).toBeDefined();
    });
  });
});
