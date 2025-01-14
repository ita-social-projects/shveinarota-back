import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from '../entities/subcategory.entity';
import { Category } from '../entities/category.entity';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update-dto/update-subcategory.dto';
import { Detail } from '../entities/detail.entity';

@Injectable()
export class SubcategoriesService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Detail)
    private readonly detailRepository: Repository<Detail>,
  ) {}

  // Создание подкатегории с деталью
  async createSubcategoryWithDetail(
    categoryId: number,
    createSubcategoryDto: CreateSubcategoryDto,
  ): Promise<Subcategory> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['subcategories'],
    });
  
    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }
  
    // Создаем подкатегорию и связываем ее с категорией
    const subcategory = this.subcategoryRepository.create({
      categoryname: createSubcategoryDto.category_name,
      category, // Устанавливаем связь с категорией
    });
  
    if (createSubcategoryDto.detail) {
      // Создаем деталь и связываем с подкатегорией
      const detail = this.detailRepository.create({
        ...createSubcategoryDto.detail,
      });
      await this.detailRepository.save(detail); // Сохраняем деталь отдельно
  
      subcategory.detail = detail; // Связываем деталь с подкатегорией
    }
  
    return this.subcategoryRepository.save(subcategory);
  }
  

  // Обновление подкатегории
  async updateSubcategory(
    subcategoryId: number,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<Subcategory> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id: subcategoryId },
    });

    if (!subcategory) {
      throw new HttpException('Subcategory not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(subcategory, updateSubcategoryDto);
    return this.subcategoryRepository.save(subcategory);
  }

  // Удаление подкатегории
  async deleteSubcategoryById(subcategoryId: number): Promise<string> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id: subcategoryId },
    });

    if (!subcategory) {
      throw new HttpException('Subcategory not found', HttpStatus.NOT_FOUND);
    }

    await this.subcategoryRepository.remove(subcategory);
    return `Subcategory with ID ${subcategoryId} has been deleted`;
  }

  
}
