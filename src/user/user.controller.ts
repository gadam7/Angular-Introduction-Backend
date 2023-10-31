import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  // GET endpoints

  @Get()
  async findAllUsers() {
    return await this.userService.findAllUsers();
  }

  @Get(':id')
  async findUserById(@Param('id') id: string) {
    return await this.userService.findUserById(parseInt(id));
  }

  @Get('email/:email')
  async findUserByEmail(@Param('email') email: string) {
    return await this.userService.findUserByEmail(email);
  }

  // POST endpoints

  @Post()
  async createUser(@Body(new ValidationPipe()) user: UserDto) {
    return await this.userService.createUser(user);
  }

  @Post('bulk')
  async createUsers(@Body(new ValidationPipe()) users: UserDto[]) {
    return await this.userService.createUsers(users);
  }
}
