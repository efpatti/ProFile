/**
 * Toast Helper Functions
 * Uncle Bob: "Functions should do one thing. They should do it well."
 *
 * Centralized toast notification functions for consistent UX.
 * Import these instead of using react-hot-toast directly.
 */

import toast from "react-hot-toast";

export const showToast = {
 /**
  * Show success toast
  */
 success: (message: string) => {
  return toast.success(message);
 },

 /**
  * Show error toast
  */
 error: (message: string) => {
  return toast.error(message);
 },

 /**
  * Show loading toast (returns ID for manual dismissal)
  */
 loading: (message: string) => {
  return toast.loading(message);
 },

 /**
  * Show promise toast (handles loading → success/error automatically)
  */
 promise: <T>(
  promise: Promise<T>,
  messages: {
   loading: string;
   success: string;
   error: string;
  }
 ) => {
  return toast.promise(promise, messages);
 },

 /**
  * Dismiss specific toast by ID
  */
 dismiss: (toastId: string) => {
  return toast.dismiss(toastId);
 },

 /**
  * Dismiss all toasts
  */
 dismissAll: () => {
  return toast.dismiss();
 },

 /**
  * Custom toast with icon
  */
 custom: (message: string, icon?: string) => {
  return toast(message, { icon });
 },
};

// Common toast messages (DRY principle)
export const TOAST_MESSAGES = {
 // Save operations
 SAVE_SUCCESS: "Saved successfully! ✓",
 SAVE_ERROR: "Failed to save. Please try again.",

 // Export operations
 EXPORT_SUCCESS: "Exported successfully! 🎉",
 EXPORT_ERROR: "Export failed. Please try again.",
 EXPORT_LOADING: "Generating export...",

 // Auth operations
 LOGIN_SUCCESS: "Welcome back! 👋",
 LOGIN_ERROR: "Invalid credentials. Please try again.",
 SIGNUP_SUCCESS: "Account created successfully! 🎉",
 SIGNUP_ERROR: "Failed to create account. Please try again.",
 LOGOUT_SUCCESS: "Logged out successfully!",

 // Onboarding
 ONBOARDING_SUCCESS: "Onboarding completed! 🚀",
 ONBOARDING_ERROR: "Failed to complete onboarding.",

 // Generic
 ERROR_GENERIC: "Something went wrong. Please try again.",
 SUCCESS_GENERIC: "Action completed successfully!",
 LOADING_GENERIC: "Loading...",
};
