"use server"; // Ensures this runs in a server-side environment

import { cookies } from "next/headers"; // Import from Next.js
import themeConfig from "@/config/themeConfig"; // Import theme config

/**
 * Get settings from cookies (server-side only)
 */
export const getSettingsFromCookie = () => {
  if (typeof window !== "undefined") {
    // Fallback for client-side execution
    return getClientSettingsFromCookie();
  }

  const cookieStore = cookies(); // Get cookies from server
  const cookieName = themeConfig.settingsCookieName;

  return JSON.parse(cookieStore.get(cookieName)?.value || "{}");
};

/**
 * Get settings from cookies (client-side)
 */
export const getClientSettingsFromCookie = () => {
  if (typeof window === "undefined") return {}; // Prevent execution on server

  const cookieName = themeConfig.settingsCookieName;
  const allCookies = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${cookieName}=`))
    ?.split("=")[1];

  return JSON.parse(allCookies || "{}");
};

/**
 * Get mode from settings or fallback to theme config
 */
export const getMode = () => {
  const settingsCookie =
    typeof window !== "undefined"
      ? getClientSettingsFromCookie()
      : getSettingsFromCookie();

  return settingsCookie.mode || themeConfig.mode;
};

/**
 * Get system mode
 */
export const getSystemMode = () => {
  return getMode();
};

/**
 * Get server mode (Ensures it runs only in server environments)
 */
export const getServerMode = () => {
  if (typeof window !== "undefined") {
    throw new Error("getServerMode() should only be used on the server!");
  }

  return getMode();
};
