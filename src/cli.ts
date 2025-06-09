#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// Parse command line arguments
const args = process.argv.slice(2);

// Check if running as MCP server or CLI
if (args.includes('--mcp') || args.includes('--server')) {
  // Run as MCP server
  const { SummarAIMCPServer } = require('./server');
  const server = new SummarAIMCPServer();
  server.run().catch(console.error);
} else if (args.includes('--help') || args.includes('-h')) {
  // Show help
  console.log(`
SummarAI MCP Server - YouTube Video Summarization

Usage:
  npx summarai-mcp [options]

Options:
  --mcp, --server    Run as MCP server (default)
  --help, -h         Show this help message
  --version, -v      Show version

Environment Variables:
  API_KEY                      Your SummarAI API key (required)
  YOUTUBE_VIDEO_SUMMARY_API_URL    API endpoint URL (optional)

Examples:
  npx summarai-mcp --mcp       # Run as MCP server
  npx summarai-mcp --help      # Show help

For MCP integration with Claude Desktop, add this to your config:
{
  "mcpServers": {
    "SummarAI": {
      "command": "npx",
      "args": ["-y", "summarai-mcp", "--mcp"],
      "env": {
        "API_KEY": "your-api-key-here"
      }
    }
  }
}
`);
} else if (args.includes('--version') || args.includes('-v')) {
  // Show version
  try {
    const packagePath = path.join(__dirname, '../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log(`summarai-mcp v${packageJson.version}`);
  } catch (error) {
    console.log('summarai-mcp v1.0.0');
  }
} else {
  // Default: run as MCP server
  const { SummarAIMCPServer } = require('./server');
  const server = new SummarAIMCPServer();
  server.run().catch(console.error);
}
