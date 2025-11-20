import { Module } from '@nestjs/common';
import { ExportController } from './export.controller';
import { BannerCaptureService } from './services/banner-capture.service';
import { ResumePDFService } from './services/resume-pdf.service';
import { BrowserManagerService } from './services/browser-manager.service';

@Module({
  controllers: [ExportController],
  providers: [
    BannerCaptureService,
    ResumePDFService,
    BrowserManagerService,
  ],
  exports: [BannerCaptureService, ResumePDFService, BrowserManagerService],
})
export class ExportModule {}
