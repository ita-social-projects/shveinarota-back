import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cards')
@ObjectType()
export class Card {
  @PrimaryGeneratedColumn()
  @Field(() => Number)
  id: number;

  @Column()
  @Field(() => String)
  title: string; // Название карточки

  @Column()
  @Field(() => String)
  description: string; // Описание карточки

  @Column()
  @Field(() => String)
  imagePath: string; // Путь к изображению
}
