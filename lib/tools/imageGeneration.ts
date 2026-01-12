import { tool, ToolRuntime } from "@langchain/core/tools";
import OpenAI from "openai";
import z from "zod";
import fs from "fs";
import path from "path";

const client = new OpenAI({
  apiKey: process.env.A4F_API_KEY || "",
  baseURL: "https://api.a4f.co/v1",
});

const imagesDir = path.join(process.cwd(), "public", "images");
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

export const imageGenerationTool = tool(
  async (
    { prompt }: { prompt: string },
    config: ToolRuntime
  ): Promise<string> => {
    const writer = config.writer;

    writer?.({
      type: "progress",
      id: "image_generation",
      message: `Generating image for: "${prompt}"`,
    });

    try {
      const response = await client.images.generate({
        model: process.env.IMAGE_GEN_MODEL_ID || "provider-4/imagen-3.5",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        response_format: "b64_json",
      });

      writer?.({
        type: "progress",
        id: "image_generation",
        message: "Processing generated image...",
      });

      if (!response.data || response.data.length === 0) {
        throw new Error("No image generated in response");
      }

      const imageData = response.data[0].b64_json;
      if (!imageData) {
        throw new Error("No image data found in response");
      }

      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(7);
      const filename = `image_${timestamp}_${randomSuffix}.png`;
      const filepath = path.join(imagesDir, filename);

      // Save image to public/images folder
      const imageBuffer = Buffer.from(imageData, "base64");
      fs.writeFileSync(filepath, imageBuffer);

      writer?.({
        type: "progress",
        id: "image_generation",
        message: "Image generated and saved successfully",
      });

      // Return only the URL reference, not the base64 data
      const result = {
        imageUrl: `/images/${filename}`,
        description:
          response.data[0].revised_prompt ||
          "Image generated successfully with Flux 1 Schnell",
      };

      return JSON.stringify(result);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      writer?.({
        type: "progress",
        id: "image_generation",
        message: `Error generating image: ${errorMessage}`,
      });
      throw error;
    }
  },
  {
    name: "generate_image",
    description:
      "Generate an image based on a text prompt using Flux 1 Schnell model via A4F API. Returns a URL reference to the generated image.",
    schema: z.object({
      prompt: z
        .string()
        .describe(
          "Detailed text description of the image to generate. Be descriptive for best results."
        ),
    }),
  }
);
