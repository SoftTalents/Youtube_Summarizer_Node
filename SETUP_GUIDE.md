# Step-by-Step Guide: Building and Publishing SummarAI MCP Server

## Prerequisites

1. **Install Node.js** (version 18 or higher)
   - Download from https://nodejs.org/
   - Verify installation: `node --version` and `npm --version`

2. **Create npm account** (if you don't have one)
   - Go to https://www.npmjs.com/
   - Sign up for an account
   - Verify your email address

## Step 1: Setup the Project

```bash
# Navigate to the project directory
cd "C:\Users\Administrator\Work\MCP_Youtube_Node_Summarizer"

# Install dependencies
npm install

# Install global dependencies for development
npm install -g tsx typescript
```

## Step 2: Build the Project

```bash
# Compile TypeScript to JavaScript
npm run build
```

This creates the `dist/` folder with compiled JavaScript files.

## Step 3: Test the Server Locally

```bash
# Test the MCP server
node test/test-server.js
```

You should see output indicating the server starts correctly and tools are registered.

## Step 4: Test with a Real MCP Client (Optional)

If you want to test with Claude locally before publishing:

1. Create a test configuration file `test-config.json`:
```json
{
  "mcpServers": {
    "SummarAI": {
      "command": "node",
      "args": ["C:\\Users\\Administrator\\Work\\MCP_Youtube_Node_Summarizer\\dist\\index.js"],
      "env": {
        "API_KEY": "your-actual-api-key",
        "YOUTUBE_VIDEO_SUMMARY_API_URL": "http://localhost:8000/api/youtube/summarize"
      }
    }
  }
}
```

## Step 5: Prepare for Publishing

### Update package.json metadata:
```bash
# Edit package.json and update:
# - "author": "Your Name <your.email@example.com>"
# - "repository": "https://github.com/yourusername/summarai-mcp"
# - "homepage": "https://github.com/yourusername/summarai-mcp"
# - "bugs": "https://github.com/yourusername/summarai-mcp/issues"
```

### Verify files are correct:
```bash
# Check what will be published
npm pack --dry-run
```

## Step 6: Login to npm

```bash
# Login to your npm account
npm login
```

Enter your npm username, password, and email when prompted.

## Step 7: Publish to npm

```bash
# Publish the package
npm publish
```

If the name `summarai-mcp` is taken, you might need to:
1. Change the name in `package.json` to something like `@yourusername/summarai-mcp`
2. Or choose a different unique name

## Step 8: Verify Publication

```bash
# Check if your package is available
npm view summarai-mcp
```

## Step 9: Test Installation

```bash
# Test installing your published package
npx summarai-mcp@1.0.0
```

## Step 10: Update Claude Configuration

Now you can use your published package in Claude:

```json
{
  "mcpServers": {
    "SummarAI": {
      "command": "npx",
      "args": ["-y", "summarai-mcp@1.0.0"],
      "env": {
        "API_KEY": "your-actual-api-key",
        "YOUTUBE_VIDEO_SUMMARY_API_URL": "https://your-domain.com/api/youtube/summarize"
      }
    }
  }
}
```

## Troubleshooting

### Common Issues:

1. **Build fails**: Check if TypeScript is installed globally: `npm install -g typescript`

2. **Permission errors**: On Windows, you might need to run Command Prompt as Administrator

3. **Package name already exists**: Change the name in package.json to something unique

4. **npm login fails**: Make sure you've verified your email address on npmjs.com

5. **API key issues**: Ensure your API key is valid and has the necessary permissions

### Version Updates:

To publish updates:
```bash
# Update version number
npm version patch  # for bug fixes
npm version minor  # for new features
npm version major  # for breaking changes

# Rebuild and publish
npm run build
npm publish
```

## Security Notes

- Never commit your actual API keys to version control
- Use environment variables for sensitive configuration
- Consider using scoped packages (@yourname/package-name) for better namespace management

## Next Steps

1. Create a GitHub repository for your project
2. Add proper documentation and examples
3. Set up automated testing and CI/CD
4. Consider adding more features like batch processing or different output formats
