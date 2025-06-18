import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkShopCardsController } from './workShopCards.controller';
import { WorkShopCardsService } from './workShopCards.service';
import { workShopCards } from './entities/workShopCards.entity';

@Module({
  imports: [TypeOrmModule.forFeature([workShopCards])],
  controllers: [WorkShopCardsController],
  providers: [WorkShopCardsService],
  exports: [WorkShopCardsService],
})
export class WorkShopCardsModule {}
