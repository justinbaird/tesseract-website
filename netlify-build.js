#!/usr/bin/env node

// Custom build script for Netlify to handle environment differences
const { spawn } = require('child_process');

console.log('Starting Netlify build...');

// Set environment variables to prevent database calls during build
process.env.NETLIFY_BUILD = 'true';
process.env.SKIP_DATA_FETCHING = 'true';

// Run the build
const build = spawn('npm', ['run', 'build'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    NETLIFY_BUILD: 'true',
    SKIP_DATA_FETCHING: 'true'
  }
});

build.on('close', (code) => {
  console.log(`Build process exited with code ${code}`);
  process.exit(code);
});

build.on('error', (error) => {
  console.error('Build error:', error);
  process.exit(1);
});
