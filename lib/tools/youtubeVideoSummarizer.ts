import { tool, ToolRuntime } from "@langchain/core/tools";
import z from "zod";
import { ChatGroq } from "@langchain/groq";
import { Supadata } from "@supadata/js";

const summarizerModel = new ChatGroq({
  model: process.env.GROQ_MODEL_ID || "openai/gpt-oss-120b",
  temperature: 0,
});

export const youtubeVideoSummarizerTool = tool(
  async ({ videoUrl }: { videoUrl?: string }, config: ToolRuntime) => {
    const writer = config.writer;

    const url = videoUrl || "https://youtu.be/dQw4w9WgXcQ";

    writer?.({
      type: "progress",
      id: "youtube_summarizer",
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
      id: "youtube_summarizer",
      message: "Transcript fetched, generating summary...",
    });

    const maxLength = 400000;
    let summaryText = "";
    let keyPoints: string[] = [];

    if (transcriptText.length > maxLength) {
      const chunks =
        transcriptText.match(new RegExp(`.{1,${maxLength}}`, "g")) || [];
      const summaries = [];
      for (const chunk of chunks) {
        const chunkPrompt = `Summarize this part of the YouTube video transcript concisely, focusing on key ideas: ${chunk}`;
        const chunkResponse = await summarizerModel.invoke(chunkPrompt);
        summaries.push(chunkResponse.content as string);
      }
      const combinedSummaries = summaries.join(" ");
      const finalPrompt = `Combine these summaries into one concise summary of the entire video, with key points as bullet points. Provide in JSON: {"summary": "...", "keyPoints": ["...", "..."]}

Summaries: ${combinedSummaries}`;
      const finalResponse = await summarizerModel.invoke(finalPrompt);
      const result = JSON.parse(finalResponse.content as string);
      summaryText = result.summary;
      keyPoints = result.keyPoints;
    } else {
      const prompt = `Summarize the following YouTube video transcript concisely, focusing on key ideas. Use bullet points where helpful. Also, provide key points as a list.

Transcript: ${transcriptText}

Provide the response in JSON format with "summary" and "keyPoints" fields.`;
      const summaryResponse = await summarizerModel.invoke(prompt);
      const result = JSON.parse(summaryResponse.content as string);
      summaryText = result.summary;
      keyPoints = result.keyPoints;
    }

    writer?.({
      type: "progress",
      id: "youtube_summarizer",
      message: "Summary generated successfully",
    });

    return JSON.stringify({ summary: summaryText, keyPoints });
  },
  {
    name: "youtube_video_summarizer",
    description:
      "Summarize a YouTube video by fetching its transcript and generating a concise summary.",
    schema: z.object({
      videoUrl: z
        .string()
        .optional()
        .describe("The full YouTube video URL to summarize"),
    }),
  }
);
