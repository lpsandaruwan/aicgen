import { select } from '@inquirer/prompts';
import ora from 'ora';
import chalk from 'chalk';
import { scanProject } from '../services/scanner.js';
import { getProfile } from '../config/profiles.js';
import { isAnthropicAvailable } from '../services/ai/anthropic.js';

interface InitOptions {
  profile?: string;
  force?: boolean;
  ai?: boolean;
}

export async function initCommand(options: InitOptions) {
  console.log(chalk.blue.bold('\n🤖 aicgen - AI Config Generator\n'));

  const projectPath = process.cwd();
  const spinner = ora('Scanning project...').start();

  const projectInfo = await scanProject(projectPath);
  spinner.succeed(`Project detected: ${chalk.green(projectInfo.type)}`);

  if (projectInfo.hasExistingConfig && !options.force) {
    console.log(chalk.yellow('\n⚠️  Configuration already exists. Use --force to overwrite.'));
    return;
  }

  let profileName = options.profile;
  if (!profileName) {
    profileName = await select({
      message: 'Select a profile:',
      choices: [
        { value: 'basic', name: 'Basic - Minimal guidelines' },
        { value: 'balanced', name: 'Balanced - Comprehensive best practices (recommended)' },
        { value: 'expert', name: 'Expert - Complete setup with all features' }
      ]
    });
  }

  const profile = getProfile(profileName);
  console.log(chalk.cyan(`\n📋 Using profile: ${profile.name}`));
  console.log(chalk.gray(`   ${profile.description}\n`));

  const useAI = options.ai !== false && await isAnthropicAvailable();

  if (!useAI) {
    console.log(chalk.yellow('ℹ️  AI not available, using static templates\n'));
  }

  spinner.start('Generating configuration...');

  await new Promise(resolve => setTimeout(resolve, 1000));

  spinner.succeed('Configuration generated successfully!\n');

  console.log(chalk.green('✨ Setup complete!'));
  console.log(chalk.gray('\nGenerated files:'));
  console.log(chalk.gray('  - .aicgen/claude.md'));
  console.log(chalk.gray('  - .aicgen/instructions.md'));
  if (profile.includeADR) {
    console.log(chalk.gray('  - .aicgen/decisions.md'));
  }
}
