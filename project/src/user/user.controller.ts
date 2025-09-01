import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() data: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    await this.userService.createUser(data);
    return { message: 'User created successfully' };
  }
}
