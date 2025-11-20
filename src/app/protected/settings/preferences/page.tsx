/**
 * Preferences Settings Page
 * Theme, language, colors, and notification preferences
 */

"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Save,
  Loader2,
  Sun,
  Moon,
  Monitor,
  Globe2,
  Calendar,
  Bell,
  Check,
} from "lucide-react";
import { userPreferencesSchema, type UserPreferences, THEME_OPTIONS, LANGUAGE_OPTIONS, DATE_FORMAT_OPTIONS, PALETTE_OPTIONS } from "@/types/settings";
import { showToast } from "@/shared/utils/toast";
import { useTheme } from "@/providers/ThemeProvider";
import { usePalette } from "@/styles/pallete_provider";
import { getInternalPaletteName } from "@/lib/theme-utils";

export default function PreferencesSettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { setTheme } = useTheme();
  const { setPalette } = usePalette();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
    watch,
  } = useForm<UserPreferences>({
    resolver: zodResolver(userPreferencesSchema),
  });

  const selectedTheme = watch("theme");
  const selectedPalette = watch("palette");

  // Load current preferences
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        const response = await fetch("/api/user/preferences/full");
        if (response.ok) {
          const data = await response.json();
          reset(data.preferences);
        }
      } catch (error) {
        console.error("Failed to load preferences:", error);
        showToast.error("Failed to load your preferences");
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, [reset]);

  const onSubmit = async (data: UserPreferences) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/preferences/full", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        reset(result.preferences);
        showToast.success("Preferences updated successfully!");
      } else {
        throw new Error("Failed to update preferences");
      }
    } catch (error) {
      console.error("Failed to save preferences:", error);
      showToast.error("Failed to update preferences");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Appearance */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Sun size={20} className="text-blue-400" />
          Appearance
        </h3>

        <div className="space-y-6">
          {/* Theme Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Theme
            </label>
            <Controller
              name="theme"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-3 gap-3">
                  {THEME_OPTIONS.map((option) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => {
                        field.onChange(option.value);
                        setTheme(option.value as any); // Apply theme in real-time
                      }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative p-4 rounded-lg border-2 transition-all
                        ${
                          field.value === option.value
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                        }
                      `}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-2xl">{option.icon}</span>
                        <span className="text-sm font-medium text-white">
                          {option.label}
                        </span>
                      </div>
                      {field.value === option.value && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                          <Check size={12} />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Color Palette */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Color Palette
            </label>
            <Controller
              name="palette"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {PALETTE_OPTIONS.map((palette) => (
                    <motion.button
                      key={palette.id}
                      type="button"
                      onClick={() => {
                        field.onChange(palette.id);
                        // Apply palette in real-time
                        const internalPalette = getInternalPaletteName(palette.id as any);
                        setPalette(internalPalette);
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`
                        relative p-3 border-2 rounded-lg transition-all
                        ${
                          field.value === palette.id
                            ? "border-blue-600 bg-blue-500/10"
                            : "border-slate-700 hover:border-slate-600"
                        }
                      `}
                    >
                      {field.value === palette.id && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                          <Check size={12} />
                        </div>
                      )}

                      <div className="flex gap-1.5 mb-2">
                        {palette.colors.map((color, index) => (
                          <div
                            key={index}
                            className="flex-1 h-10 rounded shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>

                      <p className="text-xs font-medium text-white text-center">
                        {palette.name}
                      </p>
                    </motion.button>
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* Localization */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Globe2 size={20} className="text-blue-400" />
          Localization
        </h3>

        <div className="space-y-4">
          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">
              Language
            </label>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {LANGUAGE_OPTIONS.map((option) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative p-4 rounded-lg border-2 transition-all
                        ${
                          field.value === option.value
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                        }
                      `}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{option.flag}</span>
                        <span className="text-sm font-medium text-white">
                          {option.label}
                        </span>
                      </div>
                      {field.value === option.value && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                          <Check size={12} />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            />
          </div>

          {/* Date Format */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <Calendar size={16} />
              Date Format
            </label>
            <Controller
              name="dateFormat"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {DATE_FORMAT_OPTIONS.map((option) => (
                    <motion.button
                      key={option.value}
                      type="button"
                      onClick={() => field.onChange(option.value)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        relative p-3 rounded-lg border-2 transition-all
                        ${
                          field.value === option.value
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                        }
                      `}
                    >
                      <div className="text-center">
                        <p className="text-sm font-medium text-white">
                          {option.label}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {option.example}
                        </p>
                      </div>
                      {field.value === option.value && (
                        <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                          <Check size={12} />
                        </div>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Bell size={20} className="text-blue-400" />
          Notifications
        </h3>

        <div className="space-y-4">
          <NotificationToggle
            label="Email Notifications"
            description="Receive important updates via email"
            {...register("emailNotifications")}
          />
          <NotificationToggle
            label="Resume Expiry Alerts"
            description="Get notified when your resume needs updating"
            {...register("resumeExpiryAlerts")}
          />
          <NotificationToggle
            label="Weekly Digest"
            description="Receive a weekly summary of your activity"
            {...register("weeklyDigest")}
          />
          <NotificationToggle
            label="Marketing Emails"
            description="Tips, feature updates, and promotions"
            {...register("marketingEmails")}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
        <div className="text-sm text-slate-400">
          {isDirty ? (
            <span className="text-yellow-400">You have unsaved changes</span>
          ) : (
            <span>All changes saved</span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSaving || !isDirty}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-xl disabled:shadow-none"
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
}

// Notification Toggle Component
function NotificationToggle({
  label,
  description,
  ...props
}: {
  label: string;
  description: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors cursor-pointer">
      <div className="flex-1">
        <p className="font-medium text-white">{label}</p>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only peer"
          {...props}
        />
        <div className="w-11 h-6 bg-slate-700 peer-checked:bg-blue-600 rounded-full peer transition-all"></div>
        <div className="absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-5"></div>
      </div>
    </label>
  );
}
