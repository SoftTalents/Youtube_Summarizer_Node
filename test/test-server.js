#!/usr/bin/env node

// Test script for the SummarAI MCP server
// This script helps verify the functionality before publishing

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing SummarAI MCP Server...\n');

// Check if compiled files exist
const distPath = path.join(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.js');

if (!fs.existsSync(indexPath)) {
  console.error('❌ Error: Compiled files not found. Please run "npm run build" first.');
  process.exit(1);
}

// Test MCP protocol
console.log('📋 Testing MCP protocol compliance...');

const mcpServer = spawn('node', [indexPath], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: {
    ...process.env,
    API_KEY: 'test-key',
    YOUTUBE_VIDEO_SUMMARY_API_URL: 'http://localhost:8000/api/youtube/summarize'
  }
});

let output = '';
let errorOutput = '';

mcpServer.stdout.on('data', (data) => {
  output += data.toString();
});

mcpServer.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

// Test initialize request
const initializeRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'test-client',
      version: '1.0.0'
    }
  }
};

mcpServer.stdin.write(JSON.stringify(initializeRequest) + '\n');

// Test list tools request
setTimeout(() => {
  const listToolsRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  };
  
  mcpServer.stdin.write(JSON.stringify(listToolsRequest) + '\n');
}, 100);

// Close after testing
setTimeout(() => {
  mcpServer.kill('SIGTERM');
  
  console.log('📤 Server stderr output:');
  console.log(errorOutput);
  
  console.log('\n📥 Server stdout output:');
  console.log(output);
  
  // Basic validation
  if (errorOutput.includes('SummarAI MCP server running on stdio')) {
    console.log('\n✅ Server started successfully!');
  } else {
    console.log('\n❌ Server may not have started correctly.');
  }
  
  if (output.includes('summarize_youtube_video')) {
    console.log('✅ Tools are properly registered!');
  } else {
    console.log('❌ Tools may not be registered correctly.');
  }
  
  console.log('\n🎉 Test completed! Review the output above for any issues.');
  
}, 2000);
