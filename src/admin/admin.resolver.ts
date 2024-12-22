import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AdminService } from './admin.service';
import { Card } from './entities/admin.entity';
import { CreateCardsInput } from './dto/create-admin.input';

@Resolver(() => Card)
export class AdminResolver {
  constructor(private readonly adminService: AdminService) {}

  @Query(() => [Card], { name: 'getCard' })
  async getCard() {
    return this.adminService.getCard();
  }

  @Mutation(() => Card, { name: 'createCard' })
  async createCard(
    @Args('createCardsInput') createCardsInput: CreateCardsInput,
  ) {
    return this.adminService.createCard(createCardsInput);
  }
}
