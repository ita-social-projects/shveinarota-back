import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subcategory } from '../entities/subcategory.entity';
import { Category } from '../entities/category.entity';
import { Detail } from '../entities/detail.entity';
import { CreateSubcategoryDto } from '../dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from '../dto/update-dto/update-subcategory.dto';

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

  async updateSubcategory(
    subcategoryId: number,
    updateSubcategoryDto: UpdateSubcategoryDto,
  ): Promise<Subcategory> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id: subcategoryId },
      relations: ['detail'],
    });

    if (!subcategory) {
      throw new HttpException('Subcategory not found', HttpStatus.NOT_FOUND);
    }

    if (updateSubcategoryDto.detail) {
      if (subcategory.detail) {
        // Обновление существующей детали
        const detail = await this.detailRepository.findOne({
          where: { id: subcategory.detail.id },
        });
        if (detail) {
          Object.assign(detail, updateSubcategoryDto.detail);
          console.log('Updating detail:', detail); // Логирование
          await this.detailRepository.save(detail);
        }
      } else {
        // Создание новой детали, если ее не было
        if (!updateSubcategoryDto.detail.title) {
          throw new HttpException(
            "Field 'title' is required in detail",
            HttpStatus.BAD_REQUEST,
          );
        }
        const detail = this.detailRepository.create(updateSubcategoryDto.detail);
        console.log('Creating new detail:', detail); // Логирование
        await this.detailRepository.save(detail);
        subcategory.detail = detail;
      }
    }

    Object.assign(subcategory, updateSubcategoryDto);
    return this.subcategoryRepository.save(subcategory);
  }

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
