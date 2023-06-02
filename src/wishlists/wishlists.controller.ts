import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from '../users/entities/user.entity';
import { AuthUser } from '../common/decorators/auth-user.decorator';

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Post()
  async create(
    @Body() createWishlistDto: CreateWishlistDto,
    @AuthUser() user: User,
  ) {
    return this.wishlistsService.create(createWishlistDto, user);
  }

  @Get()
  findAll() {
    return this.wishlistsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @AuthUser() user: User,
  ) {
    return this.wishlistsService.update(id, updateWishlistDto, user.id);
  }

  @Delete(':id')
  remove(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishlistsService.remove(id, user.id);
  }
}
