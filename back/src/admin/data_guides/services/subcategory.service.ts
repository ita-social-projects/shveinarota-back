import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from '../entities/subcategory.entity';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update_dto/update-subcategory.dto';
import { Category } from '../entities/category.entity';

@Injectable()
export class SubcategoryService {
  constructor(
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateSubcategoryDto): Promise<Subcategory> {
    const category = await this.categoryRepository.findOne({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new BadRequestException(`Категорія з ID ${dto.categoryId} не існує.`);
    }

    try {
      const subcategory = this.subcategoryRepository.create({
        ...dto,
        category,
      });

      return await this.subcategoryRepository.save(subcategory);
    } catch (error) {
      console.error('Помилка при збереженні підкатегорії:', error);
      throw new BadRequestException('Не вдалося створити підкатегорію.');
    }
  }

  async getSubcategoriesByCategoryId(categoryId: number): Promise<Subcategory[]> {
    try {
      const subcategories = await this.subcategoryRepository.find({
        where: { category: { id: categoryId } },
        relations: ['category'], // Подгружаем связанную категорию
      });
  
      return subcategories;
    } catch (error) {
      console.error('Помилка при отриманні підкатегорій:', error);
      throw new BadRequestException('Не вдалося отримати підкатегорії.');
    }
  }
  

  async update(subcategoryId: number, dto: UpdateSubcategoryDto): Promise<Subcategory> {
    const subcategory = await this.subcategoryRepository.findOne({ where: { id: subcategoryId } });

    if (!subcategory) {
      throw new NotFoundException(`Підкатегорія з ID ${subcategoryId} не знайдена.`);
    }

    if (dto.categoryId) {
      const category = await this.categoryRepository.findOne({ where: { id: dto.categoryId } });
      if (!category) {
        throw new BadRequestException(`Категорія з ID ${dto.categoryId} не існує.`);
      }
      subcategory.category = category;
    }

    try {
      Object.assign(subcategory, dto);
      return await this.subcategoryRepository.save(subcategory);
    } catch (error) {
      console.error('Помилка при оновленні підкатегорії:', error);
      throw new BadRequestException('Не вдалося оновити підкатегорію.');
    }
  }

  async delete(subcategoryId: number): Promise<void> {
    const subcategory = await this.subcategoryRepository.findOne({ where: { id: subcategoryId } });
  
    if (!subcategory) {
      throw new NotFoundException(`Підкатегорія з ID ${subcategoryId} не знайдена.`);
    }
  
    try {
      await this.subcategoryRepository.remove(subcategory);
    } catch (error) {
      console.error('Помилка при видаленні підкатегорії:', error);
      throw new BadRequestException('Не вдалося видалити підкатегорію.');
    }
  }
}
