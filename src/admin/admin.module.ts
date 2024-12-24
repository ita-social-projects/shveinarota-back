import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { Card } from './entities/admin.entity';
import { UploadController } from './upload.controller';
import { ApiController } from './api.controller'; // Новый контроллер

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  providers: [AdminService, AdminResolver],
  controllers: [UploadController, ApiController], // Добавляем оба контроллера
})
export class AdminModule {}
