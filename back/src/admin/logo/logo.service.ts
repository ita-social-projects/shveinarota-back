import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logo } from './entities/logo.entity';
import { CreateLogoDto } from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LogoService {
  constructor(
    @InjectRepository(Logo)
    private readonly logoRepository: Repository<Logo>,
  ) {}

  async getAllLogos(): Promise<Logo[]> {
    return this.logoRepository.find({ cache: false });
  }

  async createLogo(createLogoDto: CreateLogoDto): Promise<Logo> {
    const newLogo = this.logoRepository.create(createLogoDto);
    return this.logoRepository.save(newLogo);
  }

  async getLogoById(id: number): Promise<Logo> {
    const logo = await this.logoRepository.findOneBy({ id });
    if (!logo) {
      throw new NotFoundException(`Logo with ID ${id} not found`);
    }
    return logo;
  }

  async updateLogo(id: number, updateLogoDto: UpdateLogoDto): Promise<Logo> {
    const logo = await this.logoRepository.findOneBy({ id });
    if (!logo) {
      throw new NotFoundException(`Logo with ID ${id} not found`);
    }

    // Удаляем старые файлы, если загружены новые
    if (updateLogoDto.path1 && logo.path1 !== updateLogoDto.path1) {
      this.deleteFile(logo.path1);
    }
    if (updateLogoDto.path2 && logo.path2 !== updateLogoDto.path2) {
      this.deleteFile(logo.path2);
    }

    Object.assign(logo, updateLogoDto);
    return this.logoRepository.save(logo);
  }

  async deleteLogo(id: number): Promise<void> {
    const logo = await this.logoRepository.findOneBy({ id });
    if (!logo) {
      throw new NotFoundException(`Logo with ID ${id} not found`);
    }

    await this.logoRepository.remove(logo);
  }

  private deleteFile(filePath: string | null) {
    if (filePath) {
      const absolutePath = path.resolve(filePath);
      try {
        if (fs.existsSync(absolutePath)) {
          fs.unlinkSync(absolutePath);
        }
      } catch (err) {
        console.error(`Ошибка при удалении файла: ${absolutePath}`, err);
      }
    }
  }
}
