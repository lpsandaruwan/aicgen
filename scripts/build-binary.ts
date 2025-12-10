#!/usr/bin/env bun
import { readFileSync } from 'fs';

const packageJson = JSON.parse(readFileSync('package.json', 'utf-8'));
const version = packageJson.version;

const platform = process.argv[2] || 'current';

console.log(`Building binary for ${platform} with version ${version}...`);

const buildConfigs: Record<string, string[]> = {
  current: ['build', 'src/index.ts', '--compile', '--outfile', 'aicgen'],
  windows: ['build', 'src/index.ts', '--compile', '--outfile', 'aicgen.exe'],
  linux: ['build', 'src/index.ts', '--compile', '--outfile', 'aicgen-linux', '--target=bun-linux-x64'],
  macos: ['build', 'src/index.ts', '--compile', '--outfile', 'aicgen-macos', '--target=bun-darwin-arm64']
};

const args = buildConfigs[platform];

if (!args) {
  console.error(`Unknown platform: ${platform}`);
  console.error(`Available platforms: ${Object.keys(buildConfigs).join(', ')}`);
  process.exit(1);
}

// Add the version define
args.push('--define', `process.env.APP_VERSION="${version}"`);

const proc = Bun.spawn(['bun', ...args], {
  stdout: 'inherit',
  stderr: 'inherit',
});

const exitCode = await proc.exited;

if (exitCode === 0) {
  console.log(`✓ Binary built successfully (v${version})`);
} else {
  console.error('Build failed');
  process.exit(exitCode);
}
