import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Subcategory } from '../entities/subcategory.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  // Создание категории
  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  // Получение всех категорий
  async getAllCategories(): Promise<any[]> {
    const categories = await this.categoryRepository.find({
      relations: ['subcategories'],
    });

    return categories.map((category) => ({
      id: category.id,
      category_name: category.category_name,
      subcategories: category.subcategories.map((subcategory) => ({
        id: subcategory.id,
        category_name: subcategory.category_name,
      })),
    }));
  }

  // Обновление только поля category_name
  async updateCategoryName(categoryId: number, categoryName: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    category.category_name = categoryName;
    return this.categoryRepository.save(category);
  }

  // Удаление категории по ID
  async deleteCategoryById(categoryId: number): Promise<string> {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    await this.categoryRepository.remove(category);
    return `Category with ID ${categoryId} has been deleted`;
  }

  // Получение подкатегории с деталью
  async getSubcategoryWithDetail(categoryId: number, subcategoryId: number): Promise<Subcategory> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['subcategories'],
    });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    const subcategory = await this.subcategoryRepository.findOne({
      where: { id: subcategoryId, category: { id: categoryId } },
      relations: ['detail'],
    });

    if (!subcategory) {
      throw new HttpException('Subcategory not found', HttpStatus.NOT_FOUND);
    }

    return subcategory;
  }
}