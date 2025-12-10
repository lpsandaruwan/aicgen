import chalk from 'chalk';

export interface BoxOptions {
  title?: string;
  padding?: number;
  width?: number;
  borderColor?: 'cyan' | 'magenta' | 'gray' | 'white';
}

export function drawBox(content: string[], options: BoxOptions = {}): string {
  const {
    title,
    padding = 1,
    width = 60,
    borderColor = 'cyan'
  } = options;

  const color = {
    cyan: chalk.cyan,
    magenta: chalk.magenta,
    gray: chalk.gray,
    white: chalk.white
  }[borderColor];

  const lines: string[] = [];
  const contentWidth = width - 2;

  // Top border
  if (title) {
    const titleText = ` ${title} `;
    const leftPad = Math.floor((width - titleText.length - 2) / 2);
    const rightPad = width - titleText.length - leftPad - 2;
    lines.push(color('╭' + '─'.repeat(leftPad) + titleText + '─'.repeat(rightPad) + '╮'));
  } else {
    lines.push(color('╭' + '─'.repeat(contentWidth) + '╮'));
  }

  // Padding top
  for (let i = 0; i < padding; i++) {
    lines.push(color('│') + ' '.repeat(contentWidth) + color('│'));
  }

  // Content
  for (const line of content) {
    const stripped = stripAnsi(line);
    const lineWidth = stripped.length;
    const spacesNeeded = contentWidth - lineWidth;
    lines.push(color('│') + line + ' '.repeat(Math.max(0, spacesNeeded)) + color('│'));
  }

  // Padding bottom
  for (let i = 0; i < padding; i++) {
    lines.push(color('│') + ' '.repeat(contentWidth) + color('│'));
  }

  // Bottom border
  lines.push(color('╰' + '─'.repeat(contentWidth) + '╯'));

  return lines.join('\n');
}

export function drawSeparator(width: number = 60, char: string = '─', color: 'cyan' | 'magenta' | 'gray' = 'gray'): string {
  const colorFn = {
    cyan: chalk.cyan,
    magenta: chalk.magenta,
    gray: chalk.gray
  }[color];

  return colorFn(char.repeat(width));
}

export function drawTable(headers: string[], rows: string[][], options: { borderColor?: 'cyan' | 'magenta' | 'gray' } = {}): string {
  const borderColor = options.borderColor || 'cyan';
  const color = {
    cyan: chalk.cyan,
    magenta: chalk.magenta,
    gray: chalk.gray
  }[borderColor];

  // Calculate column widths
  const colWidths = headers.map((header, i) => {
    const headerWidth = stripAnsi(header).length;
    const maxRowWidth = Math.max(...rows.map(row => stripAnsi(row[i] || '').length));
    return Math.max(headerWidth, maxRowWidth) + 2;
  });

  const lines: string[] = [];
  // const totalWidth = colWidths.reduce((sum, w) => sum + w, 0) + colWidths.length + 1;

  // Top border
  lines.push(color('╭' + colWidths.map(w => '─'.repeat(w)).join('┬') + '╮'));

  // Headers
  const headerLine = color('│') + headers.map((h, i) => {
    const stripped = stripAnsi(h);
    const padding = colWidths[i] - stripped.length;
    return h + ' '.repeat(padding);
  }).join(color('│')) + color('│');
  lines.push(headerLine);

  // Header separator
  lines.push(color('├' + colWidths.map(w => '─'.repeat(w)).join('┼') + '┤'));

  // Rows
  for (const row of rows) {
    const rowLine = color('│') + row.map((cell, i) => {
      const stripped = stripAnsi(cell);
      const padding = colWidths[i] - stripped.length;
      return cell + ' '.repeat(padding);
    }).join(color('│')) + color('│');
    lines.push(rowLine);
  }

  // Bottom border
  lines.push(color('╰' + colWidths.map(w => '─'.repeat(w)).join('┴') + '╯'));

  return lines.join('\n');
}

export function padLeft(text: string, width: number, char: string = ' '): string {
  const stripped = stripAnsi(text);
  const padding = Math.max(0, width - stripped.length);
  return char.repeat(padding) + text;
}

export function padRight(text: string, width: number, char: string = ' '): string {
  const stripped = stripAnsi(text);
  const padding = Math.max(0, width - stripped.length);
  return text + char.repeat(padding);
}

export function center(text: string, width: number): string {
  const stripped = stripAnsi(text);
  const padding = Math.max(0, width - stripped.length);
  const leftPad = Math.floor(padding / 2);
  const rightPad = padding - leftPad;
  return ' '.repeat(leftPad) + text + ' '.repeat(rightPad);
}

// Simple ANSI strip function (basic implementation)
function stripAnsi(str: string): string {
  // eslint-disable-next-line no-control-regex
  return str.replace(/\x1b\[[0-9;]*m/g, '');
}

export function createSummaryBox(title: string, items: { label: string; value: string }[]): string {
  const maxLabelWidth = Math.max(...items.map(i => i.label.length));
  const content = items.map(({ label, value }) => {
    const paddedLabel = padRight(chalk.gray(label + ':'), maxLabelWidth + 2);
    return `  ${paddedLabel} ${chalk.white(value)}`;
  });

  return drawBox(content, {
    title,
    padding: 1,
    width: 60,
    borderColor: 'cyan'
  });
}

export function createMetricsBox(metrics: { label: string; value: string | number }[]): string {
  const content = metrics.map(({ label, value }) => {
    return `  ${chalk.gray('•')} ${chalk.white(value)} ${chalk.gray(label)}`;
  });

  return drawBox(content, {
    title: '📊 Configuration Preview',
    padding: 1,
    width: 50,
    borderColor: 'magenta'
  });
}
