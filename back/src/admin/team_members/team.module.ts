import { Module } from '@nestjs/common';
import { TeamsController } from './team.controller';
import { TeamsService } from './team.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team])], 
  controllers: [TeamsController],
  providers: [TeamsService],
  exports: [TeamsService], 
})
export class TeamModule {}