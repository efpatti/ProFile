/**
 * Core Interfaces - Dependency Inversion Principle (SOLID)
 * Abstrações que permitem dependency injection e testabilidade
 */

// Repository Interfaces
export type { IResumeRepository } from "./IResumeRepository";

// Service Interfaces
export type { IExportService } from "./IExportService";
export type {
 IBannerService,
 DeveloperLike,
 FormatterLike,
 BannerUrlOptions,
} from "./IBannerService";
export type { IPuppeteerService, PaletteInfo } from "./IPuppeteerService";
