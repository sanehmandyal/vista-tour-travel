// ================================================================
// Smart Monorepo Production Build Script
// Ensures smooth, reliable builds across Render, Vercel & Local
// ================================================================

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const isVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);

console.log('----------------------------------------------------');
console.log('🚀 Vista Tour & Travels - Monorepo Build Triggered');
console.log(`   Target Platform: ${isVercel ? 'Vercel (Frontend)' : 'Render / Server Backend'}`);
console.log('----------------------------------------------------');

if (isVercel) {
  // On Vercel: Build client for production distribution
  console.log('[Vercel Build] Building Vite client for production...');
  try {
    execSync('npm --prefix client run build', {
      cwd: rootDir,
      stdio: 'inherit'
    });
    console.log('[Vercel Build] Frontend build succeeded.');
  } catch (err) {
    console.error('[Vercel Build Error]', err.message);
    process.exit(1);
  }
} else {
  // On Render or standalone backend server: Backend API only.
  // Never run Vite client build here to prevent 512MB RAM OOM crash.
  console.log('[Backend Build] Verifying server dependencies...');
  try {
    execSync('npm --prefix server install --production --no-audit --no-fund', {
      cwd: rootDir,
      stdio: 'inherit'
    });
    console.log('[Backend Build] Backend ready for start: node server/server.js');
  } catch (err) {
    console.error('[Backend Build Error]', err.message);
    process.exit(1);
  }
}

