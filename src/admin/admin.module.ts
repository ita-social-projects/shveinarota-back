import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminResolver } from './admin.resolver';
import { Card } from './entities/admin.entity';
import { UploadController } from './upload.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Card])],
  providers: [AdminService, AdminResolver],
  controllers: [UploadController],
})
export class AdminModule {}
