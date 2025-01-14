import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from '../entities/subcategory.entity';
import { Category } from '../entities/category.entity';
import { Detail } from '../entities/detail.entity';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update-dto/update-subcategory.dto'; // Импортируем DTO для обновления

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

  // Метод для создания подкатегории с деталью
  async createSubcategoryWithDetail(
    categoryId: number,
    createSubcategoryDto: CreateSubcategoryDto,
  ): Promise<Subcategory> {
    // Поиск категории
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['subcategories'],
    });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    // Создание подкатегории
    const subcategory = this.subcategoryRepository.create({
      subcategory_name: createSubcategoryDto.subcategory_name,
      category,
    });

    if (createSubcategoryDto.detail) {
      // Проверка обязательного поля title
      if (!createSubcategoryDto.detail.title) {
        throw new HttpException(
          "Field 'title' is required in detail",
          HttpStatus.BAD_REQUEST,
        );
      }

      console.log('Detail DTO:', createSubcategoryDto.detail); // Логирование DTO
      const detail = this.detailRepository.create(createSubcategoryDto.detail);
      console.log('Saving detail:', detail); // Логирование перед сохранением
      await this.detailRepository.save(detail);

      subcategory.detail = detail; // Связываем деталь с подкатегорией
    }

    // Сохраняем подкатегорию
    await this.subcategoryRepository.save(subcategory);

    return subcategory;
  }

  // Метод для обновления подкатегории, поддерживающий только subcategory_name
  async updateSubcategory(
    subcategoryId: number,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<Subcategory> {
    // Находим подкатегорию по ID
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id: subcategoryId },
      relations: ['category', 'detail'], // При необходимости подгружаем связанные сущности
    });

    if (!subcategory) {
      throw new HttpException('Subcategory not found', HttpStatus.NOT_FOUND);
    }

    // Логируем данные, передаваемые в запрос
    console.log('Update data:', updateSubcategoryDto);

    // Если передано новое название подкатегории, обновляем его
    if (updateSubcategoryDto.subcategory_name) {
      subcategory.subcategory_name = updateSubcategoryDto.subcategory_name;
    }

    console.log('Subcategory after update:', subcategory); // Логируем подкатегорию перед сохранением

    // Сохраняем изменения
    return this.subcategoryRepository.save(subcategory);
  }

  // Метод для удаления подкатегории
  async deleteSubcategoryById(subcategoryId: number): Promise<string> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id: subcategoryId },
      relations: ['detail'],
    });

    if (!subcategory) {
      throw new HttpException('Subcategory not found', HttpStatus.NOT_FOUND);
    }

    await this.subcategoryRepository.remove(subcategory);
    return `Subcategory with ID ${subcategoryId} has been deleted`;
  }
}
