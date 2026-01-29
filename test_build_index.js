#!/usr/bin/env node
// test_build_index.js - Tests for build_index.js URL generation

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const testDir = path.join(__dirname, 'test-temp');
const testAllDir = path.join(testDir, 'all');
const testLibraryDir = path.join(testDir, 'library');

// Cleanup function
function cleanup() {
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true });
  }
}

// Setup test directory structure
function setup() {
  cleanup();
  fs.mkdirSync(testAllDir, { recursive: true });
  fs.mkdirSync(testLibraryDir, { recursive: true });
}

// Test 1: File with permalink frontmatter
function testPermalink() {
  console.log('Test 1: File with permalink frontmatter...');
  const content = `---
title: Test Page
permalink: /test-permalink/
---
# Test Content`;
  
  fs.writeFileSync(path.join(testAllDir, 'test.md'), content);
  
  // Run build_index.js in test directory
  process.chdir(testDir);
  execSync('node ../build_index.js', { stdio: 'inherit' });
  
  const index = JSON.parse(fs.readFileSync(path.join(testLibraryDir, 'search_index.json'), 'utf8'));
  const entry = index.find(e => e.title === 'Test Page');
  
  if (!entry) {
    throw new Error('Test 1 FAILED: Entry not found');
  }
  
  if (entry.url !== '/library/test-permalink/') {
    throw new Error(`Test 1 FAILED: Expected /library/test-permalink/ but got ${entry.url}`);
  }
  
  console.log('✓ Test 1 PASSED: Permalink has /library prefix');
}

// Test 2: File with url frontmatter
function testUrl() {
  console.log('Test 2: File with url frontmatter...');
  cleanup();
  setup();
  process.chdir(testDir);
  
  fs.writeFileSync(path.join(testAllDir, 'test.md'), `---
title: Test Page
url: /test-url/
---
# Test Content`);
  
  execSync('node ../build_index.js', { stdio: 'inherit' });
  
  const index = JSON.parse(fs.readFileSync(path.join(testLibraryDir, 'search_index.json'), 'utf8'));
  const entry = index.find(e => e.title === 'Test Page');
  
  if (entry.url !== '/library/test-url/') {
    throw new Error(`Test 2 FAILED: Expected /library/test-url/ but got ${entry.url}`);
  }
  
  console.log('✓ Test 2 PASSED: URL has /library prefix');
}

// Test 3: File without frontmatter
function testNoFrontmatter() {
  console.log('Test 3: File without frontmatter...');
  cleanup();
  setup();
  process.chdir(testDir);
  
  fs.writeFileSync(path.join(testAllDir, 'test.md'), '# Test Page\n\nSome content');
  
  execSync('node ../build_index.js', { stdio: 'inherit' });
  
  const index = JSON.parse(fs.readFileSync(path.join(testLibraryDir, 'search_index.json'), 'utf8'));
  const entry = index.find(e => e.title === 'Test Page');
  
  if (!entry.url.startsWith('/library/')) {
    throw new Error(`Test 3 FAILED: URL ${entry.url} doesn't start with /library/`);
  }
  
  console.log('✓ Test 3 PASSED: Generated URL has /library prefix');
}

// Run tests
const originalDir = process.cwd();

try {
  setup();
  process.chdir(testDir);
  testPermalink();
  
  process.chdir(originalDir);
  testUrl();
  
  process.chdir(originalDir);
  testNoFrontmatter();
  
  console.log('\n✅ All tests passed!');
} catch (error) {
  console.error('\n❌', error.message);
  process.exit(1);
} finally {
  // Always restore directory and cleanup, even if tests fail
  try {
    process.chdir(originalDir);
  } catch (e) {
    // Already in original directory
  }
  
  try {
    cleanup();
  } catch (e) {
    console.warn('Warning: cleanup failed:', e.message);
  }
}
