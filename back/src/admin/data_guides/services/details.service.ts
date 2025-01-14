import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Detail } from '../entities/detail.entity';
import { Subcategory } from '../entities/subcategory.entity';
import { UpdateDetailDto } from '../dto/update-dto/update-detail.dto';

@Injectable()
export class DetailsService {
  constructor(
    @InjectRepository(Detail)
    private readonly detailRepository: Repository<Detail>,
    @InjectRepository(Subcategory)
    private readonly subcategoryRepository: Repository<Subcategory>,
  ) {}

  // Обновление детали
  async updateDetail(
    subcategoryId: number,
    updateDetailDto: UpdateDetailDto,
  ): Promise<Detail> {
    const subcategory = await this.subcategoryRepository.findOne({
      where: { id: subcategoryId },
      relations: ['detail'],
    });

    if (!subcategory || !subcategory.detail) {
      throw new HttpException('Detail not found', HttpStatus.NOT_FOUND);
    }

    Object.assign(subcategory.detail, updateDetailDto);
    return this.detailRepository.save(subcategory.detail);
  }
}
