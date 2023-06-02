import { IsNumber, IsPositive, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @Length(1, 200)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @Length(1, 1024)
  description: string;
}
