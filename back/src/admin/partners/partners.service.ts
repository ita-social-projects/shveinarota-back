import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Partner } from './entities/partners.entity';
import { BadRequestException } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PartnersService {
  constructor(
    @InjectRepository(Partner)
    private readonly PartnerRepository: Repository<Partner>,
  ) {}

  async getAllPartners(): Promise<Partner[]> {
    return this.PartnerRepository.find({ cache: false });
  }

  async createPartner(createPartnerDto: CreatePartnerDto): Promise<Partner> {
    const newPartner = this.PartnerRepository.create(createPartnerDto);
    return this.PartnerRepository.save(newPartner);
  }

  async getPartnerById(id: number): Promise<Partner> {
    const Partner = await this.PartnerRepository.findOneBy({ id });
    if (!Partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }
    return Partner;
  }

  async updatePartner(
    id: number,
    updatePartnerDto: UpdatePartnerDto,
  ): Promise<Partner> {
    const Partner = await this.PartnerRepository.findOneBy({ id });
    if (!Partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    // Удаляем старый файл изображения, если загружено новое
    if (updatePartnerDto.path && Partner.path !== updatePartnerDto.path) {
      const oldFilePath = path.resolve(Partner.path);
      try {
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      } catch (err) {
        console.error(`Ошибка при удалении файла: ${oldFilePath}`, err);
      }
    }

    // Обновляем данные карточки
    Object.assign(Partner, updatePartnerDto);
    return this.PartnerRepository.save(Partner);
  }

  async deletePartner(id: number): Promise<void> {
    const Partner = await this.PartnerRepository.findOneBy({ id });
    if (!Partner) {
      throw new NotFoundException(`Partner with ID ${id} not found`);
    }

    // Удаляем файл изображения с диска
    if (Partner.path) {
      const filePath = path.resolve(Partner.path);
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (err) {
        console.error(`Ошибка при удалении файла: ${filePath}`, err);
      }
    }

    // Удаляем запись о карточке из базы данных
    await this.PartnerRepository.remove(Partner);
  }

  async reorder(ids: number[]): Promise<{ id: number; position: number }[]> {
    const partners = await this.PartnerRepository.findByIds(ids);

    if (partners.length !== ids.length) {
      throw new BadRequestException('Некоторые ID не найдены');
    }

    const updatePromises = ids.map((id, index) =>
      this.PartnerRepository.update(id, { position: index + 1 }),
    );
    await Promise.all(updatePromises);

    const updated = await this.PartnerRepository.findByIds(ids);

    return updated
      .map(({ id, position }) => ({ id, position }))
      .sort((a, b) => a.position - b.position);
  }
}
