import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateFullPreferencesDto } from './dto/update-full-preferences.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.getProfile(req.user.userId);
  }

  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.userId, updateProfileDto);
  }

  @Get('preferences')
  async getPreferences(@Request() req) {
    return this.usersService.getPreferences(req.user.userId);
  }

  @Patch('preferences')
  @HttpCode(HttpStatus.OK)
  async updatePreferences(
    @Request() req,
    @Body() updatePreferencesDto: UpdatePreferencesDto,
  ) {
    return this.usersService.updatePreferences(
      req.user.userId,
      updatePreferencesDto,
    );
  }

  @Get('preferences/full')
  async getFullPreferences(@Request() req) {
    return this.usersService.getFullPreferences(req.user.userId);
  }

  @Patch('preferences/full')
  @HttpCode(HttpStatus.OK)
  async updateFullPreferences(
    @Request() req,
    @Body() updateFullPreferencesDto: UpdateFullPreferencesDto,
  ) {
    return this.usersService.updateFullPreferences(
      req.user.userId,
      updateFullPreferencesDto,
    );
  }
}
