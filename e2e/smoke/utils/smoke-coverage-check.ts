/**
 * Smoke test coverage tracking
 * Ensures every application route has at least one smoke test
 */

/**
 * All application routes that should be covered by smoke tests
 */
const APPLICATION_ROUTES = [
  '/',
  '/about',
  '/greetings/:id',
] as const;

/**
 * Routes that are covered by smoke tests
 * Update this list when adding new smoke specs
 */
export const COVERED_ROUTES = [
  '/',
  '/about',
  '/greetings/:id',
] as const;

/**
 * Check which routes are not covered by smoke tests
 */
export function getUncoveredRoutes(): string[] {
  return APPLICATION_ROUTES.filter(
    (route) => !COVERED_ROUTES.includes(route)
  );
}

/**
 * Check if all routes are covered
 */
export function isFullyCovered(): boolean {
  return getUncoveredRoutes().length === 0;
}

/**
 * Calculate coverage percentage
 */
export function getCoveragePercentage(): number {
  return Math.round(
    (COVERED_ROUTES.length / APPLICATION_ROUTES.length) * 100
  );
}

/**
 * Run coverage check and report results
 */
export function checkCoverage(): void {
  const uncovered = getUncoveredRoutes();
  const percentage = getCoveragePercentage();

  console.log('\n📊 Smoke Test Route Coverage Report\n');
  console.log(`Total routes: ${APPLICATION_ROUTES.length}`);
  console.log(`Covered routes: ${COVERED_ROUTES.length}`);
  console.log(`Coverage: ${percentage}%\n`);

  if (uncovered.length > 0) {
    console.log('❌ Uncovered routes:');
    uncovered.forEach((route) => console.log(`  - ${route}`));
    console.log('\nPlease add smoke tests for these routes.\n');
    process.exit(1);
  } else {
    console.log('✅ All routes are covered by smoke tests!\n');
    process.exit(0);
  }
}

// Run check if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  checkCoverage();
}
