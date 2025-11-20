import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const { email, password, name } = signupDto;

    this.logger.log(`[SIGNUP] Received request for: ${email}`);

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      this.logger.warn(`[SIGNUP] User already exists: ${email}`);
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    this.logger.log('[SIGNUP] Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    this.logger.log(`[SIGNUP] Creating user: ${email}`);
    const user = await this.prisma.user.create({
      data: {
        email,
        name: name || email.split('@')[0],
        password: hashedPassword,
        hasCompletedOnboarding: false,
      },
    });

    this.logger.log(`[SIGNUP] User created successfully: ${user.id}`);

    // Generate JWT token
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
    this.logger.log(`[VALIDATE] Validating user: ${email}`);

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      this.logger.warn(`[VALIDATE] User not found or no password: ${email}`);
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      this.logger.warn(`[VALIDATE] Invalid password for: ${email}`);
      return null;
    }

    this.logger.log(`[VALIDATE] User validated successfully: ${email}`);
    const { password: _, ...result } = user;
    return result;
  }

  async login(loginDto: LoginDto) {
    this.logger.log(`[LOGIN] Login attempt for: ${loginDto.email}`);

    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.generateToken(user);

    this.logger.log(`[LOGIN] Login successful for: ${user.email}`);

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
    this.logger.log(`[REFRESH] Refreshing token for user: ${userId}`);

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
      throw new UnauthorizedException('User not found');
    }

    const token = this.generateToken({
      id: user.id,
      email: user.email!,
      hasCompletedOnboarding: user.hasCompletedOnboarding,
    });

    this.logger.log(`[REFRESH] Token refreshed for: ${user.email}`);

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
