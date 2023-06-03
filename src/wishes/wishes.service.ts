import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { DeleteResult, In, Repository, UpdateResult } from 'typeorm';
import { User } from '../users/entities/user.entity';
import exceptions from '../common/constants/exceptions';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish) private readonly wishRepository: Repository<Wish>,
  ) {}

  async create(createWishDto: CreateWishDto, user: User): Promise<Wish> {
    const newWish = await this.wishRepository.create({
      ...createWishDto,
      owner: user,
    });

    return this.wishRepository.save(newWish);
  }

  async findLast(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });
  }

  async findTop(): Promise<Wish[]> {
    return this.wishRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 10,
    });
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: { user: true },
      },
    });

    if (!wish) {
      throw new NotFoundException(exceptions.wishes.notFound);
    }

    return wish;
  }

  async findMany(wishesIds: number[]): Promise<Wish[]> {
    return this.wishRepository.find({ where: { id: In(wishesIds) } });
  }

  async update(
    id: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ): Promise<UpdateResult> {
    const wish = await this.findOne(id);

    if (userId !== wish.owner.id) {
      throw new BadRequestException(exceptions.wishes.forbidden);
    }

    if (wish.raised && updateWishDto.price > 0) {
      throw new BadRequestException(exceptions.wishes.blockedPrice);
    }

    return this.wishRepository.update({ id }, updateWishDto);
  }

  async updateRaised(id: number, raised: number): Promise<UpdateResult> {
    return this.wishRepository.update({ id }, { raised });
  }

  async remove(id: number, userId: number): Promise<DeleteResult> {
    const wish = await this.findOne(id);

    if (userId !== wish.owner.id) {
      throw new BadRequestException(exceptions.wishes.forbidden);
    }

    return this.wishRepository.delete(id);
  }

  async copy(id: number, user: User): Promise<Wish> {
    const wish = await this.wishRepository.findOneBy({ id });

    if (!wish) {
      throw new NotFoundException(exceptions.wishes.notFound);
    }

    const { name, link, image, price, description } = wish;

    const copiedWish = await this.wishRepository.create({
      name,
      link,
      image,
      price,
      description,
      owner: user,
    });

    await this.wishRepository.update(
      { id: wish.id },
      { copied: ++wish.copied },
    );

    return this.wishRepository.save(copiedWish);
  }
}
