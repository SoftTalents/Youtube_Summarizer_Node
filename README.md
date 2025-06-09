# SummarAI MCP Server

A Model Context Protocol (MCP) server that provides YouTube video summarization and information retrieval capabilities through the SummarAI API.

## Features

- 🎥 **Summarize YouTube videos** using advanced AI models
- ℹ️ **Get video information** including title, transcript availability, and supported languages
- 📝 **Custom prompts** for tailored summarizations
- ✅ **Smart URL validation** with support for various YouTube URL formats
- 🌐 **Google redirect handling** for complex URL patterns
- 🛡️ **Comprehensive error handling** with detailed feedback
- 🔌 **Easy integration** with Claude Desktop, Cursor, VS Code, and other MCP clients
- 📦 **Zero-installation** setup with npx - no global installation needed!
- 🚀 **Latest API integration** with direct backend connectivity

## Quick Start with npx

No installation required! Use npx to run directly:

```bash
# Run as MCP server (most common usage)
npx summarai-mcp@latest --mcp

# Show help
npx summarai-mcp@latest --help

# Show version
npx summarai-mcp@latest --version
```

## Installation Options

### Option 1: Use with npx (Recommended) ⭐
```bash
npx summarai-mcp@latest --mcp
```
*Always gets the latest version automatically*

### Option 2: Global Installation
```bash
npm install -g summarai-mcp@latest
summarai-mcp --mcp
```

### Option 3: Local Installation
```bash
npm install summarai-mcp@latest
npx summarai-mcp --mcp
```

## MCP Client Configuration

### Claude Desktop Setup

Add the following to your Claude Desktop configuration file (`~/claude_desktop_config.json`):

**Basic Configuration (npx - recommended):**
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

**Advanced Configuration with Custom Endpoints:**
```json
{
  "mcpServers": {
    "SummarAI": {
      "command": "npx",
      "args": ["-y", "summarai-mcp@latest", "--mcp"],
      "env": {
        "API_KEY": "your-api-key-here",
        "YOUTUBE_VIDEO_SUMMARY_API_URL": "https://your-custom-domain.com/api/youtube/summarize",
        "YOUTUBE_VIDEO_INFO_API_URL": "https://your-custom-domain.com/api/youtube/info"
      }
    }
  }
}
```

### Other MCP Clients

The same configuration works with:
- **Cursor Editor** - Add to `.cursor/mcp.json`
- **VS Code** - Add to MCP extension settings
- **Cline Terminal** - Configure in MCP settings
- **Any MCP-compatible client** - Use the same JSON structure

### Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `API_KEY` | ✅ Required | - | Your SummarAI API key from the dashboard |
| `YOUTUBE_VIDEO_SUMMARY_API_URL` | ⭕ Optional | `https://summarai-sale-python-backend.onrender.com/api/youtube/summarize` | Custom summarization endpoint |
| `YOUTUBE_VIDEO_INFO_API_URL` | ⭕ Optional | `https://summarai-sale-python-backend.onrender.com/api/youtube/info` | Custom video info endpoint |

> **Getting Your API Key:** Sign up at [SummarAI](https://www.summarai.top/) to get your API key from the dashboard.

### Command Line Options

```bash
npx summarai-mcp@latest [options]

Options:
  --mcp, --server    Run as MCP server (default)
  --help, -h         Show help message
  --version, -v      Show version number
```

## Available Tools

### 1. `get_youtube_video_info`

Get detailed information about a YouTube video before processing it.

**Purpose:** Check if a video has transcripts available and get basic metadata.

**Parameters:**
- `youtube_video_url` (required): A valid YouTube video URL

**Supported URL Formats:**
- Standard: `https://www.youtube.com/watch?v=VIDEO_ID`
- With timestamp: `https://www.youtube.com/watch?v=VIDEO_ID&t=120s`
- Short URLs: `https://youtu.be/VIDEO_ID`
- Google redirects: `https://www.google.com/url?...&url=https://www.youtube.com/...`

**Example Usage:**
```
"Can you get information about this YouTube video: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

**Response Format:**
```markdown
# YouTube Video Information

**Video Title:** Rick Astley - Never Gonna Give You Up (Official Music Video)
**Video ID:** dQw4w9WgXcQ
**Transcript Available:** Yes
**Available Languages:** en, en-US

✅ This video has transcripts available and can be summarized.
```

### 2. `summarize_youtube_video`

Generate AI-powered summaries of YouTube videos with transcript support.

**Parameters:**
- `youtube_video_url` (required): A valid YouTube video URL
- `custom_prompt` (optional): Custom prompt for tailored summarization

**Example Usage:**
```
"Please summarize this video: https://www.youtube.com/watch?v=dQw4w9WgXcQ"
```

**With Custom Prompt:**
```
"Summarize this educational video focusing on key learning points: [URL]"
```

**Response Format:**
```markdown
# YouTube Video Summary

**Video Title:** Rick Astley - Never Gonna Give You Up (Official Music Video)
**Video ID:** dQw4w9WgXcQ
**Transcript Length:** 1432 characters

## Summary

This music video features Rick Astley performing his hit song "Never Gonna Give You Up"...
```

## Workflow Examples

### Check Then Summarize
```
1. "Get info about this video first: https://youtu.be/VIDEO_ID"
2. "If transcripts are available, please summarize it"
```

### Batch Processing
```
"Check these videos and summarize the ones with transcripts:
- https://www.youtube.com/watch?v=VIDEO_ID1
- https://youtu.be/VIDEO_ID2
- https://www.youtube.com/watch?v=VIDEO_ID3"
```

### Educational Content
```
"Get info about this tutorial video and create a study guide summary: [URL]"
```

## Error Handling

The server provides detailed error messages for common scenarios:

### Authentication Errors
- `Error: API_KEY environment variable is not set` → Configure your API key
- `Authentication failed. Please check your API key` → Verify API key is correct

### URL Validation Errors  
- `Invalid YouTube URL format` → Use a valid YouTube URL
- `Could not extract video ID` → Check URL format and try standard YouTube URL

### Video Processing Errors
- `Failed to retrieve transcript` → Video doesn't have captions/transcripts
- `Rate limit exceeded` → Wait and try again, or upgrade your plan
- `Server error` → Temporary service issue, try again later

### Network Errors
- `Network error: Unable to connect` → Check internet connection
- `Request timed out` → Try again, video might be too long

## Troubleshooting

### Common Issues

**1. MCP Server Not Starting**
```bash
# Check if you're using latest version
npx summarai-mcp@latest --version

# Clear npx cache and try again
npx clear-npx-cache
npx summarai-mcp@latest --mcp
```

**2. API Key Issues**
- Ensure API key is set in your MCP client configuration
- Get your API key from [SummarAI Dashboard](https://www.summarai.top/)
- Check for extra spaces or characters in the API key

**3. Video Not Processing**
- Use `get_youtube_video_info` first to check if transcripts are available
- Try different URL formats (standard YouTube URL works best)
- Ensure video is public and has captions

**4. Configuration File Location**

| Client | Configuration File |
|--------|-------------------|
| Claude Desktop | `~/claude_desktop_config.json` (Mac/Linux)<br>`%APPDATA%\Claude\claude_desktop_config.json` (Windows) |
| Cursor | `.cursor/mcp.json` |
| VS Code | Extension settings |

## Version Information

- **Current Version:** 1.0.8
- **Node.js Requirement:** >= 18.0.0
- **MCP SDK Version:** ^1.0.0

### Recent Updates

**v1.0.8** (Latest)
- ✅ Fixed SummarAI website URL to https://www.summarai.top/
- ✅ Corrected Cursor configuration file path to `.cursor/mcp.json`
- ✅ Updated all documentation links

**v1.0.7**
- ✅ Corrected version information
- ✅ Final documentation polish

**v1.0.6**
- ✅ Updated comprehensive documentation
- ✅ Added detailed troubleshooting guide
- ✅ Enhanced configuration examples
- ✅ Improved workflow examples

**v1.0.5**
- ✅ Added `get_youtube_video_info` tool
- ✅ Enhanced error handling
- ✅ Improved URL validation
- ✅ Better transcript availability checking

**v1.0.4**
- ✅ Enhanced URL processing for Google redirects
- ✅ Improved error messages
- ✅ Better timeout handling

## Development

### Local Development Setup

```bash
# Clone the repository
git clone https://github.com/SoftTalents/Youtube_Summarizer_Node.git
cd Youtube_Summarizer_Node

# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Test the package
npm test
```

### Building and Publishing

```bash
# Build TypeScript
npm run build

# Test the built package
npm run test:package

# Publish to npm (maintainers only)
npm publish
```

## Support

- **Documentation:** [GitHub Repository](https://github.com/SoftTalents/Youtube_Summarizer_Node)
- **Issues:** [GitHub Issues](https://github.com/SoftTalents/Youtube_Summarizer_Node/issues)
- **API Keys:** [SummarAI Dashboard](https://www.summarai.top/)

## License

MIT

---

**Made with ❤️ by SoftTalents**

*Integrate AI-powered YouTube summarization into your workflow with just a few lines of configuration!*
