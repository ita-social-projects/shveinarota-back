import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Subcategory } from '../entities/subcategory.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(newCategory);
  }

  async getAllCategories(): Promise<any[]> {
    const categories = await this.categoryRepository.find({
      relations: ['subcategories'],
    });

    return categories.map((category) => ({
      id: category.id,
      categoryname: category.categoryname,
      subcategories: category.subcategories.map((subcategory) => ({
        id: subcategory.id,
        subcategory_name: subcategory.subcategory_name,
      })),
    }));
  }

  async updateCategory(
    categoryId: number,
    updateData: UpdateCategoryDto,
    file?: Express.Multer.File,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    console.log('Before Update:', category);
    console.log('Received update data:', updateData);

    // Проверяем, что хотя бы одно поле изменилось
    let updated = false;
    if (updateData.categoryname && updateData.categoryname !== category.categoryname) {
      category.categoryname = updateData.categoryname;
      updated = true;
    }

    // Дополнительная логика с файлом (если требуется)
    if (file) {
      console.log('File uploaded:', file);
    }

    if (!updated) {
      throw new HttpException('No changes to update', HttpStatus.BAD_REQUEST);
    }

    const updatedCategory = await this.categoryRepository.save(category);

    console.log('After Update:', updatedCategory);

    return updatedCategory;
  }

  async deleteCategoryById(categoryId: number): Promise<string> {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });

    if (!category) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    await this.categoryRepository.remove(category);
    return `Category with ID ${categoryId} has been deleted`;
  }

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
