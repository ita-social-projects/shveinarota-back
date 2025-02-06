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

  // Отримання підкатегорії українською мовою за ID
  async getUkSubcategoryById(subcategoryId: number): Promise<any> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id: subcategoryId },
      select: {
        id: true,
        subcategory: true,
        details: true,
        summary: true,
        url: true,
        categoryname: true,
        lekala: true,
        authors: true,
        example: true,
      },
    });

    if (!subcategory) {
      throw new NotFoundException(`Підкатегорія з ID ${subcategoryId} не знайдена.`);
    }

    return { ...subcategory, lekala: this.formatLekala(subcategory.lekala, 'uk') };
  }

  // Отримання підкатегорії англійською мовою за ID
  async getEnSubcategoryById(subcategoryId: number): Promise<any> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id: subcategoryId },
      select: {
        id: true,
        subcategory_en: true,
        details_en: true,
        summary_en: true,
        url: true,
        categoryname_en: true,
        lekala: true,
        authors_en: true,
        example: true,
      },
    });

    if (!subcategory) {
      throw new NotFoundException(`Subcategory with ID ${subcategoryId} not found.`);
    }

    return { ...subcategory, lekala: this.formatLekala(subcategory.lekala, 'en') };
  }

    // Отримання всіх значень підкатегорії за ID
    async getAllById(subcategoryId: number): Promise<Subcategory> {
      const subcategory = await this.subcategoryRepository.findOne({ where: { id: subcategoryId } });
      if (!subcategory) {
        throw new NotFoundException(`Підкатегорія з ID ${subcategoryId} не знайдена`);
      }
      return subcategory;
    }
    


  // Отримання підкатегорії за ID
  async getSubcategoryById(subcategoryId: number): Promise<Subcategory> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id: subcategoryId },
      relations: ['category'],
    });
    if (!subcategory) {
      throw new NotFoundException(`Підкатегорія з ID ${subcategoryId} не знайдена.`);
    }
    return subcategory;
  }

  // Створення нової підкатегорії
  async create(categoryId: number, dto: CreateSubcategoryDto): Promise<Subcategory> {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException(`Категорія з ID ${categoryId} не знайдена.`);
    }

    try {
      const subcategory = this.subcategoryRepository.create({
        subcategory: dto.subcategory,
        subcategory_en: dto.subcategory_en,
        url: dto.url,
        details: dto.details,
        details_en: dto.details_en,
        summary: dto.summary,
        summary_en: dto.summary_en,
        categoryname: dto.categoryname,
        categoryname_en: dto.categoryname_en,
        lekala: dto.lekala || [],
        authors: dto.authors || [],
        authors_en: dto.authors_en || [],
        example: dto.example || [],
        category,
      });

      return await this.subcategoryRepository.save(subcategory);
    } catch (error) {
      console.error('Помилка при створенні підкатегорії:', error);
      throw new BadRequestException('Не вдалося створити підкатегорію.');
    }
  }

  // Оновлення підкатегорії
  async update(subcategoryId: number, dto: UpdateSubcategoryDto): Promise<Subcategory> {
    const subcategory = await this.subcategoryRepository.findOne({ where: { id: subcategoryId } });
  
    if (!subcategory) {
      throw new NotFoundException(`Підкатегорія з ID ${subcategoryId} не знайдена.`);
    }
  
    // Фільтруємо `undefined`, залишаючи тільки `null` або значення
    const updatedData = Object.entries(dto).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = value;
      return acc;
    }, {});
  
    // Якщо нічого не оновлюється – кидаємо помилку
    if (Object.keys(updatedData).length === 0) {
      throw new BadRequestException('Не передано жодного значення для оновлення.');
    }
  
    // Використовуємо update, але тільки якщо є дані для оновлення
    await this.subcategoryRepository.update(subcategoryId, updatedData);
  
    return this.subcategoryRepository.findOne({ where: { id: subcategoryId } });
  }
  
  
  // Видалення підкатегорії
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

  // Форматування об'єкта лекала для відображення у відповідній мові
  private formatLekala(lekala: any[], lang: 'uk' | 'en') {
    if (!lekala || lekala.length === 0) return [];
    return lekala.map(item => ({ path: item.path, text: lang === 'uk' ? item.text : item.text_en }));
  }
}
