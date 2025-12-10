#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init.js';
import { statsCommand } from './commands/stats.js';
import { updateCommand } from './commands/update.js';
import { addGuidelineCommand } from './commands/add-guideline.js';
import { showBanner } from './utils/banner.js';
import { CONFIG } from './config.js';

const program = new Command();

// Show banner before help or when no command given
if (process.argv.length === 2 || process.argv.includes('-h') || process.argv.includes('--help')) {
  showBanner();
}

program
  .name(CONFIG.APP_NAME)
  .description('Generate tailored coding guidelines for AI assistants')
  .version(CONFIG.APP_VERSION);

program
  .command('init')
  .description('Initialize AI configuration in current project')
  .option('-a, --assistant <name>', 'AI assistant (claude-code|copilot|antigravity)')
  .option('-l, --level <level>', 'Instruction level (basic|standard|expert|full)')
  .option('--architecture <type>', 'Architecture (modular-monolith|microservices|refactor|layered)')
  .option('-f, --force', 'Overwrite existing configuration')
  .option('--dry-run', 'Preview files without writing')
  .action(initCommand);

program
  .command('stats')
  .description('Show statistics about available guidelines')
  .action(statsCommand);

program
  .command('update')
  .description('Update guidelines from GitHub')
  .option('-f, --force', 'Force update even if already up to date')
  .action(updateCommand);

program
  .command('add-guideline')
  .description('Add a custom guideline interactively')
  .action(addGuidelineCommand);

program.parse();
