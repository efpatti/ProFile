import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { onboardingDataSchema, OnboardingData } from './schemas/onboarding.schema';
import { ResumeOnboardingService } from './services/resume-onboarding.service';
import { SkillsOnboardingService } from './services/skills-onboarding.service';
import { ExperienceOnboardingService } from './services/experience-onboarding.service';
import { EducationOnboardingService } from './services/education-onboarding.service';
import { LanguagesOnboardingService } from './services/languages-onboarding.service';

@Injectable()
export class OnboardingService {
  private readonly logger = new Logger(OnboardingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly resumeService: ResumeOnboardingService,
    private readonly skillsService: SkillsOnboardingService,
    private readonly experienceService: ExperienceOnboardingService,
    private readonly educationService: EducationOnboardingService,
    private readonly languagesService: LanguagesOnboardingService,
  ) {}

  async completeOnboarding(userId: string, data: any) {
    this.logger.log('Onboarding started');

    const validatedData = onboardingDataSchema.parse(data) as OnboardingData;

    const user = await this.findUser(userId);
    const resume = await this.resumeService.upsertResume(userId, validatedData);

    await Promise.all([
      this.skillsService.saveSkills(resume.id, validatedData),
      this.experienceService.saveExperiences(resume.id, validatedData),
      this.educationService.saveEducation(resume.id, validatedData),
      this.languagesService.saveLanguages(resume.id, validatedData),
    ]);

    await this.markOnboardingComplete(user.id, validatedData);

    this.logger.log('Onboarding completed');

    return {
      success: true,
      resumeId: resume.id,
      message: 'Onboarding concluído com sucesso!',
    };
  }

  private async findUser(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  private async markOnboardingComplete(userId: string, data: OnboardingData) {
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        hasCompletedOnboarding: true,
        onboardingCompletedAt: new Date(),
        palette: data.templateSelection.palette,
      },
    });
  }

  async getOnboardingStatus(userId: string) {
    this.logger.log(`[ONBOARDING] Getting status for user: ${userId}`);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        hasCompletedOnboarding: true,
        onboardingCompletedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      hasCompletedOnboarding: user.hasCompletedOnboarding,
      onboardingCompletedAt: user.onboardingCompletedAt,
    };
  }
}
