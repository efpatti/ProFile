import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { LoggerService } from '../common/logger/logger.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { APP_CONSTANTS, ERROR_MESSAGES } from '../common/constants/app.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly logger: LoggerService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password, name } = signupDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      this.logger.warn(`Signup attempt for existing email`, 'AuthService', { email });
      throw new ConflictException(ERROR_MESSAGES.EMAIL_ALREADY_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, APP_CONSTANTS.BCRYPT_ROUNDS);

    const user = await this.prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        password: hashedPassword,
        hasCompletedOnboarding: false,
      },
    });

    this.logger.log(`User registered successfully`, 'AuthService', { userId: user.id, email });

    const token = this.generateToken({
      id: user.id,
      email: user.email!,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
      },
      token,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      this.logger.warn(`Failed login attempt - user not found`, 'AuthService', { email });
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`Failed login attempt - invalid password`, 'AuthService', { email });
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException(ERROR_MESSAGES.INVALID_CREDENTIALS);
    }

    const token = this.generateToken(user);

    this.logger.log(`User logged in successfully`, 'AuthService', {
      userId: user.id,
      email: user.email,
    });

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
      },
      token,
    };
  }

  async refreshToken(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        hasCompletedOnboarding: true,
      },
    });

    if (!user) {
      this.logger.warn(`Token refresh failed - user not found`, 'AuthService', { userId });
      throw new UnauthorizedException(ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const token = this.generateToken({
      id: user.id,
      email: user.email!,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
    });

    this.logger.debug(`Token refreshed`, 'AuthService', { userId });

    return {
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        hasCompletedOnboarding: user.hasCompletedOnboarding,
      },
    };
  }

  private generateToken(user: {
    id: string;
    email: string;
    hasCompletedOnboarding?: boolean;
  }): string {
    const payload = {
      sub: user.id,
      email: user.email,
      hasCompletedOnboarding: user.hasCompletedOnboarding ?? false,
    };

    return this.jwtService.sign(payload);
  }
}
