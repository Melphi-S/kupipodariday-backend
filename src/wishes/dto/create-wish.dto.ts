import { IsPositive, IsUrl, Length } from 'class-validator';

export class CreateWishDto {
  @Length(1, 200)
  name: string;

  @IsUrl()
  link: string;

  @IsUrl()
  image: string;

  @IsPositive()
  price: number;

  @Length(1, 1024)
  description: string;
}
