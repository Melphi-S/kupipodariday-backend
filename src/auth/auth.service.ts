import { Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { HashService } from '../hash/hash.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {}

  auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  async validatePassword(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.usersService.findOne(username);

    const isAuthorized = await this.hashService.compareHash(
      password,
      user.password,
    );

    return isAuthorized ? user : null;
  }
}
