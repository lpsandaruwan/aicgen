import { Profile } from '../models/profile.js';

export const PROFILES: Record<string, Profile> = {
  basic: {
    name: 'basic',
    description: 'Minimal guidelines for quick setup',
    guidelines: ['typescript-basics', 'code-style'],
    includeADR: false,
    includeHooks: false,
    verbosity: 'concise'
  },
  balanced: {
    name: 'balanced',
    description: 'Comprehensive best practices (recommended)',
    guidelines: ['typescript-basics', 'testing', 'architecture', 'code-style', 'error-handling'],
    includeADR: true,
    includeHooks: false,
    verbosity: 'detailed'
  },
  expert: {
    name: 'expert',
    description: 'Complete setup with all features',
    guidelines: ['typescript-basics', 'testing', 'architecture', 'code-style', 'error-handling', 'performance', 'security'],
    includeADR: true,
    includeHooks: true,
    verbosity: 'comprehensive'
  }
};

export function getProfile(name: string): Profile {
  return PROFILES[name] || PROFILES.balanced;
}
