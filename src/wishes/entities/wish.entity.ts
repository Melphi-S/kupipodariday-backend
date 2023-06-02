import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNumber, IsPositive, IsUrl, Length } from "class-validator";
import { User } from '../../users/entities/user.entity';
import { Wishlist } from '../../wishlists/entities/wishlist.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @CreateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 200)
  name: string;

  @Column()
  @IsUrl()
  link: string;

  @Column()
  @IsUrl()
  image: string;

  @Column()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price: number;

  @Column()
  @Length(1, 1024)
  description: string;

  @Column({ default: 0 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  raised: number;

  @Column({ default: 0 })
  @IsNumber()
  @IsPositive()
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.wish)
  offers: Offer[];

  @ManyToMany(() => Wishlist, (wishlist) => wishlist.items)
  wishlist: Wishlist[];
}
