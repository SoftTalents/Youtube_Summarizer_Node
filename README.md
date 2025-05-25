# SummarAI MCP Server

A Model Context Protocol (MCP) server that provides YouTube video summarization capabilities through the SummarAI API.

## Features

- Summarize YouTube videos using AI
- Support for custom prompts
- Built-in URL validation
- Comprehensive error handling
- Easy integration with Claude and other MCP clients

## Installation

```bash
npm install -g summarai-mcp
```

## Usage

### With Claude Desktop

Add the following to your Claude Desktop configuration file:

```json
{
  "mcpServers": {
    "SummarAI": {
      "command": "npx",
      "args": ["-y", "summarai-mcp@1.0.0"],
      "env": {
        "API_KEY": "your-api-key-here",
        "YOUTUBE_VIDEO_SUMMARY_API_URL": "https://your-api-domain.com/api/youtube/summarize"
      }
    }
  }
}
```

### Environment Variables

- `API_KEY` (required): Your SummarAI API key
- `YOUTUBE_VIDEO_SUMMARY_API_URL` (optional): API endpoint URL (defaults to http://localhost:8000/api/youtube/summarize)

## Available Tools

### summarize_youtube_video

Summarizes a YouTube video using the SummarAI API.

**Parameters:**
- `youtube_video_url` (required): A valid YouTube video URL
- `custom_prompt` (optional): Custom prompt for summarization

**Example:**
```
Use the summarize_youtube_video tool with:
- youtube_video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
- custom_prompt: "Provide a detailed summary focusing on the main points and key takeaways"
```

## API Response Format

The tool returns a formatted summary including:
- Video title
- Video ID
- Transcript length
- AI-generated summary

## Error Handling

The server provides detailed error messages for common issues:
- Invalid YouTube URLs
- Missing API keys
- Network connectivity problems
- API rate limits
- Server errors

## Development

To run locally:

```bash
git clone <repository>
cd summarai-mcp
npm install
npm run dev
```

To build:

```bash
npm run build
```

## License

MIT
