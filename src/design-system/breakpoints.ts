/**
 * Design System Breakpoints
 * Mobile-first responsive design breakpoints.
 * 
 * Usage:
 * - Default: Mobile (< 480px)
 * - sm: Small mobile edge cases (≥ 480px)
 * - md: Tablet (≥ 701px)
 * - lg: Desktop (≥ 1025px)
 * - xl: Large desktop (≥ 1441px)
 */

export const breakpoints = {
  sm: 480,   // Small mobile edge cases
  md: 701,   // Tablet
  lg: 1025,  // Desktop
  xl: 1441,  // Large desktop
} as const;

export type Breakpoint = keyof typeof breakpoints;

/**
 * Get media query string for a breakpoint
 * @param breakpoint - The breakpoint key
 * @returns CSS media query string
 */
export function getMediaQuery(breakpoint: Breakpoint): string {
  return `(min-width: ${breakpoints[breakpoint]}px)`;
}
