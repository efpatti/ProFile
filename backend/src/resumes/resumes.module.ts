import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { ResumesRepository } from './resumes.repository';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ResumesController],
  providers: [ResumesService, ResumesRepository],
  exports: [ResumesService, ResumesRepository],
})
export class ResumesModule {}
