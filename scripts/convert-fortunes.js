#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const INPUT_FILE = path.join(__dirname, '../src/data/exported-wp-fortunes.xml');
const OUTPUT_FILE = path.join(__dirname, '../src/data/converted-wp-fortunes.csv');
const FORCE_FLAG = process.argv.includes('--force');

// Check if output file exists
if (fs.existsSync(OUTPUT_FILE) && !FORCE_FLAG) {
  console.error(`\n⚠️  ${OUTPUT_FILE} already exists.`);
  console.error('Use --force flag to overwrite: pnpm convert-fortunes -- --force\n');
  process.exit(1);
}

// Read XML file
let xmlContent;
try {
  xmlContent = fs.readFileSync(INPUT_FILE, 'utf-8');
} catch (err) {
  console.error(`❌ Error reading ${INPUT_FILE}:`, err.message);
  process.exit(1);
}

// Extract fortune items from XML
const itemPattern = /<item>[\s\S]*?<\/item>/g;
const items = xmlContent.match(itemPattern) || [];

if (items.length === 0) {
  console.error('❌ No items found in XML file');
  process.exit(1);
}

// Helper to extract CDATA content
const extractCDATA = (str) => {
  const match = str.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return match ? match[1] : str;
};

// Parse each item
const fortunes = items.map((item) => {
  const titleMatch = item.match(/<title>(<!\[CDATA\[[\s\S]*?\]\]>)?([^<]*)<\/title>/);
  const idMatch = item.match(/<wp:post_id>(\d+)<\/wp:post_id>/);
  const dateMatch = item.match(/<wp:post_date>(<!\[CDATA\[([\s\S]*?)\]\]>)<\/wp:post_date>/);
  const slugMatch = item.match(/<wp:post_name>(<!\[CDATA\[([\s\S]*?)\]\]>)<\/wp:post_name>/);

  let titleText = '';
  if (titleMatch) {
    if (titleMatch[1]) {
      // Has CDATA
      titleText = extractCDATA(titleMatch[1]);
    } else {
      // Plain text
      titleText = titleMatch[2];
    }
  }

  let dateText = '';
  if (dateMatch) {
    dateText = dateMatch[2].split(' ')[0]; // Extract just the date part
  }

  let slugText = '';
  if (slugMatch) {
    slugText = slugMatch[2];
  }

  return {
    id: idMatch ? idMatch[1] : '',
    text: titleText.replace(/"/g, '""'), // Escape quotes for CSV
    date: dateText,
    slug: slugText,
  };
}).filter(f => f.text); // Filter out empty fortunes

if (fortunes.length === 0) {
  console.error('❌ No valid fortunes extracted');
  process.exit(1);
}

// Generate CSV
const header = 'id,text,date,slug\n';
const rows = fortunes.map(f => `${f.id},"${f.text}","${f.date}","${f.slug}"`).join('\n');
const csv = header + rows;

// Write CSV file
try {
  fs.writeFileSync(OUTPUT_FILE, csv, 'utf-8');
  console.log(`✅ Successfully converted ${fortunes.length} fortunes to ${OUTPUT_FILE}`);
} catch (err) {
  console.error(`❌ Error writing ${OUTPUT_FILE}:`, err.message);
  process.exit(1);
}
