#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const axios = require('axios');

// Get API configuration from environment variables
const API_KEY = process.env.API_KEY;
const YOUTUBE_VIDEO_SUMMARY_API_URL = process.env.YOUTUBE_VIDEO_SUMMARY_API_URL || 'http://localhost:8000/api/youtube/summarize';

interface SummarizeVideoParams {
  youtube_video_url: string;
  custom_prompt?: string;
}

interface ApiResponse {
  success: boolean;
  data?: {
    video_id: string;
    title: string;
    transcript_length: number;
    summary: string;
  };
  error?: string;
}

interface Tool {
  name: string;
  description: string;
  inputSchema: any;
}

interface CallToolResult {
  content: Array<{
    type: string;
    text: string;
  }>;
  isError?: boolean;
}

interface TextContent {
  type: 'text';
  text: string;
}

class SummarAIMCPServer {
  private server: any;

  constructor() {
    this.server = new Server(
      {
        name: 'summarai-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    
    // Error handling
    this.server.onerror = (error: any) => console.error('[MCP Error]', error);
    process.on('SIGINT', async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'summarize_youtube_video',
            description: 'Summarize a YouTube video using SummarAI API. Provide a YouTube URL and optionally a custom prompt for the summarization.',
            inputSchema: {
              type: 'object',
              properties: {
                youtube_video_url: {
                  type: 'string',
                  description: 'The YouTube video URL to summarize (must be a valid YouTube URL)',
                },
                custom_prompt: {
                  type: 'string',
                  description: 'Optional custom prompt for the summarization. If not provided, a default prompt will be used.',
                },
              },
              required: ['youtube_video_url'],
            },
          } as Tool,
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request: any) => {
      const { name, arguments: args } = request.params;

      if (name === 'summarize_youtube_video') {
        // Validate and convert args to proper type
        if (!args || typeof args !== 'object') {
          throw new Error('Invalid arguments provided');
        }
        
        const params = args as Record<string, unknown>;
        
        // Validate required parameters
        if (!params.youtube_video_url || typeof params.youtube_video_url !== 'string') {
          throw new Error('youtube_video_url is required and must be a string');
        }
        
        const validatedParams: SummarizeVideoParams = {
          youtube_video_url: params.youtube_video_url,
          custom_prompt: typeof params.custom_prompt === 'string' ? params.custom_prompt : undefined,
        };
        
        return this.handleSummarizeVideo(validatedParams);
      }

      throw new Error(`Unknown tool: ${name}`);
    });
  }

  private async handleSummarizeVideo(params: SummarizeVideoParams): Promise<CallToolResult> {
    const { youtube_video_url, custom_prompt } = params;

    // Validate API key
    if (!API_KEY) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: API_KEY environment variable is not set. Please configure your API key.',
          } as TextContent,
        ],
        isError: true,
      };
    }

    // Validate YouTube URL format
    const youtubeUrlRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[a-zA-Z0-9_-]{11}$/;
    if (!youtubeUrlRegex.test(youtube_video_url)) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: Invalid YouTube URL format. Please provide a valid YouTube video URL.',
          } as TextContent,
        ],
        isError: true,
      };
    }

    try {
      // Prepare request data
      const requestData = {
        url: youtube_video_url,
        custom_prompt: custom_prompt || 'Summarize this YouTube video transcript:',
      };

      // Make API call
      const response = await axios.post(
        YOUTUBE_VIDEO_SUMMARY_API_URL,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
          },
          timeout: 120000, // 2 minutes timeout
        }
      );

      const { data: responseData } = response;

      if (!responseData.success) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${responseData.error || 'Failed to summarize video'}`,
            } as TextContent,
          ],
          isError: true,
        };
      }

      if (!responseData.data) {
        return {
          content: [
            {
              type: 'text',
              text: 'Error: No data received from the API',
            } as TextContent,
          ],
          isError: true,
        };
      }

      // Format the successful response
      const { video_id, title, transcript_length, summary } = responseData.data;
      
      const resultText = `# YouTube Video Summary

**Video Title:** ${title}
**Video ID:** ${video_id}
**Transcript Length:** ${transcript_length} characters

## Summary

${summary}`;

      return {
        content: [
          {
            type: 'text',
            text: resultText,
          } as TextContent,
        ],
      };

    } catch (error) {
      let errorMessage = 'Unknown error occurred';
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // Server responded with error status
          const status = error.response.status;
          const data = error.response.data;
          
          if (status === 401) {
            errorMessage = 'Authentication failed. Please check your API key.';
          } else if (status === 400) {
            errorMessage = `Bad request: ${data?.detail || data?.error || 'Invalid request parameters'}`;
          } else if (status === 429) {
            errorMessage = 'Rate limit exceeded. Please try again later.';
          } else if (status >= 500) {
            errorMessage = 'Server error. The service may be temporarily unavailable.';
          } else {
            errorMessage = `HTTP ${status}: ${data?.detail || data?.error || error.message}`;
          }
        } else if (error.request) {
          // Network error
          errorMessage = 'Network error: Unable to connect to the API. Please check your internet connection and API URL.';
        } else {
          errorMessage = `Request error: ${error.message}`;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = String(error);
      }

      return {
        content: [
          {
            type: 'text',
            text: `Error: ${errorMessage}`,
          } as TextContent,
        ],
        isError: true,
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('SummarAI MCP server running on stdio');
  }
}

module.exports = { SummarAIMCPServer };
