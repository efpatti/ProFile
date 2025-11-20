import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('onboarding')
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private readonly onboardingService: OnboardingService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async completeOnboarding(@Request() req, @Body() data: any) {
    return this.onboardingService.completeOnboarding(req.user.userId, data);
  }

  @Get('status')
  async getStatus(@Request() req) {
    return this.onboardingService.getOnboardingStatus(req.user.userId);
  }
}
