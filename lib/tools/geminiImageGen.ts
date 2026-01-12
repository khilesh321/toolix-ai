import { tool, ToolRuntime } from "@langchain/core/tools";
import { GoogleGenerativeAI } from "@google/generative-ai";
import z from "zod";

export const geminiImageTool = tool(
  async (
    { prompt }: { prompt: string },
    config: ToolRuntime
  ): Promise<string> => {
    const writer = config?.configurable?.writer;

    writer?.({
      type: "progress",
      id: "gemini-image",
      message: "Generating image with Gemini...",
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
    });

    const result = await model.generateContent([
      {
        role: "user",
        parts: [
          { text: prompt },
        ],
      },
    ]);

    const imagePart = result.response.candidates?.[0]?.content?.parts?.find(
      (p: any) => p.inlineData?.mimeType?.startsWith("image/")
    );

    if (!imagePart) {
      throw new Error("No image returned by Gemini");
    }

    writer?.({
      type: "progress",
      id: "gemini-image",
      message: "Image generation completed",
    });

    return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
  },
  {
    name: "generate_image",
    description: "Generate an image using Google Gemini",
    schema: z.object({
      prompt: z.string(),
    }),
  }
);
