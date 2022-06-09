import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

// ROUTE -> /auth/
@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Serialize(UserDto)
  @Get(`/:id`)
  async findUser(@Param(`id`) id: string) {
    const user = await this.usersService.findOne(+id);
    if (!user)
      throw new NotFoundException(`Unable to find user with id: ${id}`);

    return user;
  }

  @Get()
  async findAllUsers(@Query('email') email: string) {
    const users = await this.usersService.find(email);
    if (users.length === 0)
      throw new NotFoundException(`Unable to find user with email: ${email}`);
    return users;
  }

  @Post(`/signup`)
  createUser(@Body() body: CreateUserDto) {
    const { email, password } = body;
    this.usersService.create(email, password);
  }

  @Patch(`/:id`)
  updateUser(@Param(`id`) id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(+id, body);
  }

  @Delete(`/:id`)
  removeUser(@Param(`id`) id: string) {
    return this.usersService.remove(+id);
  }
}
