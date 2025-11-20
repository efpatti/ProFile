/**
 * Settings Layout - Tab Navigation
 * Provides a consistent layout with tabs for all settings pages
 */

"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  User,
  Settings as SettingsIcon,
  Shield,
  Lock,
  Palette,
  ArrowLeft,
} from "lucide-react";

const SETTINGS_TABS = [
  {
    id: "profile",
    label: "Profile",
    href: "/protected/settings/profile",
    icon: User,
    description: "Personal information and social links",
  },
  {
    id: "preferences",
    label: "Preferences",
    href: "/protected/settings/preferences",
    icon: SettingsIcon,
    description: "Theme, language, and notifications",
  },
  {
    id: "template",
    label: "Template & Style",
    href: "/protected/settings/template",
    icon: Palette,
    description: "Resume template and color palette",
  },
  {
    id: "privacy",
    label: "Privacy",
    href: "/protected/settings/privacy",
    icon: Shield,
    description: "Resume visibility and data controls",
  },
  {
    id: "account",
    label: "Account",
    href: "/protected/settings/account",
    icon: Lock,
    description: "Email and security settings",
  },
] as const;

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Get current tab from pathname
  const currentTab = SETTINGS_TABS.find((tab) => pathname === tab.href);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/protected/resume"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-300 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Back to Resume</span>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Settings</h1>
              <p className="text-lg text-slate-400">
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-xl p-2 mb-8">
          <nav className="flex gap-2 overflow-x-auto">
            {SETTINGS_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;

              return (
                <Link key={tab.id} href={tab.href} className="flex-1 min-w-fit">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      relative px-4 py-3 rounded-lg transition-all cursor-pointer
                      ${
                        isActive
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                          : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2 justify-center">
                      <Icon size={18} />
                      <span className="font-medium hidden sm:inline">
                        {tab.label}
                      </span>
                    </div>

                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-blue-600 rounded-lg -z-10"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                      />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Current Tab Description */}
        {currentTab && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/30 border border-slate-800/50 rounded-lg px-6 py-4 mb-6"
          >
            <div className="flex items-center gap-3">
              <currentTab.icon className="text-blue-400" size={24} />
              <div>
                <h2 className="text-xl font-bold text-white">
                  {currentTab.label}
                </h2>
                <p className="text-slate-400 text-sm">
                  {currentTab.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Page Content */}
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
