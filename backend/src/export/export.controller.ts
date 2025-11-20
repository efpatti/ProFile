import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  StreamableFile,
  Header,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BannerCaptureService } from './services/banner-capture.service';
import { ResumePDFService } from './services/resume-pdf.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('export')
export class ExportController {
  constructor(
    private readonly bannerCaptureService: BannerCaptureService,
    private readonly resumePDFService: ResumePDFService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('banner')
  @Header('Content-Type', 'image/png')
  @Header('Content-Disposition', 'attachment; filename="linkedin-banner.png"')
  async exportBanner(
    @Query('palette') palette?: string,
    @Query('logo') logoUrl?: string,
  ): Promise<StreamableFile> {
    try {
      const buffer = await this.bannerCaptureService.capture(palette, logoUrl);
      return new StreamableFile(buffer);
    } catch (error) {
      throw new BadRequestException('Failed to generate banner');
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('resume/pdf')
  @Header('Content-Type', 'application/pdf')
  @Header('Content-Disposition', 'attachment; filename="resume.pdf"')
  async exportResumePDF(
    @Request() req,
    @Query('palette') palette?: string,
    @Query('lang') lang?: string,
    @Query('bannerColor') bannerColor?: string,
  ): Promise<StreamableFile> {
    try {
      const buffer = await this.resumePDFService.generate({
        palette,
        lang,
        bannerColor,
        userId: req.user.userId,
      });
      return new StreamableFile(buffer);
    } catch (error) {
      throw new BadRequestException('Failed to generate PDF');
    }
  }

  @Public()
  @Get('resume/docx')
  @Header('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
  @Header('Content-Disposition', 'attachment; filename="resume.docx"')
  async exportResumeDOCX(@Request() req): Promise<StreamableFile> {
    // TODO: Implement DOCX export when needed
    throw new BadRequestException('DOCX export not yet implemented');
  }
}
