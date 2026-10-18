// ================================================================
// Cross-Platform Dependency Installer for Vista Tour & Travels
// Works seamlessly on Windows, macOS, and Linux
// ================================================================

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const runCommand = (command, args, cwd) => {
  return new Promise((resolve, reject) => {
    const isWindows = process.platform === 'win32';
    const executable = isWindows ? `${command}.cmd` : command;

    console.log(`\n[Run] ${command} ${args.join(' ')} in ${cwd}`);
    const proc = spawn(executable, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });

    proc.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command ${command} failed with exit code ${code}`));
      }
    });

    proc.on('error', (err) => {
      reject(err);
    });
  });
};

const installAll = async () => {
  try {
    console.log('====================================================');
    console.log(' Installing Dependencies for Vista Tour and Travels ');
    console.log('====================================================');

    // 1. Install Server Dependencies
    const serverDir = path.join(rootDir, 'server');
    await runCommand('npm', ['install', '--no-audit', '--no-fund'], serverDir);

    // 2. Install Client Dependencies
    const clientDir = path.join(rootDir, 'client');
    await runCommand('npm', ['install', '--legacy-peer-deps', '--no-audit', '--no-fund'], clientDir);

    console.log('\n====================================================');
    console.log(' ✅ All client and server dependencies installed!');
    console.log('====================================================\n');
  } catch (error) {
    console.error('\n❌ Installation failed:', error.message);
    process.exit(1);
  }
};

installAll();
