/**
 * Privacy Settings Page
 * Resume visibility and data control preferences
 */

"use client";

import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import {
  Save,
  Loader2,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Globe,
  Link as LinkIcon,
  Check,
  AlertCircle,
} from "lucide-react";
import {
  privacyPreferencesSchema,
  type PrivacyPreferences,
  PROFILE_VISIBILITY_OPTIONS,
} from "@/types/settings";
import { showToast } from "@/shared/utils/toast";

export default function PrivacySettingsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
    watch,
  } = useForm<PrivacyPreferences>({
    resolver: zodResolver(privacyPreferencesSchema),
  });

  const profileVisibility = watch("profileVisibility");

  // Load current privacy settings
  useEffect(() => {
    const loadPrivacy = async () => {
      try {
        const response = await fetch("/api/user/preferences/full");
        if (response.ok) {
          const data = await response.json();
          const privacyData: PrivacyPreferences = {
            profileVisibility: data.preferences.profileVisibility,
            showEmail: data.preferences.showEmail,
            showPhone: data.preferences.showPhone,
            allowSearchEngineIndex: data.preferences.allowSearchEngineIndex,
          };
          reset(privacyData);
        }
      } catch (error) {
        console.error("Failed to load privacy settings:", error);
        showToast.error("Failed to load privacy settings");
      } finally {
        setIsLoading(false);
      }
    };

    loadPrivacy();
  }, [reset]);

  const onSubmit = async (data: PrivacyPreferences) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/user/preferences/full", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        showToast.success("Privacy settings updated successfully!");
      } else {
        throw new Error("Failed to update privacy settings");
      }
    } catch (error) {
      console.error("Failed to save privacy settings:", error);
      showToast.error("Failed to update privacy settings");
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
      {/* Profile Visibility */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Shield size={20} className="text-blue-400" />
          Profile Visibility
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Control who can view your resume and profile information
        </p>

        <Controller
          name="profileVisibility"
          control={control}
          render={({ field }) => (
            <div className="space-y-3">
              {PROFILE_VISIBILITY_OPTIONS.map((option) => {
                const IconComponent =
                  option.value === "public"
                    ? Globe
                    : option.value === "private"
                    ? Lock
                    : LinkIcon;

                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => field.onChange(option.value)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`
                      relative w-full p-4 rounded-lg border-2 transition-all text-left
                      ${
                        field.value === option.value
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                      }
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`
                        p-3 rounded-lg
                        ${
                          field.value === option.value
                            ? "bg-blue-600 text-white"
                            : "bg-slate-700 text-slate-300"
                        }
                      `}
                      >
                        <IconComponent size={24} />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-white">
                            {option.label}
                          </h4>
                          {field.value === option.value && (
                            <div className="bg-blue-600 text-white rounded-full p-1">
                              <Check size={14} />
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-slate-400">
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}
        />

        {profileVisibility === "public" && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
          >
            <div className="flex gap-3">
              <AlertCircle className="text-yellow-500 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium text-yellow-200">
                  Public Profile Warning
                </p>
                <p className="text-sm text-yellow-300/80 mt-1">
                  Your resume will be visible to anyone on the internet. Make sure
                  you're comfortable sharing your personal information publicly.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Contact Information Visibility */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Eye size={20} className="text-blue-400" />
          Contact Information
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Choose what contact details to display on your public profile
        </p>

        <div className="space-y-4">
          <PrivacyToggle
            label="Show Email Address"
            description="Display your email on your public resume"
            icon={<Eye size={18} />}
            {...register("showEmail")}
          />
          <PrivacyToggle
            label="Show Phone Number"
            description="Display your phone number on your public resume"
            icon={<Eye size={18} />}
            {...register("showPhone")}
          />
        </div>
      </div>

      {/* Search Engine Indexing */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Globe size={20} className="text-blue-400" />
          Search Engine Indexing
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          Control whether search engines can index your public profile
        </p>

        <PrivacyToggle
          label="Allow Search Engine Indexing"
          description="Let search engines like Google index your public resume. This helps recruiters find you."
          icon={<Globe size={18} />}
          {...register("allowSearchEngineIndex")}
        />

        {watch("allowSearchEngineIndex") && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
          >
            <div className="flex gap-3">
              <AlertCircle className="text-blue-400 flex-shrink-0" size={20} />
              <div>
                <p className="text-sm font-medium text-blue-200">
                  SEO Optimization Enabled
                </p>
                <p className="text-sm text-blue-300/80 mt-1">
                  Your resume will be discoverable through search engines, making it
                  easier for recruiters to find you.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Data & Privacy Notice */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6">
        <div className="flex gap-4">
          <Shield className="text-blue-400 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-lg font-bold text-white mb-2">
              Your Privacy Matters
            </h3>
            <p className="text-sm text-slate-300 mb-3">
              We take your privacy seriously. Your data is encrypted and stored
              securely. We never sell your information to third parties.
            </p>
            <p className="text-sm text-slate-400">
              Learn more about how we protect your data in our{" "}
              <a
                href="/privacy"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
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

// Privacy Toggle Component
function PrivacyToggle({
  label,
  description,
  icon,
  ...props
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex items-start justify-between p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-slate-600 transition-colors cursor-pointer">
      <div className="flex items-start gap-3 flex-1">
        <div className="p-2 bg-slate-700 rounded-lg text-slate-300 mt-0.5">
          {icon}
        </div>
        <div className="flex-1">
          <p className="font-medium text-white">{label}</p>
          <p className="text-sm text-slate-400 mt-1">{description}</p>
        </div>
      </div>
      <div className="relative ml-4">
        <input type="checkbox" className="sr-only peer" {...props} />
        <div className="w-11 h-6 bg-slate-700 peer-checked:bg-blue-600 rounded-full peer transition-all"></div>
        <div className="absolute left-[2px] top-[2px] bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-5"></div>
      </div>
    </label>
  );
}
