import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { User } from '../users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { AuthUser } from '../common/decorators/auth-user.decorator';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Body() createWishDto: CreateWishDto,
    @Req() { user }: { user: User },
  ): Promise<Wish> {
    return this.wishesService.create(createWishDto, user);
  }

  @Get('last')
  async getLast() {
    return this.wishesService.findLast();
  }

  @Get('top')
  async getTop() {
    return this.wishesService.findTop();
  }

  @Get(':id')
  async getWish(@Param('id') id: number): Promise<Wish> {
    return this.wishesService.findOne(id);
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWish(
    @Param('id') id: number,
    @Body() updateWishDto: UpdateWishDto,
    @AuthUser() user: User,
  ) {
    return this.wishesService.update(id, updateWishDto, user.id);
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWish(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishesService.delete(id, user.id);
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(
    @Param('id') id: number,
    @AuthUser() user: User,
  ): Promise<Wish> {
    return this.wishesService.copy(id, user);
  }
}
