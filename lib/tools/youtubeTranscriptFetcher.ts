import { tool, ToolRuntime } from "@langchain/core/tools";
import z from "zod";
import { Supadata } from "@supadata/js";

export const youtubeTranscriptFetcherTool = tool(
  async ({ videoUrl }: { videoUrl?: string }, config: ToolRuntime) => {
    const writer = config.writer;

    const url = videoUrl || "https://youtu.be/dQw4w9WgXcQ";

    writer?.({
      type: "progress",
      id: "youtube_transcript_fetcher",
      message: `Fetching transcript for YouTube video...`,
    });

    const apiKey = process.env.SUPADATA_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Supadata API key not found. Please set SUPADATA_API_KEY environment variable."
      );
    }

    const supadata = new Supadata({
      apiKey,
    });

    const transcript = await supadata.transcript({
      url,
    });

    if (typeof transcript === "string") {
      throw new Error(
        `Transcript request queued with job ID: ${transcript}. Please try again later.`
      );
    }

    const transcriptData = transcript as { content: any[] };
    if (
      !transcriptData ||
      !transcriptData.content ||
      transcriptData.content.length === 0
    ) {
      throw new Error(`No transcript found for the video.`);
    }

    const transcriptText = transcriptData.content
      .map((item: any) => item.text)
      .join(" ");

    writer?.({
      type: "progress",
      id: "youtube_transcript_fetcher",
      message: "Transcript fetched successfully",
    });

    return JSON.stringify({ transcript: transcriptText });
  },
  {
    name: "youtube_transcript_fetcher",
    description: "Fetch the transcript of a YouTube video.",
    schema: z.object({
      videoUrl: z
        .string()
        .optional()
        .describe("The full YouTube video URL to fetch transcript from"),
    }),
  }
);
