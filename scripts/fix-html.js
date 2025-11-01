#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

try {
  const htmlPath = join('dist', 'index.html');
  let content = readFileSync(htmlPath, 'utf8');
  
  // Replace the module script with bundle.js
  content = content.replace(
    /type="module" src="js\/main\.js"/g,
    'src="bundle.js"'
  );
  
  writeFileSync(htmlPath, content, 'utf8');
  console.log('✅ HTML file updated successfully');
} catch (error) {
  console.error('❌ Error updating HTML file:', error.message);
  process.exit(1);
}