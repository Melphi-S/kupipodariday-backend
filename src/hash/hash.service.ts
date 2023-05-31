import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class HashService {
  constructor(private readonly configService: ConfigService) {}

  async generateHash(password: string): Promise<string> {
    const salt = Number(this.configService.get<string>('SALT'));
    return await bcrypt.hash(password, salt);
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
