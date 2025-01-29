import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update_dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<Category> {
    if (!dto || !dto.category?.trim()) {
      throw new BadRequestException('Поле "category" є обов’язковим для заповнення.');
    }

    try {
      const category = this.categoryRepository.create({
        ...dto,
        subcategories: [],
      });

      return await this.categoryRepository.save(category);
    } catch (error) {
      console.error('Помилка при збереженні категорії:', error);

      if (error.code === '23505') {
        throw new BadRequestException(
          `Категорія з назвою "${dto.category}" вже існує.`,
        );
      }

      throw new BadRequestException('Не вдалося створити категорію.');
    }
  }

  async getAllStructure(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find({ 
        relations: ['subcategories'],
      });
    } catch (error) {
      console.error('Помилка при отриманні структури:', error);
      throw new BadRequestException('Не вдалося отримати структуру.');
    }
  }

  async getCategoriesOnly(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find({
        select: ['id', 'category'],
      });
    } catch (error) {
      console.error('Помилка при отриманні категорій:', error);
      throw new BadRequestException('Не вдалося отримати категорії.');
    }
  }

  async updateCategory(id: number, dto: UpdateCategoryDto): Promise<Category> {
    if (!dto || !dto.category?.trim()) {
      throw new BadRequestException('Поле "category" є обов’язковим для заповнення.');
    }

    try {
      const category = await this.categoryRepository.findOne({ where: { id } });

      if (!category) {
        throw new NotFoundException(`Категорія з ID ${id} не знайдена.`);
      }

      category.category = dto.category;

      return await this.categoryRepository.save(category);
    } catch (error) {
      console.error(`Помилка при оновленні категорії з ID ${id}:`, error);
      throw new BadRequestException('Не вдалося оновити категорію.');
    }
  }

  async deleteCategory(id: number): Promise<{ message: string }> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['subcategories'],
      });
  
      if (!category) {
        throw new NotFoundException(`Категорія з ID ${id} не знайдена.`);
      }
  
      if (category.subcategories.length > 0) {
        throw new BadRequestException(`Неможливо видалити категорію з ID ${id}, оскільки вона містить підкатегорії.`);
      }
  
      await this.categoryRepository.delete(id);
  
      return { message: `Категорія з ID ${id} успішно видалена.` };
    } catch (error) {
      console.error(`Помилка при видаленні категорії з ID ${id}:`, error);
      throw new BadRequestException('Не вдалося видалити категорію.');
    }
  }
}
