import { tool, ToolRuntime } from "@langchain/core/tools";
import axios from "axios";
import z from "zod";

export const imageGeneratorTool = tool(
  async (
    {
      prompt,
      width,
      height,
    }: {
      prompt: string;
      width?: number;
      height?: number;
    },
    config: ToolRuntime
  ): Promise<string> => {
    const writer = config.writer;

    writer?.({
      type: "progress",
      id: "image-generator",
      message: `Generating image for prompt: "${prompt}"...`,
    });

    // Hugging Face model URL
    const HF_API = process.env.HF_TOKEN;
    console.log(HF_API);
    const modelURL = `https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2`;

    const response = await axios.post(
      modelURL,
      {
        inputs: prompt,
        options: {
          width: width ?? 512,
          height: height ?? 512,
        },
      },
      {
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${HF_API}`,
          "Content-Type": "application/json",
        },
      }
    );

    const base64Image = Buffer.from(response.data, "binary").toString("base64");

    writer?.({
      type: "progress",
      id: "image-generator",
      message: "Image generation completed!",
    });

    // return base64 data
    return `data:image/png;base64,${base64Image}`;
  },
  {
    name: "generate_image",
    description:
      "Generate an image from a text prompt using Stable Diffusion (Hugging Face API).",
    schema: z.object({
      prompt: z.string().describe("Text prompt for image generation"),
      width: z
        .number()
        .optional()
        .describe("Image width (optional, default=512)"),
      height: z
        .number()
        .optional()
        .describe("Image height (optional, default=512)"),
    }),
  }
);
