import { tool, ToolRuntime } from "@langchain/core/tools";
import z from "zod";

export const imageSearchTool = tool(
  async ({ query }: { query: string }, config: ToolRuntime) => {
    const writer = config.writer;

    writer?.({
      type: "progress",
      id: "image_search",
      message: `Searching for images: "${query}"...`,
    });

    try {
      const apiKey = process.env.GOOGLE_API_KEY;
      const cx = process.env.GOOGLE_CX;

      if (!apiKey || !cx) {
        throw new Error("Google API key or Custom Search Engine ID not configured");
      }

      const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&searchType=image&num=10&safe=active`;

      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Google API error: ${data.error?.message || 'Unknown error'}`);
      }

      const images = data.items?.map((item: any) => ({
        url: item.link,
        title: item.title,
        thumbnail: item.image?.thumbnailLink,
        context: item.image?.contextLink,
      })) || [];

      writer?.({
        type: "progress",
        id: "image_search",
        message: `Found ${images.length} images`,
      });

      return JSON.stringify({ images });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      writer?.({
        type: "progress",
        id: "image_search",
        message: `Error searching images: ${errorMessage}`,
      });
      throw error;
    }
  },
  {
    name: "search_images",
    description: "Search for images using Google Custom Search API. Returns a list of image URLs and metadata.",
    schema: z.object({
      query: z.string().describe("The search query for finding images"),
    }),
  }
);