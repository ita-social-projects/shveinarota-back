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

  // Метод для создания подкатегории с привязкой к категории
  async create(categoryId: number, dto: CreateSubcategoryDto): Promise<Subcategory> {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });

    if (!category) {
      throw new NotFoundException(`Категорія з ID ${categoryId} не знайдена.`);
    }

    try {
      const subcategory = this.subcategoryRepository.create({
        ...dto,
        category, // Привязываем подкатегорию к категории
      });

      return await this.subcategoryRepository.save(subcategory);
    } catch (error) {
      console.error('Помилка при збереженні підкатегорії:', error);
      throw new BadRequestException('Не вдалося створити підкатегорію.');
    }
  }

  // Метод для получения всех подкатегорий по категории
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

  // Метод для обновления подкатегории
  async update(subcategoryId: number, dto: UpdateSubcategoryDto): Promise<Subcategory> {
    const subcategory = await this.subcategoryRepository.findOne({ where: { id: subcategoryId } });

    if (!subcategory) {
      throw new NotFoundException(`Підкатегорія з ID ${subcategoryId} не знайдена.`);
    }

    // Обновляем только те поля, которые были переданы в запросе
    subcategory.subcategory = dto.subcategory ?? subcategory.subcategory;
    subcategory.url = dto.url ?? subcategory.url;
    subcategory.details = dto.details ?? subcategory.details;
    subcategory.summary = dto.summary ?? subcategory.summary;
    subcategory.categoryname = dto.categoryname ?? subcategory.categoryname;
    subcategory.lekala = dto.lekala && dto.lekala.length > 0 ? dto.lekala : subcategory.lekala;
    subcategory.authors = dto.authors && dto.authors.length > 0 ? dto.authors : subcategory.authors;
    subcategory.example = dto.example && dto.example.length > 0 ? dto.example : subcategory.example;

    try {
      return await this.subcategoryRepository.save(subcategory);
    } catch (error) {
      console.error('Помилка при оновленні підкатегорії:', error);
      throw new BadRequestException('Не вдалося оновити підкатегорію.');
    }
  }

  // Метод для удаления подкатегории
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
