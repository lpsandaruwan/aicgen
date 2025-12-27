/**
 * Confidence scoring utilities
 *
 * Calculates confidence scores for analysis results
 */

import type { ConfidenceInputs } from '../types.js';

/**
 * Calculate overall confidence score
 *
 * Combines static and AI confidence with agreement bonus
 *
 * @param inputs - Confidence calculation inputs
 * @returns Overall confidence score (0.0 - 1.0)
 */
export function calculateConfidence(inputs: ConfidenceInputs): number {
  const { staticConfidence, aiConfidence, agreement, signalCount } = inputs;

  // If only static analysis available
  if (!aiConfidence) {
    return staticConfidence;
  }

  // Weight: 30% static, 70% AI
  const weighted = staticConfidence * 0.3 + aiConfidence * 0.7;

  // Agreement bonus: up to +0.1
  const agreementBonus = agreement ? agreement * 0.1 : 0;

  // Signal count bonus: more signals = higher confidence
  const signalBonus = signalCount ? Math.min(signalCount / 100, 0.05) : 0;

  return Math.min(weighted + agreementBonus + signalBonus, 1.0);
}

/**
 * Calculate agreement between static and AI analysis
 *
 * @param staticResult - Static analysis result
 * @param aiResult - AI analysis result
 * @returns Agreement score (0.0 - 1.0)
 */
export function calculateAgreement(staticResult: unknown, aiResult: unknown): number {
  // TODO: Implement in Phase 7
  // - Compare static vs AI results
  // - Check agreement on: language, frameworks, project type
  // - Return 0-1 score
  throw new Error('Not implemented yet');
}
