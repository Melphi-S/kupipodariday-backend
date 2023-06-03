import {
  Controller,
  Post,
  UseGuards,
  SerializeOptions,
  Body,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { SigninResponseDto } from './dto/signin-response.dto';
import { AuthUser } from '../common/decorators/auth-user.decorator';

@Controller()
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@AuthUser() user: User): SigninResponseDto {
    return this.authService.auth(user);
  }

  @SerializeOptions({ groups: ['private'] })
  @Post('signup')
  async create(
    @Body() createUserDto: CreateUserDto,
  ): Promise<SigninResponseDto> {
    const user = await this.usersService.create(createUserDto);
    return this.authService.auth(user);
  }
}
