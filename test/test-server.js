#!/usr/bin/env node

// Improved test script for the SummarAI MCP server
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

console.log('✅ Compiled files found');
console.log('📋 Testing server startup...');

// Test with environment variables
const mcpServer = spawn('node', [indexPath], {
  stdio: ['pipe', 'pipe', 'inherit'], // inherit stderr to see logs immediately
  env: {
    ...process.env,
    API_KEY: 'test-key-123',
    YOUTUBE_VIDEO_SUMMARY_API_URL: 'http://localhost:8000/api/youtube/summarize'
  }
});

let output = '';
let responseCount = 0;

mcpServer.stdout.on('data', (data) => {
  const str = data.toString();
  output += str;
  
  // Check for responses
  if (str.includes('"id":')) {
    responseCount++;
  }
  
  console.log('📥 Received:', str.trim());
});

mcpServer.on('error', (error) => {
  console.error('❌ Process error:', error);
});

// Send initialization request
setTimeout(() => {
  console.log('📤 Sending initialize request...');
  const initRequest = {
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
  
  mcpServer.stdin.write(JSON.stringify(initRequest) + '\n');
}, 500);

// Send tools list request
setTimeout(() => {
  console.log('📤 Sending tools/list request...');
  const toolsRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  };
  
  mcpServer.stdin.write(JSON.stringify(toolsRequest) + '\n');
}, 1000);

// Clean up after test
setTimeout(() => {
  console.log('\n🔍 Test Results:');
  console.log(`📊 Responses received: ${responseCount}`);
  
  if (output.includes('summarize_youtube_video')) {
    console.log('✅ Tool "summarize_youtube_video" found in response');
  } else {
    console.log('❌ Tool "summarize_youtube_video" NOT found in response');
  }
  
  if (output.includes('"result"')) {
    console.log('✅ Server responding to requests properly');
  } else {
    console.log('❌ Server may not be responding properly');
  }
  
  console.log('\n🎉 Test completed!');
  
  mcpServer.kill('SIGTERM');
  process.exit(0);
}, 3000);

// Handle process termination
process.on('SIGINT', () => {
  mcpServer.kill('SIGTERM');
  process.exit(0);
});
