import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Detail } from '../entities/detail.entity';
import { Subcategory } from '../entities/subcategory.entity';
import { UpdateDetailDto } from '../dto/update-dto/update-detail.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DetailsService {
  constructor(
    @InjectRepository(Detail)
    private readonly detailRepository: Repository<Detail>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  async updateDetail(
    categoryId: number,
    subcategoryId: number,
    detailId: number,
    updateDetailDto: UpdateDetailDto,
  ): Promise<Detail> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id: subcategoryId },
      relations: ['detail'],
    });

    if (!subcategory || !subcategory.detail) {
      throw new HttpException('Detail not found', HttpStatus.NOT_FOUND);
    }

    const currentDetail = subcategory.detail;

    // Удаление старых файлов и замена на новые для lekala
    if (updateDetailDto.lekala) {
      this.removeOldFiles(currentDetail.lekala); // Удаляем старые файлы
      currentDetail.lekala = updateDetailDto.lekala; // Сохраняем новые пути
    }

    // Удаление старых файлов и замена на новые для example
    if (updateDetailDto.example) {
      this.removeOldFiles(currentDetail.example); // Удаляем старые файлы
      currentDetail.example = updateDetailDto.example; // Сохраняем новые пути
    }

    // Обновление остальных полей детали
    Object.assign(currentDetail, {
      title: updateDetailDto.title,
      details: updateDetailDto.details,
      summary: updateDetailDto.summary,
      videoUrl: updateDetailDto.videoUrl,
      authors: updateDetailDto.authors,
      category: updateDetailDto.category,
    });

    return this.detailRepository.save(currentDetail);
  }

  // Метод для удаления файлов
  private removeOldFiles(filePaths: string[]) {
    filePaths.forEach((filePath) => {
      if (filePath) {
        const fullPath = path.resolve(filePath);
        fs.unlink(fullPath, (err) => {
          if (err) {
            console.error(`Failed to delete file: ${fullPath}`, err);
          } else {
            console.log(`Successfully deleted file: ${fullPath}`);
          }
        });
      }
    });
  }
}
