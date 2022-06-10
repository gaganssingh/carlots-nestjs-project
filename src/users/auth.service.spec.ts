import { BadRequestException } from '@nestjs/common';
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

  it(`can create an instance of the auth service`, async () => {
    expect(service).toBeDefined();
  });

  describe(`signup`, () => {
    it(`successfully signup a new user and returns a hashed password`, async () => {
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
      fakeUsersService.find = () =>
        Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

      await expect(
        service.signup('asdf@asdf.com', 'asdf'),
      ).rejects.toBeInstanceOf(BadRequestException);
    });
    //
  });
});
