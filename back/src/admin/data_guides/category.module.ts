import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Subcategory } from './entities/subcategory.entity';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { SubcategoryService } from './services/subcategory.service';
import { SubcategoryController } from './controllers/subcategory.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Category, Subcategory])], // Додаємо TypeORM
  controllers: [CategoryController, SubcategoryController],
  providers: [CategoryService, SubcategoryService],
  exports: [CategoryService, SubcategoryService],
})
export class CategoryModule {}
