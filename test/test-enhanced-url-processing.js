#!/usr/bin/env node

/**
 * Test script for enhanced YouTube URL processing in Node.js MCP server
 */

// Import the enhanced server class from built dist folder
const { SummarAIMCPServer } = require('../dist/server');

// Create test URLs
const testUrls = [
  {
    name: 'First Google Redirect (Opera Browser)',
    url: 'https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=video&cd=&cad=rja&uact=8&ved=2ahUKEwiJlfvC9OSNAxVISTABHUb4LkUQtwJ6BAgSEAI&url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DWH6J1OhPQIc&usg=AOvVaw2JRiYe-fEnKf_RFXVdQRlr&opi=89978449',
    expectedVideoId: 'WH6J1OhPQIc'
  },
  {
    name: 'Second Google Redirect (Web Search)',
    url: 'https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.youtube.com/watch%3Fv%3DqeSwQYX-sXo&ved=2ahUKEwjF29D97-SNAxX-FmIAHRx4DLMQtwJ6BAgMEAI&usg=AOvVaw18MVqg0BY5kMZoISuNf12P',
    expectedVideoId: 'qeSwQYX-sXo'
  },
  {
    name: 'Direct YouTube URL',
    url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    expectedVideoId: 'dQw4w9WgXcQ'
  },
  {
    name: 'YouTube Short URL',
    url: 'https://youtu.be/dQw4w9WgXcQ',
    expectedVideoId: 'dQw4w9WgXcQ'
  },
  {
    name: 'YouTube Embed URL',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    expectedVideoId: 'dQw4w9WgXcQ'
  }
];

// Mock the console.error for debug logging capture
const originalConsoleError = console.error;
const debugLogs = [];

console.error = (...args) => {
  if (args[0] && args[0].startsWith('[DEBUG]')) {
    debugLogs.push(args.join(' '));
  } else {
    originalConsoleError(...args);
  }
};

function testEnhancedUrlProcessing() {
  console.log('🧪 Testing Enhanced YouTube URL Processing for Node.js MCP Server');
  console.log('=' * 80);
  
  // Create server instance
  const server = new SummarAIMCPServer();
  
  // Access private methods for testing (TypeScript will complain, but it works in JS)
  const extractYouTubeUrlFromRedirect = server.extractYouTubeUrlFromRedirect.bind(server);
  const extractYouTubeVideoId = server.extractYouTubeVideoId.bind(server);
  const validateYouTubeUrl = server.validateYouTubeUrl.bind(server);
  
  let passCount = 0;
  let totalTests = testUrls.length;
  
  testUrls.forEach((testCase, index) => {
    console.log(`\n📋 Test ${index + 1}: ${testCase.name}`);
    console.log(`🔗 URL: ${testCase.url.substring(0, 80)}...`);
    
    debugLogs.length = 0; // Clear previous logs
    
    try {
      // Test URL extraction from redirect
      const extractedUrl = extractYouTubeUrlFromRedirect(testCase.url);
      console.log(`📤 Extracted URL: ${extractedUrl}`);
      
      // Test video ID extraction
      const videoId = extractYouTubeVideoId(testCase.url);
      console.log(`🆔 Video ID: ${videoId}`);
      
      // Test URL validation
      const validation = validateYouTubeUrl(testCase.url);
      console.log(`✅ Validation: ${validation.isValid ? 'PASS' : 'FAIL'}`);
      
      if (validation.cleanUrl) {
        console.log(`🧹 Clean URL: ${validation.cleanUrl}`);
      }
      
      // Check if video ID matches expected
      if (videoId === testCase.expectedVideoId) {
        console.log(`✅ PASS: Video ID matches expected (${testCase.expectedVideoId})`);
        passCount++;
      } else {
        console.log(`❌ FAIL: Expected ${testCase.expectedVideoId}, got ${videoId}`);
      }
      
      // Show debug logs if any
      if (debugLogs.length > 0) {
        console.log(`📝 Debug logs:`);
        debugLogs.forEach(log => console.log(`   ${log}`));
      }
      
    } catch (error) {
      console.log(`❌ ERROR: ${error.message}`);
    }
    
    console.log('-'.repeat(60));
  });
  
  console.log(`\n🎯 Test Results: ${passCount}/${totalTests} tests passed`);
  
  if (passCount === totalTests) {
    console.log('🎉 All tests passed! Enhanced URL processing is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the implementation.');
  }
  
  // Restore original console.error
  console.error = originalConsoleError;
}

// Run the test
if (require.main === module) {
  testEnhancedUrlProcessing();
}

module.exports = { testEnhancedUrlProcessing };
