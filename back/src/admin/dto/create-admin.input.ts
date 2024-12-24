import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCardsInput {
  @Field(() => String)
  title: string; // Название карточки

  @Field(() => String)
  description: string; // Описание карточки

  @Field(() => String)
  imagePath: string; // Путь к изображению
}
