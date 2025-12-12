/**
 * FILE: apps/app/src/lib/constants.ts
 *
 * PURPOSE: Defines the static list of all wrapped pages in the correct sequence and provides utility functions for navigation.
 *
 * STACK CONTEXT:
 * - Pure TypeScript constant file. Must not contain any React or Next.js-specific imports.
 * - This file exports constants used across Server Components (for routing) and Client Components (for the progress bar and navigation buttons).
 */

/**
 * Interface for a wrapped route
 */
export interface WrappedRoute {
  id: number;
  title: string;
  path: string;
}

/**
 * Array of all wrapped card routes in sequential order.
 * Each object contains an id, descriptive title, and the actual route path.
 */
export const WRAPPED_ROUTES: WrappedRoute[] = [
  { id: 1, title: "The Volume", path: "/wrap/volume" },
  { id: 2, title: "The Collector", path: "/wrap/nft" },
  { id: 3, title: "The HODL Score", path: "/wrap/hodl" },
  { id: 4, title: "The DeFi Guru", path: "/wrap/defi" },
  { id: 5, title: "The Explorer", path: "/wrap/explorer" },
  { id: 6, title: "The Biggest Move", path: "/wrap/biggest-move" },
  { id: 7, title: "The Finale", path: "/wrap/badge" },
];

/**
 * Helper function to get the previous and next paths for navigation.
 * Takes the current path and returns an object with prevPath and nextPath.
 * Returns null for prevPath on the first card and null for nextPath on the last card.
 *
 * @param currentPath - The current route path (e.g., '/wrap/volume')
 * @returns Object containing prevPath and nextPath (either string or null)
 */
export function getNavigationPaths(
  currentPath: string
): { prevPath: string | null; nextPath: string | null } {
  const currentIndex = WRAPPED_ROUTES.findIndex(
    (route) => route.path === currentPath
  );

  // If path not found, return nulls for both
  if (currentIndex === -1) {
    return { prevPath: null, nextPath: null };
  }

  // Get previous path (null if first card)
  const prevPath =
    currentIndex > 0 ? WRAPPED_ROUTES[currentIndex - 1].path : null;

  // Get next path (null if last card)
  const nextPath =
    currentIndex < WRAPPED_ROUTES.length - 1
      ? WRAPPED_ROUTES[currentIndex + 1].path
      : null;

  return { prevPath, nextPath };
}

/**
 * Helper function to get the current progress information.
 * Returns the current step (1-based) and total number of steps.
 *
 * @param currentPath - The current route path (e.g., '/wrap/volume')
 * @returns Object containing current (1-based index) and total steps
 */
export function getProgress(
  currentPath: string
): { current: number; total: number } {
  const currentIndex = WRAPPED_ROUTES.findIndex(
    (route) => route.path === currentPath
  );

  // Return 1-based index for current step
  return {
    current: currentIndex !== -1 ? currentIndex + 1 : 1,
    total: WRAPPED_ROUTES.length,
  };
}
