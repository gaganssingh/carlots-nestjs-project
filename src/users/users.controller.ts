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
  Session,
  UseInterceptors,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './user.entity';
import { UsersService } from './users.service';

// ROUTE -> /auth/
@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get(`/whoami`)
  // whoAmI(@Session() session: any) {
  //   return this.usersService.findOne(session.userId);
  // }

  @Get(`/whoami`)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

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
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signup(email, password);
    session.userId = user.id;
    return user;
  }

  @Post(`/signin`)
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signin(email, password);
    session.userId = user.id;
    return user;
  }

  @Post(`/signout`)
  signout(@Session() session: any) {
    session.userId = null;
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
