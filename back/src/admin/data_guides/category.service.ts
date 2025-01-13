import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Detail } from './entities/detail.entity';
import { Subcategory } from './entities/subcategory.entity';
import { CreateDetailDto } from './dto/create-detail.dto';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
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

  // Создание подкатегории и детали одновременно
  async createSubcategoryWithDetail(
    categoryId: number,
    createSubcategoryDto: CreateSubcategoryDto,
  ): Promise<Subcategory> {
    // Найти категорию
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['subcategories'],
    });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    // Создать подкатегорию
    const subcategory = this.categoryRepository.manager.create(Subcategory, {
      category_name: createSubcategoryDto.category_name,
      category: category,
    });

    // Если есть деталь, добавить её
    if (createSubcategoryDto.detail) {
      const detail = this.categoryRepository.manager.create(Detail, {
        ...createSubcategoryDto.detail,
      });
      subcategory.detail = detail;
    }

    // Сохранить подкатегорию и связанные сущности
    return this.categoryRepository.manager.save(subcategory);
  }

  // Создание детали для подкатегории
  async createDetail(subcategoryId: number, createDetailDto: CreateDetailDto): Promise<Detail> {
    const subcategory = await this.categoryRepository.manager.findOne(Subcategory, { where: { id: subcategoryId } });
    if (!subcategory) {
      throw new HttpException('Subcategory not found', HttpStatus.NOT_FOUND);
    }

    const detail = this.categoryRepository.manager.create(Detail, {
      ...createDetailDto,
      subcategory,
    });

    return this.categoryRepository.manager.save(detail);
  }

  // Получение детали по ID подкатегории
  async getDetailBySubcategoryId(subcategoryId: number): Promise<Detail> {
    const subcategory = await this.categoryRepository.manager.findOne(Subcategory, {
      where: { id: subcategoryId },
      relations: ['detail'],
    });

    if (!subcategory || !subcategory.detail) {
      throw new HttpException('Detail not found for the given subcategory ID', HttpStatus.NOT_FOUND);
    }

    return subcategory.detail;
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

  // Удаление подкатегории по ID
  async deleteSubcategoryById(subcategoryId: number): Promise<string> {
    const subcategory = await this.categoryRepository.manager.findOne(Subcategory, { where: { id: subcategoryId } });

    if (!subcategory) {
      throw new HttpException('Subcategory not found', HttpStatus.NOT_FOUND);
    }

    await this.categoryRepository.manager.remove(subcategory);
    return `Subcategory with ID ${subcategoryId} has been deleted`;
  }

  // Удаление детали по ID подкатегории
  async deleteDetailBySubcategoryId(subcategoryId: number): Promise<string> {
    const subcategory = await this.categoryRepository.manager.findOne(Subcategory, {
      where: { id: subcategoryId },
      relations: ['detail'],
    });

    if (!subcategory || !subcategory.detail) {
      throw new HttpException('Detail not found', HttpStatus.NOT_FOUND);
    }

    await this.categoryRepository.manager.remove(subcategory.detail);
    return `Detail for subcategory ID ${subcategoryId} has been deleted`;
  }
}
