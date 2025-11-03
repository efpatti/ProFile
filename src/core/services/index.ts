/**
 * Services Index - Centralized exports
 * Uncle Bob: Clean exports and organization
 */

// Browser Management
export { browserManager, closeBrowser } from "./BrowserManager";

// Specialized Services (Recommended)
export { BannerCaptureService } from "./BannerCaptureService";
export { ResumePDFService } from "./ResumePDFService";

// Legacy Facade (Backward compatibility)
export { PuppeteerService } from "./PuppeteerService";

// Other services
export { BannerService } from "./BannerService";
