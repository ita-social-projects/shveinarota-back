import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateCardsInput {
  @Field(() => String)
  text: string;

  @Field(() => String)
  imagePath: string;
}
