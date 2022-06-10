import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe(`[AuthService]`, () => {
  let service: AuthService;

  beforeEach(async () => {
    const users: User[] = [];

    // mocked users service
    const fakeUsersService: Partial<UsersService> = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999999) + 1,
          email,
          password,
        } as User;

        users.push(user);
        return Promise.resolve(user);
      },
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
      await service.signup('test@test.com', '1234567890');
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

      await service.signup('test@test.com', 'abcdef');
      const response = service.signin('test@test.com', '123456789');
      await expect(response).rejects.toBeInstanceOf(BadRequestException);

      // ALTERNATIVE
      // try {
      //   await service.signin('test@test.com', 'abcdef');
      // } catch (error) {}
    });

    it(`returns a user on providing correct user and password`, async () => {
      await service.signup('test@test.com', '123456');

      const user = await service.signin('test@test.com', '123456');
      expect(user).toBeDefined();
    });
  });
});
