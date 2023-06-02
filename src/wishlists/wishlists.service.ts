import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import exceptions from '../common/constants/exceptions';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createWishlistDto: CreateWishlistDto, owner: User) {
    const items = await this.wishesService.findMany(createWishlistDto.itemsId);

    if (!items.length) {
      throw new NotFoundException(exceptions.wishlists.notFoundWishes);
    }

    const newWishlist = await this.wishlistRepository.create({
      ...createWishlistDto,
      items,
      owner,
    });

    return this.wishlistRepository.save(newWishlist);
  }

  async findAll() {
    return this.wishlistRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async findOne(id: number) {
    const wishlist = await this.wishlistRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });

    if (!wishlist) {
      throw new NotFoundException(exceptions.wishlists.notFound);
    }

    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ) {
    const wish = await this.findOne(id);

    if (wish.owner.id !== userId) {
      throw new BadRequestException(exceptions.wishlists.forbidden);
    }

    return this.wishlistRepository.update(id, updateWishlistDto);
  }

  async remove(id: number, userId: number) {
    const wish = await this.findOne(id);

    if (wish.owner.id !== userId) {
      throw new BadRequestException(exceptions.wishlists.forbidden);
    }

    return this.wishlistRepository.delete(id);
  }
}
