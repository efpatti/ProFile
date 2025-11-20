/**
 * Theme Provider
 * Manages global theme (dark/light/auto) and integrates with user preferences
 */

"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/core/services/AuthProvider";
import { applyTheme, watchSystemTheme, getEffectiveTheme } from "@/lib/theme-utils";
import type { Theme } from "@/types/settings";

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  effectiveTheme: "light" | "dark";
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<Theme>("dark");
  const [effectiveTheme, setEffectiveTheme] = useState<"light" | "dark">("dark");
  const [isLoading, setIsLoading] = useState(true);

  // Load theme from user preferences
  useEffect(() => {
    if (!user) {
      // Default theme for non-authenticated users
      setThemeState("dark");
      setEffectiveTheme("dark");
      applyTheme("dark");
      setIsLoading(false);
      return;
    }

    let ignore = false;

    const fetchTheme = async () => {
      try {
        const response = await fetch("/api/user/preferences/full");
        if (response.ok && !ignore) {
          const data = await response.json();
          const userTheme = (data.preferences?.theme || "dark") as Theme;
          setThemeState(userTheme);
          setEffectiveTheme(getEffectiveTheme(userTheme));
          applyTheme(userTheme);
        } else if (!ignore) {
          setThemeState("dark");
          setEffectiveTheme("dark");
          applyTheme("dark");
        }
      } catch (error) {
        console.error("Error fetching theme:", error);
        if (!ignore) {
          setThemeState("dark");
          setEffectiveTheme("dark");
          applyTheme("dark");
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    };

    fetchTheme();

    return () => {
      ignore = true;
    };
  }, [user]);

  // Apply theme when it changes
  useEffect(() => {
    applyTheme(theme);
    setEffectiveTheme(getEffectiveTheme(theme));
  }, [theme]);

  // Watch system theme changes when in auto mode
  useEffect(() => {
    if (theme !== "auto") return;

    const unwatch = watchSystemTheme((isDark) => {
      setEffectiveTheme(isDark ? "dark" : "light");
      applyTheme("auto");
    });

    return unwatch;
  }, [theme]);

  // Set theme and persist to server
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    setEffectiveTheme(getEffectiveTheme(newTheme));
    applyTheme(newTheme);

    // Persist to server if user is authenticated
    if (user) {
      try {
        await fetch("/api/user/preferences/full", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ theme: newTheme }),
        });
      } catch (error) {
        console.error("Failed to save theme preference:", error);
      }
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        effectiveTheme,
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
