import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesService } from './services/categories.service';
import { DetailsService } from './services/details.service';
import { SubcategoriesService } from './services/subcategories.service';
import { CategoriesController } from './controllers/categories.controller';
import { DetailsController } from './controllers/details.controller';
import { SubcategoriesController } from './controllers/subcategories.controller';
import { Category } from './entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';
import { Detail } from './entities/detail.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Subcategory, Detail])],
  controllers: [CategoriesController, DetailsController, SubcategoriesController],
  providers: [CategoriesService, DetailsService, SubcategoriesService],
})
export class CategoriesModule {}
