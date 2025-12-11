import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

export class ProjectContextGatherer {
    private static MAX_FILE_SIZE = 10 * 1024; // 10KB limit for read files
    private static IGNORE_PATTERNS = [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/.next/**',
        '**/.turbo/**',
        '**/coverage/**',
        '**/*.lock',
        '**/*.png',
        '**/*.jpg',
        '**/*.jpeg',
        '**/*.gif',
        '**/*.ico',
        '**/*.svg',
        '**/*.mp4',
        '**/*.mp3',
        '**/*.pdf',
        '**/*.zip',
        '**/*.tar',
        '**/*.gz',
        '**/*.pyc',
    ];

    async gather(projectPath: string) {
        const tree = await this.generateTree(projectPath);
        const files = await this.readKeyFiles(projectPath);

        return {
            tree,
            files
        };
    }

    private async generateTree(projectPath: string): Promise<string> {
        const allFiles = await glob('**/*', {
            cwd: projectPath,
            ignore: ProjectContextGatherer.IGNORE_PATTERNS,
            nodir: false,
            dot: true
        });

        // Limit tree size if too huge?
        const treeLines = allFiles.slice(0, 500).map(f => {
            const depth = f.split('/').length - 1;
            const prefix = '  '.repeat(depth);
            return `${prefix}- ${path.basename(f)}`;
        });

        if (allFiles.length > 500) {
            treeLines.push('  ... (file list truncated)');
        }

        return treeLines.join('\n');
    }

    private async readKeyFiles(projectPath: string): Promise<Record<string, string>> {
        const filesToRead = [
            'package.json',
            'tsconfig.json',
            'jsconfig.json',
            'go.mod',
            'requirements.txt',
            'pyproject.toml',
            'Cargo.toml',
            'mix.exs',
            'composer.json',
            'README.md',
            'src/index.ts',
            'src/main.ts',
            'src/index.js',
            'src/App.tsx',
            'main.go',
            'app.py',
            'Dockerfile'
        ];

        const contents: Record<string, string> = {};

        for (const relativePath of filesToRead) {
            const fullPath = path.join(projectPath, relativePath);
            if (fs.existsSync(fullPath)) {
                try {
                    const stats = fs.statSync(fullPath);
                    if (stats.size > ProjectContextGatherer.MAX_FILE_SIZE) {
                        // Read only first part
                        const handle = fs.openSync(fullPath, 'r');
                        const buffer = Buffer.alloc(ProjectContextGatherer.MAX_FILE_SIZE);
                        fs.readSync(handle, buffer, 0, ProjectContextGatherer.MAX_FILE_SIZE, 0);
                        fs.closeSync(handle);
                        contents[relativePath] = buffer.toString('utf-8') + '\n... (truncated)';
                    } else {
                        contents[relativePath] = fs.readFileSync(fullPath, 'utf-8');
                    }
                } catch (e) {
                    // Ignore read errors
                }
            }
        }

        return contents;
    }
}
