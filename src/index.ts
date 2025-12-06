#!/usr/bin/env node
import { Command } from 'commander';
import { initCommand } from './commands/init.js';

const program = new Command();

program
  .name('aicgen')
  .description('AI Config Generator - Automated AI assistant configuration')
  .version('0.1.0');

program
  .command('init')
  .description('Initialize AI configuration in current project')
  .option('-p, --profile <name>', 'Profile to use (basic|balanced|expert)')
  .option('-f, --force', 'Overwrite existing configuration')
  .option('--no-ai', 'Generate without AI (use templates only)')
  .action(initCommand);

program.parse();
