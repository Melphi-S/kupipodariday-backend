import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { HashService } from '../hash/hash.service';
import { Wish } from '../wishes/entities/wish.entity';
import exceptions from '../common/constants/exceptions';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
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

    return this.userRepository.save(newUser).catch((e) => {
      if (e.code == exceptions.dbCodes.notUnique) {
        throw new BadRequestException(exceptions.users.notUnique);
      }

      return e;
    });
  }

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(exceptions.users.notFound);
    }

    return user;
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      throw new NotFoundException(exceptions.users.notFound);
    }

    return user;
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

    await this.userRepository.update({ id }, updateUserDto).catch((e) => {
      if (e.code == exceptions.dbCodes.notUnique) {
        throw new BadRequestException(exceptions.users.notUnique);
      }

      return e;
    });

    return this.userRepository.findOneBy({ id });
  }

  async findUserWishes(id: number): Promise<Wish[]> {
    return this.wishRepository.find({
      where: { owner: { id } },
      relations: {
        owner: true,
        offers: true,
      },
    });
  }
}
