import decompress from 'decompress';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';
import { execSync } from 'child_process';

const url = 'https://api.github.com/repos/lpsandaruwan/aicgen-docs/tarball/0.1.0';

console.log('Downloading tarball...');
const response = await fetch(url);
const tarballBuffer = Buffer.from(await response.arrayBuffer());

const testDir = join(homedir(), '.aicgen-test3');
await mkdir(testDir, { recursive: true });

const tarballPath = join(testDir, 'test.tar.gz');
await writeFile(tarballPath, tarballBuffer);

console.log('Extracting with decompress...');
await decompress(tarballPath, testDir);

console.log('Checking files...');
const result = execSync(`cd "${testDir}" && find . -type f | wc -l`).toString().trim();
console.log(`Total files extracted: ${result}`);

const result2 = execSync(`cd "${testDir}" && ls`).toString().trim();
console.log('Extracted contents:', result2);
