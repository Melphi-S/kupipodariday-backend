import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { HashService } from '../hash/hash.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const password = await this.hashService.generateHash(
      createUserDto.password,
    );

    const newUser = await this.userRepository.create({
      ...createUserDto,
      password,
    });

    return this.userRepository.save(newUser);
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOneBy({ id });
  }

  async findOne(username: string): Promise<User> {
    return this.userRepository.findOneBy({ username });
  }

  async findMany(query: string): Promise<User[]> {
    const likeQuery = Like(`%${query}%`);

    return this.userRepository.find({
      where: [{ username: likeQuery }, { email: likeQuery }],
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashService.generateHash(
        updateUserDto.password,
      );
    }

    await this.userRepository.update({ id }, updateUserDto);

    return this.userRepository.findOneBy({ id });
  }
}
