/**
 * Fast file hashing utilities
 *
 * For fingerprint generation and cache invalidation
 */

import crypto from 'crypto';

/**
 * Hash file contents
 *
 * @param content - File content or data to hash
 * @returns SHA-256 hash hex string
 */
export function hashContent(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Hash multiple strings together
 *
 * @param strings - Array of strings to hash
 * @returns Combined SHA-256 hash
 */
export function hashMultiple(strings: string[]): string {
  const combined = strings.join('::');
  return hashContent(combined);
}

/**
 * Hash file at path
 *
 * @param filePath - Path to file
 * @returns SHA-256 hash of file contents
 */
export async function hashFile(filePath: string): Promise<string> {
  // TODO: Implement in Phase 2
  throw new Error('Not implemented yet');
}

/**
 * Hash directory tree structure (not contents)
 *
 * @param dirPath - Path to directory
 * @returns Hash of directory tree structure
 */
export async function hashDirectoryTree(dirPath: string): Promise<string> {
  // TODO: Implement in Phase 2
  throw new Error('Not implemented yet');
}
