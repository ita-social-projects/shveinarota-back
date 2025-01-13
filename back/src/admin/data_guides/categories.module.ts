import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './category.service';
import { CategoriesController } from './category.controller';
import { Category } from './entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';
import { Detail } from './entities/detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Subcategory, Detail])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
