# Publishing Guide for summarai-mcp

## Prerequisites

1. **npm account**: Create an account at https://www.npmjs.com/
2. **npm CLI**: Make sure you have npm installed and are logged in:
   ```bash
   npm login
   ```

## Pre-Publishing Checklist

### 1. Update package.json
- [ ] Set the correct version number
- [ ] Update repository URLs (replace with your actual GitHub repository)
- [ ] Verify author information
- [ ] Check keywords are relevant

### 2. Build and Test
```bash
# Build the project
npm run build

# Test the built version
node dist/index.js --help
node dist/index.js --version

# Test with npm pack (creates a tarball without publishing)
npm pack
```

### 3. Check package contents
```bash
# See what files will be included in the package
npm publish --dry-run
```

## Publishing Steps

### 1. First-time Publishing
```bash
# Make sure you're logged in
npm whoami

# Build the project
npm run build

# Publish to npm (this will also run prepublishOnly script)
npm publish
```

### 2. Publishing Updates
```bash
# Update version number
npm version patch  # for bug fixes
npm version minor  # for new features
npm version major  # for breaking changes

# Build and publish
npm run build
npm publish
```

## After Publishing

### Test the published package
```bash
# Test npx installation
npx summarai-mcp@latest --help

# Test global installation
npm install -g summarai-mcp@latest
summarai-mcp --version
```

### Test with Claude Desktop
Add to your Claude Desktop configuration:
```json
{
  "mcpServers": {
    "SummarAI": {
      "command": "npx",
      "args": ["-y", "summarai-mcp@latest", "--mcp"],
      "env": {
        "API_KEY": "your-api-key-here"
      }
    }
  }
}
```

## Package URLs (after publishing)
- npm: https://www.npmjs.com/package/summarai-mcp
- GitHub: https://github.com/yourusername/summarai-mcp

## Troubleshooting

### Common Issues
1. **Permission denied**: Make sure you're logged into npm with `npm login`
2. **Package name taken**: Choose a different name in package.json
3. **Version already exists**: Increment version number with `npm version patch`

### Checking package status
```bash
# Check if package name is available
npm view summarai-mcp

# Check your published versions
npm view summarai-mcp versions --json
```
