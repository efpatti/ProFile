import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdatePreferencesDto } from './dto/update-preferences.dto';
import { UpdateFullPreferencesDto } from './dto/update-full-preferences.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly usersRepository: UsersRepository) {}

  async getProfile(userId: string) {
    this.logger.log(`Getting profile for user: ${userId}`);
    const profile = await this.usersRepository.getUserProfile(userId);

    if (!profile) {
      throw new NotFoundException('User not found');
    }

    return profile;
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    this.logger.log(`Updating profile for user: ${userId}`);

    const user = await this.usersRepository.getUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.usersRepository.updateUserProfile(
      userId,
      updateProfileDto,
    );

    return {
      success: true,
      user: {
        displayName: updatedUser.displayName,
        photoURL: updatedUser.photoURL,
        bio: updatedUser.bio,
        location: updatedUser.location,
        phone: updatedUser.phone,
        website: updatedUser.website,
        linkedin: updatedUser.linkedin,
        github: updatedUser.github,
      },
    };
  }

  async getPreferences(userId: string) {
    this.logger.log(`Getting preferences for user: ${userId}`);
    const preferences = await this.usersRepository.getUserPreferences(userId);

    if (!preferences) {
      throw new NotFoundException('User not found');
    }

    return preferences;
  }

  async updatePreferences(
    userId: string,
    updatePreferencesDto: UpdatePreferencesDto,
  ) {
    this.logger.log(`Updating preferences for user: ${userId}`);

    const user = await this.usersRepository.getUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.updateUserPreferences(
      userId,
      updatePreferencesDto,
    );

    return {
      success: true,
      message: 'Preferences updated successfully',
    };
  }

  async getFullPreferences(userId: string) {
    this.logger.log(`Getting full preferences for user: ${userId}`);
    const preferences =
      await this.usersRepository.getFullUserPreferences(userId);

    return preferences || {};
  }

  async updateFullPreferences(
    userId: string,
    updateFullPreferencesDto: UpdateFullPreferencesDto,
  ) {
    this.logger.log(`Updating full preferences for user: ${userId}`);

    const user = await this.usersRepository.getUser(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const preferences = await this.usersRepository.upsertFullUserPreferences(
      userId,
      updateFullPreferencesDto,
    );

    return {
      success: true,
      preferences,
    };
  }
}
