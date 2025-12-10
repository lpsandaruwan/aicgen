import { extract } from 'tar';
import { mkdir, writeFile, readdir, cp } from 'fs/promises';
import { join } from 'path';
import { homedir } from 'os';

const url = 'https://api.github.com/repos/lpsandaruwan/aicgen-docs/tarball/0.1.0';

console.log('Downloading tarball...');
const response = await fetch(url);
const tarballBuffer = Buffer.from(await response.arrayBuffer());

const testDir = join(homedir(), '.aicgen-test');
await mkdir(testDir, { recursive: true });

const tarballPath = join(testDir, 'test.tar.gz');
await writeFile(tarballPath, tarballBuffer);

console.log('Extracting...');
await extract({ file: tarballPath, cwd: testDir });

console.log('Listing extracted contents:');
const entries = await readdir(testDir);
console.log(entries);

const rootDir = entries.find(e => e.startsWith('lpsandaruwan-aicgen-docs-'));
if (rootDir) {
  const extractedPath = join(testDir, rootDir);
  const extracted = await readdir(extractedPath);
  console.log('\nFiles in extracted directory:');
  console.log(extracted);
}
