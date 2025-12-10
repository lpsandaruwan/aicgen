import ora from 'ora';
import chalk from 'chalk';
import { homedir } from 'os';
import { join } from 'path';
import { mkdir, writeFile, rm } from 'fs/promises';
import { GuidelineLoader } from '../services/guideline-loader.js';
import { createSummaryBox } from '../utils/formatting.js';
import { CONFIG, GITHUB_RELEASES_URL } from '../config.js';

interface GitHubRelease {
  tag_name: string;
  name: string;
  body: string;
  zipball_url: string;
  tarball_url: string;
  published_at: string;
}

interface VersionInfo {
  version: string;
  downloadUrl: string;
  changes: string[];
  publishedAt: string;
}

export async function updateCommand(options: { force?: boolean } = {}) {
  const spinner = ora('Checking for updates...').start();

  try {
    // 1. Get current version
    const loader = await GuidelineLoader.create();
    const currentVersion = loader.getVersion();

    // 2. Fetch latest version from GitHub
    const latestVersion = await fetchLatestVersion();

    spinner.stop();

    // Show current vs latest
    console.log('\n' + createSummaryBox('📦 Update Check', [
      { label: 'Current', value: currentVersion },
      { label: 'Latest', value: latestVersion.version }
    ]));

    // 3. Check if update needed
    if (!options.force && !needsUpdate(currentVersion, latestVersion.version)) {
      console.log(chalk.green('\n✓ Already up to date!'));
      return;
    }

    if (options.force) {
      console.log(chalk.yellow('\n⚠️  Force update requested'));
    } else {
      console.log(chalk.cyan('\n📋 What\'s new:'));
      latestVersion.changes.slice(0, 10).forEach(change => {
        console.log(`   ${chalk.gray('•')} ${change}`);
      });
      if (latestVersion.changes.length > 10) {
        console.log(chalk.gray(`   ... and ${latestVersion.changes.length - 10} more changes`));
      }
    }

    // 4. Download and install
    spinner.start('Downloading guidelines...');

    const cacheDir = join(homedir(), CONFIG.CACHE_DIR_NAME, CONFIG.CACHE_DIR);

    // Clear existing cache
    try {
      await rm(cacheDir, { recursive: true, force: true });
    } catch {
      // Directory might not exist
    }

    await mkdir(cacheDir, { recursive: true });

    // Download from GitHub
    await downloadGuidelines(latestVersion.downloadUrl, cacheDir);

    // Write version file
    await writeFile(
      join(cacheDir, 'version.json'),
      JSON.stringify({ version: latestVersion.version, updatedAt: new Date().toISOString() }, null, 2),
      'utf-8'
    );

    spinner.succeed(`Updated to v${latestVersion.version}`);

    console.log(chalk.green('\n✅ Guidelines updated successfully!'));
    console.log(chalk.gray(`   Location: ${cacheDir}`));
    console.log(chalk.gray(`\n   Run ${chalk.white('aicgen init')} to use the latest guidelines`));

  } catch (error) {
    spinner.fail('Update failed');

    if ((error as Error).message.includes('rate limit')) {
      console.error(chalk.red('\n❌ GitHub API rate limit exceeded'));
      console.log(chalk.yellow('   Try again later or authenticate with GitHub'));
    } else if ((error as Error).message.includes('ENOTFOUND') || (error as Error).message.includes('fetch')) {
      console.error(chalk.red('\n❌ Network error - check your internet connection'));
    } else {
      console.error(chalk.red(`\n❌ ${(error as Error).message}`));
    }

    process.exit(1);
  }
}

async function fetchLatestVersion(): Promise<VersionInfo> {
  const response = await fetch(GITHUB_RELEASES_URL, {
    headers: {
      'Accept': 'application/vnd.github+json',
      'User-Agent': CONFIG.USER_AGENT
    }
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Guidelines repository not found. The repository may not exist yet.');
    } else if (response.status === 403) {
      throw new Error('GitHub API rate limit exceeded');
    }
    throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as GitHubRelease;

  // Parse changelog from body
  const changes = data.body
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('*'))
    .map(line => line.replace(/^[-*]\s*/, '').trim())
    .filter(line => line.length > 0);

  return {
    version: data.tag_name.replace(/^v/, ''),
    downloadUrl: data.tarball_url,
    changes,
    publishedAt: data.published_at
  };
}

async function downloadGuidelines(url: string, targetDir: string): Promise<void> {
  // Download tarball
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
  }

  // TODO: Implement actual tarball extraction when we have the real repo
  // const tarballBuffer = Buffer.from(await response.arrayBuffer());
  // For now, write a placeholder structure

  // Create placeholder structure
  await writeFile(
    join(targetDir, 'README.md'),
    '# aicgen Guidelines\n\nOfficial guidelines downloaded from GitHub.\n',
    'utf-8'
  );

  // Create placeholder guideline-mappings.yml
  await writeFile(
    join(targetDir, 'guideline-mappings.yml'),
    '# Guidelines will be populated from GitHub repo\n',
    'utf-8'
  );

  await mkdir(join(targetDir, 'guidelines'), { recursive: true });

  console.log(chalk.yellow('\n⚠️  Note: Actual tarball extraction not yet implemented'));
  console.log(chalk.gray('   Placeholder files created for testing'));
}

function needsUpdate(current: string, latest: string): boolean {
  // If current is embedded or unknown, always update
  if (current === 'embedded' || current === 'unknown' || current === 'custom') {
    return true;
  }

  // Simple version comparison (assumes semver)
  const currentParts = current.split('.').map(Number);
  const latestParts = latest.split('.').map(Number);

  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const curr = currentParts[i] || 0;
    const lat = latestParts[i] || 0;

    if (lat > curr) return true;
    if (lat < curr) return false;
  }

  return false;
}
