/**
 * Centralized application configuration
 *
 * This module provides a single source of truth for app-level configuration
 * including version, support URLs, and other global constants.
 */

export const APP_CONFIG = {
  name: 'Auvitta',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '0.0.1-dev',
  supportUrl: process.env.NEXT_PUBLIC_SUPPORT_URL || '#',
} as const

/**
 * Returns the current application version
 * @returns Version string (e.g., "0.1.0")
 */
export function getAppVersion(): string {
  return APP_CONFIG.version
}

/**
 * Returns the formatted application version with "v." prefix
 * @returns Formatted version string (e.g., "v. 0.1.0")
 */
export function getFormattedVersion(): string {
  return `v. ${APP_CONFIG.version}`
}

/**
 * Returns the application support URL
 * @returns Support URL string
 */
export function getSupportUrl(): string {
  return APP_CONFIG.supportUrl
}
