import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { AuthUser } from '../common/decorators/auth-user.decorator';
import { User } from '../users/entities/user.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { Offer } from './entities/offer.entity';

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @AuthUser() user: User,
  ): Promise<Offer> {
    return this.offersService.create(createOfferDto, user);
  }

  @Get()
  findAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Offer> {
    return this.offersService.findOne(id);
  }
}
