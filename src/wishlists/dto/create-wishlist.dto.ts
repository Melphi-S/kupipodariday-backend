import { IsNumber, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsNumber({ maxDecimalPlaces: 0 }, { each: true })
  itemsId: number[];
}
