/**
 * Usage: node --env-file=.env.local scripts/upload-hero-image.mjs <IATA> "<image-path>"
 * Example: node --env-file=.env.local scripts/upload-hero-image.mjs YHZ "C:\Users\danca\Downloads\HalifaxAirport.jpg"
 *
 * Requires SUPABASE_SERVICE_KEY in .env.local (already set).
 * Uploads the image to Supabase storage at airports/<iata-lower>/hero.jpg
 * and automatically patches HERO_IMAGE in app/airports/[iata]/page.tsx.
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'fs';
import { extname, join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const PAGE_TSX = join(__dir, '..', 'app', 'airports', '[iata]', 'page.tsx');

const SUPABASE_URL = 'https://ixgbdmrembkrpbkjhtfi.supabase.co';
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY;
if (!SERVICE_KEY) {
  console.error('Missing SUPABASE_SERVICE_KEY. Run with: node --env-file=.env.local scripts/upload-hero-image.mjs ...');
  process.exit(1);
}

const MIME = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.avif': 'image/avif' };

const [,, iataRaw, imagePath] = process.argv;
if (!iataRaw || !imagePath) {
  console.error('Usage: node scripts/upload-hero-image.mjs <IATA> "<image-path>"');
  process.exit(1);
}

const iata    = iataRaw.toUpperCase();
const ext     = extname(imagePath).toLowerCase();
const mime    = MIME[ext] ?? 'image/jpeg';
const storagePath = `airports/${iata.toLowerCase()}/hero.jpg`;

console.log(`\nUploading ${imagePath}`);
console.log(`→ Supabase: lounge-images/${storagePath}`);

const sb = createClient(SUPABASE_URL, SERVICE_KEY);
const buffer = readFileSync(imagePath);

const { error } = await sb.storage
  .from('lounge-images')
  .upload(storagePath, buffer, { contentType: mime, upsert: true });

if (error) {
  console.error('Upload failed:', error.message);
  process.exit(1);
}

const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/lounge-images/${storagePath}`;
console.log(`\n✓ Uploaded: ${publicUrl}`);

// Patch only the HERO_IMAGE record in page.tsx
const src = readFileSync(PAGE_TSX, 'utf8');

// Extract the HERO_IMAGE block boundaries
const blockStart = src.indexOf('const HERO_IMAGE: Record<string, string> = {');
const blockEnd   = src.indexOf('\n}', blockStart) + 2; // include closing }
if (blockStart === -1) {
  console.warn('⚠ Could not find HERO_IMAGE block in page.tsx — add manually:\n  ' + iata + ": '" + publicUrl + "',");
  process.exit(0);
}

const before = src.slice(0, blockStart);
const block  = src.slice(blockStart, blockEnd);
const after  = src.slice(blockEnd);

// Match  YEG: 'old-url'  or  YEG: "old-url"  within the block only
const re = new RegExp(`(\\s+${iata}:\\s*['"])([^'"]+)(['"])`, 'g');

let newBlock;
if (re.test(block)) {
  newBlock = block.replace(re, `$1${publicUrl}$3`);
  writeFileSync(PAGE_TSX, before + newBlock + after, 'utf8');
  console.log(`✓ Updated HERO_IMAGE.${iata} in page.tsx`);
} else {
  // Airport not in map yet — insert before the closing }
  const insertLine = `  ${iata}: '${publicUrl}',`;
  newBlock = block.replace(/\n}$/, `\n${insertLine}\n}`);
  writeFileSync(PAGE_TSX, before + newBlock + after, 'utf8');
  console.log(`✓ Inserted HERO_IMAGE.${iata} into page.tsx`);
}

console.log('\nDone. Redeploy to see the new hero image.\n');
