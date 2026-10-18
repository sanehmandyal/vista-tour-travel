// ================================================================
// Comprehensive Contact & Location Migration Script
// Updates Phone Number: 9068888578
// Updates Location: Nawarsi Bazar, Ladwa, Haryana 136132
// ================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const replacements = [
  // Phone numbers
  { from: /\+91 90688 88578/g, to: '+91 90688 88578' },
  { from: /\+91 90688 88578/g, to: '+91 90688 88578' },
  { from: /\+91-90688-88578/g, to: '+91-90688-88578' },
  { from: /\+91-90688-88578/g, to: '+91-90688-88578' },
  { from: /90688 88578/g, to: '90688 88578' },
  { from: /90688 88578/g, to: '90688 88578' },
  { from: /9068888578/g, to: '9068888578' },
  { from: /9068888578/g, to: '9068888578' },

  // Addresses
  { from: /Nawarsi Bazar, Ladwa, Haryana 136132, India/g, to: 'Nawarsi Bazar, Ladwa, Haryana 136132, India' },
  { from: /Nawarsi Bazar, Ladwa, Haryana 136132/g, to: 'Nawarsi Bazar, Ladwa, Haryana 136132' },
  { from: /Nawarsi Bazar, Ladwa, Haryana/g, to: 'Nawarsi Bazar, Ladwa, Haryana' },
  { from: /Nawarsi Bazar, Ladwa/g, to: 'Nawarsi Bazar, Ladwa' },

  // Geo coordinates for Ladwa, Kurukshetra, Haryana
  { from: /30\.7232768;\s*76\.6990167/g, to: '29.9943;77.0494' },
  { from: /30\.7232768,\s*76\.6990167/g, to: '29.9943, 77.0494' },
  { from: /"latitude":\s*30\.7232768/g, to: '"latitude": 29.9943' },
  { from: /"longitude":\s*76\.6990167/g, to: '"longitude": 77.0494' },

  // Region & Placename for SEO
  { from: /"geo\.region" content="IN-PB"/g, to: '"geo.region" content="IN-HR"' },
  { from: /"geo\.placename" content="Mohali, Punjab"/g, to: '"geo.placename" content="Ladwa, Kurukshetra, Haryana"' },

  // Google Maps URL
  { from: /https:\/\/www\.google\.com\/maps\?cid=2473238779693105097/g, to: 'https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132' },
  { from: /https:\/\/maps\.google\.com\/\?cid=2473238779693105097/g, to: 'https://www.google.com/maps?q=Nawarsi+Bazar,+Ladwa,+Haryana+136132' },
];

let totalReplacements = 0;
let modifiedFiles = 0;

function processDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== 'dist' && entry.name !== '.git') {
        processDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name);
      if (['.js', '.jsx', '.json', '.html', '.md', '.env', '.example'].includes(ext) || entry.name.startsWith('.env')) {
        let content = fs.readFileSync(fullPath, 'utf8');
        let fileChanged = false;

        for (const { from, to } of replacements) {
          const matches = content.match(from);
          if (matches) {
            totalReplacements += matches.length;
            content = content.replace(from, to);
            fileChanged = true;
          }
        }

        if (fileChanged) {
          fs.writeFileSync(fullPath, content, 'utf8');
          modifiedFiles++;
          console.log(`[Updated] ${path.relative(rootDir, fullPath)}`);
        }
      }
    }
  }
}

console.log('Starting global contact and location migration...');
processDirectory(rootDir);
console.log(`\nMigration completed: ${totalReplacements} replacements made across ${modifiedFiles} files.`);
