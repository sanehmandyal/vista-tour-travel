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

const isRender = Boolean(process.env.RENDER || process.env.RENDER_SERVICE_ID || process.env.IS_RENDER);
const isVercel = Boolean(process.env.VERCEL || process.env.VERCEL_ENV);

console.log('----------------------------------------------------');
console.log('🚀 Vista Tour & Travels - Monorepo Build Triggered');
console.log(`   Target Platform: ${isRender ? 'Render (Backend Web Service)' : (isVercel ? 'Vercel (Frontend)' : 'Local / Standard')}`);
console.log('----------------------------------------------------');

if (isRender) {
  // On Render: Backend API only.
  // Running Vite + Tailwind + Client npm install in 512MB RAM causes heap OOM crash.
  // Server dependencies are installed directly so Render builds in ~10 seconds.
  console.log('[Render] Verifying server dependencies...');
  try {
    execSync('npm --prefix server install --production --no-audit --no-fund', {
      cwd: rootDir,
      stdio: 'inherit'
    });
    console.log('[Render] Backend ready for start: node server/server.js');
  } catch (err) {
    console.error('[Render Build Error]', err.message);
    process.exit(1);
  }
} else {
  // On Vercel or local: Build client for production distribution
  console.log('[Client Build] Building Vite client for production...');
  try {
    execSync('npm --prefix client run build', {
      cwd: rootDir,
      stdio: 'inherit'
    });
    console.log('[Client Build] Frontend build succeeded.');
  } catch (err) {
    console.error('[Client Build Error]', err.message);
    process.exit(1);
  }
}
