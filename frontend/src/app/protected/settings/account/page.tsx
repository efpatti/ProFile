/**
 * Account Settings Page
 * Email and security settings
 */

"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Save,
  Loader2,
  Mail,
  Lock,
  AlertTriangle,
  ShieldCheck,
  Key,
  Trash2,
} from "lucide-react";
import { accountSettingsSchema, type AccountSettings } from "@/types/settings";
import { showToast } from "@/shared/utils/toast";

export default function AccountSettingsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<AccountSettings>({
    resolver: zodResolver(accountSettingsSchema),
  });

  const newPassword = watch("newPassword");
  const hasPasswordProvider = session?.user?.email && !session?.user?.image?.includes('googleusercontent');

  // Load current account data
  useEffect(() => {
    if (session?.user) {
      reset({
        email: session.user.email || undefined,
      });
      setIsLoading(false);
    }
  }, [session, reset]);

  const onSubmit = async (data: AccountSettings) => {
    setIsSaving(true);
    try {
      // Handle password change
      if (data.newPassword && data.currentPassword) {
        const passwordResponse = await fetch("/api/user/change-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentPassword: data.currentPassword,
            newPassword: data.newPassword,
          }),
        });

        if (!passwordResponse.ok) {
          const error = await passwordResponse.json();
          throw new Error(error.message || "Failed to change password");
        }

        showToast.success("Password changed successfully!");
        reset({ email: data.email });
      }

      // Handle email change
      if (data.email && data.email !== session?.user?.email) {
        const emailResponse = await fetch("/api/user/change-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: data.email }),
        });

        if (!emailResponse.ok) {
          const error = await emailResponse.json();
          throw new Error(error.message || "Failed to change email");
        }

        showToast.success(
          "Verification email sent! Please check your inbox to confirm."
        );
      }
    } catch (error: any) {
      console.error("Failed to update account:", error);
      showToast.error(error.message || "Failed to update account settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      const response = await fetch("/api/user/delete-account", {
        method: "DELETE",
      });

      if (response.ok) {
        showToast.success("Account deleted successfully");
        window.location.href = "/";
      } else {
        throw new Error("Failed to delete account");
      }
    } catch (error) {
      console.error("Failed to delete account:", error);
      showToast.error("Failed to delete account");
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
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Settings */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Mail size={20} className="text-blue-400" />
            Email Address
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                size={18}
              />
              <input
                type="email"
                {...register("email")}
                placeholder="your.email@example.com"
                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}

            {session?.user?.email !== watch("email") && (
              <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex gap-2">
                <AlertTriangle className="text-yellow-500 flex-shrink-0" size={18} />
                <p className="text-sm text-yellow-200">
                  Changing your email will require verification. You'll need to
                  confirm the new email address before the change takes effect.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Password Settings */}
        {hasPasswordProvider && (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Lock size={20} className="text-blue-400" />
              Change Password
            </h3>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Key
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    type="password"
                    {...register("currentPassword")}
                    placeholder="Enter current password"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                {errors.currentPassword && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    type="password"
                    {...register("newPassword")}
                    placeholder="Enter new password"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                {errors.newPassword && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <ShieldCheck
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                    size={18}
                  />
                  <input
                    type="password"
                    {...register("confirmPassword")}
                    placeholder="Confirm new password"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg px-10 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {newPassword && (
                <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-200 flex items-center gap-2">
                    <ShieldCheck size={16} />
                    Password must be at least 8 characters long
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* OAuth Provider Info */}
        {!hasPasswordProvider && (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-6">
            <div className="flex gap-4">
              <ShieldCheck className="text-blue-400 flex-shrink-0" size={24} />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  Social Login
                </h3>
                <p className="text-sm text-slate-300">
                  You're signed in with a social provider (Google, GitHub, etc.).
                  Password management is handled by your provider.
                </p>
              </div>
            </div>
          </div>
        )}

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

      {/* Danger Zone */}
      <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-xl p-6">
        <div className="flex gap-4 mb-4">
          <AlertTriangle className="text-red-400 flex-shrink-0" size={24} />
          <div>
            <h3 className="text-lg font-bold text-white mb-2">Danger Zone</h3>
            <p className="text-sm text-slate-300 mb-4">
              Once you delete your account, there is no going back. This action is
              permanent and cannot be undone.
            </p>
          </div>
        </div>

        {!showDeleteConfirm ? (
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            <Trash2 size={18} />
            Delete Account
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-red-200">
              Are you absolutely sure? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleDeleteAccount}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <Trash2 size={18} />
                Yes, Delete My Account
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
