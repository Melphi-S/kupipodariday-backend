import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';
import exceptions from '../common/constants/exceptions';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User): Promise<Offer> {
    const { amount, hidden, itemId } = createOfferDto;

    const item = await this.wishesService.findOne(itemId);

    if (item.owner.id === user.id) {
      throw new BadRequestException(exceptions.offers.forbidden);
    }

    const raised = item.raised + amount;

    if (raised > item.price) {
      throw new BadRequestException(exceptions.offers.exceededPrice);
    }

    const newOffer = await this.offerRepository.create({
      amount,
      hidden,
      user,
      item,
    });

    await this.wishesService.updateRaised(itemId, raised);

    return this.offerRepository.save(newOffer);
  }

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find({ relations: { user: true, item: true } });
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: { user: true, item: true },
    });

    if (!offer) {
      throw new NotFoundException(exceptions.offers.notFound);
    }

    return offer;
  }
}
