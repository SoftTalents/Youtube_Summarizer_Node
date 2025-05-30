#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🧪 Testing summarai-mcp package...\n');

const projectRoot = path.join(__dirname, '..');

try {
  // Test 1: Build the project
  console.log('1️⃣ Testing build...');
  execSync('npm run build', { cwd: projectRoot, stdio: 'inherit' });
  console.log('✅ Build successful\n');

  // Test 2: Test help command
  console.log('2️⃣ Testing help command...');
  const helpOutput = execSync('node dist/index.js --help', { cwd: projectRoot, encoding: 'utf8' });
  if (helpOutput.includes('SummarAI MCP Server')) {
    console.log('✅ Help command works\n');
  } else {
    throw new Error('Help command output unexpected');
  }

  // Test 3: Test version command
  console.log('3️⃣ Testing version command...');
  const versionOutput = execSync('node dist/index.js --version', { cwd: projectRoot, encoding: 'utf8' });
  if (versionOutput.includes('summarai-mcp v')) {
    console.log('✅ Version command works\n');
  } else {
    throw new Error('Version command output unexpected');
  }

  // Test 4: Test npm pack
  console.log('4️⃣ Testing npm pack...');
  execSync('npm pack', { cwd: projectRoot, stdio: 'inherit' });
  console.log('✅ npm pack successful\n');

  // Test 5: Test npm publish --dry-run
  console.log('5️⃣ Testing npm publish --dry-run...');
  execSync('npm publish --dry-run', { cwd: projectRoot, stdio: 'inherit' });
  console.log('✅ npm publish --dry-run successful\n');

  console.log('🎉 All tests passed! Your package is ready to publish.\n');
  console.log('📚 Next steps:');
  console.log('1. Update repository URLs in package.json');
  console.log('2. Run: npm login');
  console.log('3. Run: npm publish');
  console.log('4. Test with: npx summarai-mcp --help');

} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}
