import chalk from 'chalk';

export function logInfo(message: string): void {
  console.log(chalk.blue(message));
}

export function logSuccess(message: string): void {
  console.log(chalk.green(message));
}

export function logWarning(message: string): void {
  console.log(chalk.yellow(message));
}

export function logError(message: string): void {
  console.log(chalk.red(message));
}

export function logGray(message: string): void {
  console.log(chalk.gray(message));
}
