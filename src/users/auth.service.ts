import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';

// Converting scrypt from callback based to promise based
const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // Check if user exists
    const users = await this.usersService.find(email);
    // // send error if user already exists
    if (users.length > 0) {
      throw new BadRequestException(`email already in use`);
    }

    // Hash user password
    // // Generate salt
    const salt = randomBytes(8).toString('hex');

    // // Hash salt & password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // // Store the combination of the salt and hashed password
    const hashedAndSaltedPwd = salt + '.' + hash.toString('hex');

    // Create a new user & Save user to db
    const user = await this.usersService.create(email, hashedAndSaltedPwd);

    // Return newly created user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException(`user with email ${email} not found`);
    }

    // Check if passwords match
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // // If supplied password doesn't match the stored password
    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException(`bad password`);
    }

    return user;
  }
}
