import { tool, ToolRuntime } from "@langchain/core/tools";
import axios from "axios";
import z from "zod";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const invokeUrl =
  process.env.NVIDIA_IMAGE_API_URL ||
  "https://ai.api.nvidia.com/v1/genai/black-forest-labs/flux.2-klein-4b";

export const imageGenerationTool = tool(
  async (
    { prompt }: { prompt: string },
    config: ToolRuntime,
  ): Promise<string> => {
    const writer = config.writer;

    writer?.({
      type: "progress",
      id: "image_generation",
      message: `Generating image for: "${prompt}"`,
    });

    try {
      if (!process.env.NVIDIA_API_KEY) {
        throw new Error("NVIDIA_API_KEY is not configured");
      }

      const response = await axios.post(
        invokeUrl,
        {
          prompt,
          width: 1024,
          height: 1024,
          seed: 0,
          steps: 4,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          timeout: 60000,
        },
      );

      const imageData =
        response.data?.b64_json ||
        response.data?.image_base64 ||
        response.data?.image ||
        response.data?.artifacts?.[0]?.base64 ||
        response.data?.output?.[0]?.b64_json ||
        response.data?.output?.[0]?.image_base64;

      if (!imageData || typeof imageData !== "string") {
        throw new Error("No image data found in NVIDIA response");
      }

      const mimeType =
        response.data?.mime_type ||
        response.data?.output?.[0]?.mime_type ||
        "image/png";

      writer?.({
        type: "progress",
        id: "image_generation",
        message: "Uploading image to Cloudinary...",
      });

      const uploadResult = await cloudinary.uploader.upload(
        `data:${mimeType};base64,${imageData}`,
        {
          resource_type: "image",
          folder: "Toolix-ai/generated-images",
        },
      );

      writer?.({
        type: "progress",
        id: "image_generation",
        message: "Image Generated & uploaded successfully success=true",
      });

      const result = {
        imageUrl: uploadResult.secure_url,
      };

      return JSON.stringify(result);
    } catch (error) {
      const errorMessage = axios.isAxiosError(error)
        ? `NVIDIA API error${
            error.response?.status ? ` (${error.response.status})` : ""
          }: ${
            typeof error.response?.data === "string"
              ? error.response.data
              : error.message
          }`
        : error instanceof Error
          ? error.message
          : "Unknown error";
      writer?.({
        type: "progress",
        id: "image_generation",
        message: `Error generating image: ${errorMessage} success=false`,
      });
      throw error;
    }
  },
  {
    name: "generate_image",
    description:
      "Generate a new, original image based on a text prompt using AI. Only use when the user explicitly requests image generation with phrases like 'generate an image', 'create an image', 'draw', or 'illustrate'. Do not use for finding existing images or logos.",
    schema: z.object({
      prompt: z
        .string()
        .describe(
          "Detailed text description of the image to generate. Be descriptive for best results.",
        ),
    }),
  },
);
