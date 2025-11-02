/**
 * UI Constants - Magic Numbers Extraction (Clean Code G25)
 * Centraliza valores hardcoded relacionados a UI
 */

// ==================== VIEWPORT ====================
export const VIEWPORT = {
 BANNER: {
  WIDTH: 1584,
  HEIGHT: 396,
  SCALE_FACTOR: 4,
 },
 RESUME: {
  WIDTH: 1123,
  HEIGHT: 1588,
  SCALE_FACTOR: 2,
 },
} as const;

// ==================== PDF ====================
export const PDF = {
 A3_WIDTH_MM: 297,
 PX_TO_MM_RATIO: 0.264583, // 96 CSS px per inch
 HEIGHT_BUFFER_MM: 2,
 MARGIN: {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
 },
} as const;

// ==================== TIMEOUTS ====================
export const TIMEOUT = {
 PAGE_LOAD: 60000, // 60 seconds
 SELECTOR_WAIT: 60000,
 LOGO_LOAD: 5000,
 CODE_BLOCK_RENDER: 20000,
 FONT_READY: 400, // milliseconds
} as const;

// ==================== BUNDLE SIZES ====================
export const BUNDLE_SIZE = {
 MAX_WARNING_KB: 428,
 MAX_ERROR_KB: 512,
} as const;

// ==================== Z-INDEX LAYERS ====================
export const Z_INDEX = {
 DROPDOWN: 1000,
 MODAL: 2000,
 TOOLTIP: 3000,
 TOAST: 4000,
 FLOATING_ACTION_BUTTON: 50,
} as const;

// ==================== BREAKPOINTS ====================
export const BREAKPOINT = {
 SM: 640,
 MD: 768,
 LG: 1024,
 XL: 1280,
 "2XL": 1536,
} as const;

// ==================== ANIMATION DURATIONS ====================
export const ANIMATION_DURATION = {
 FAST: 150,
 NORMAL: 300,
 SLOW: 500,
} as const;

// ==================== SPACING ====================
export const SPACING = {
 SECTION_GAP: 8, // gap-8
 CARD_PADDING: 6, // p-6
 PAGE_PADDING: {
  MOBILE: 4, // p-4
  DESKTOP: 8, // p-8
 },
} as const;

// ==================== DEBUG PATHS ====================
export const DEBUG_PATH = {
 BANNER_GOTO_ERROR: "/tmp/banner_debug_goto_error.png",
 BANNER_AFTER_GOTO: "/tmp/banner_debug_after_goto.png",
 BANNER_WAIT_ERROR: "/tmp/banner_debug_waitforselector_error.png",
 BANNER_BEFORE_CODE: "/tmp/banner_debug_before_wait_code.png",
 BANNER_AFTER_CODE: "/tmp/banner_debug_after_wait_code.png",
 RESUME_GOTO_ERROR: "/tmp/resume_debug_goto_error.png",
} as const;

// ==================== DEFAULT VALUES ====================
export const DEFAULT = {
 HOST: "127.0.0.1",
 PORT: 3000,
 LANGUAGE: "pt-br",
 PALETTE: "darkGreen",
 BG_BANNER: "midnightSlate",
} as const;
