/**
 * Test Scenario System
 * 
 * Provides runtime scenario selection for testing different API states
 * in development and test environments.
 */

export interface ScenarioOption {
  key: string;
  label: string;
  description?: string;
}

export interface ScenarioDimension {
  key: string;
  label: string;
  options: ScenarioOption[];
  defaultOption: string;
}

export interface ScenarioFeature {
  key: string;
  label: string;
  description?: string;
  dimensions: ScenarioDimension[];
}

const scenarioRegistry: Map<string, ScenarioFeature> = new Map();

/**
 * Register a scenario feature with its dimensions and options.
 */
export function registerScenarioFeature(feature: ScenarioFeature): void {
  scenarioRegistry.set(feature.key, feature);
}

/**
 * Get all registered scenario features.
 */
export function getScenarioFeatures(): ScenarioFeature[] {
  return Array.from(scenarioRegistry.values());
}

/**
 * Get a specific scenario feature by key.
 */
export function getScenarioFeature(key: string): ScenarioFeature | undefined {
  return scenarioRegistry.get(key);
}

/**
 * Build x-mock-scenario header value from scenario selections.
 * Format: "featureKey.dimensionKey=value,otherFeature.dimension=value"
 */
export function buildScenarioHeader(selections: Record<string, Record<string, string>>): string {
  const parts: string[] = [];
  
  Object.entries(selections).forEach(([featureKey, dimensions]) => {
    Object.entries(dimensions).forEach(([dimensionKey, value]) => {
      // Skip default values
      const feature = getScenarioFeature(featureKey);
      const dimension = feature?.dimensions.find(d => d.key === dimensionKey);
      if (dimension && value !== dimension.defaultOption) {
        parts.push(`${featureKey}.${dimensionKey}=${value}`);
      }
    });
  });
  
  return parts.sort().join(',');
}

/**
 * Parse x-mock-scenario header into selections map.
 */
export function parseScenarioHeader(header: string): Record<string, Record<string, string>> {
  const selections: Record<string, Record<string, string>> = {};
  
  if (!header) return selections;
  
  header.split(',').forEach(part => {
    const match = part.match(/^(\w+)\.(\w+)=(.+)$/);
    if (match) {
      const [, featureKey, dimensionKey, value] = match;
      if (!selections[featureKey]) {
        selections[featureKey] = {};
      }
      selections[featureKey][dimensionKey] = value;
    }
  });
  
  return selections;
}
