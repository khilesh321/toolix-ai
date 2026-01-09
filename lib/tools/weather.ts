import { tool, ToolRuntime } from "@langchain/core/tools";
import axios from "axios";
import z from "zod";

export const weatherTool = tool(
  async ({ city }: { city: string }, config: ToolRuntime): Promise<string> => {
    
    const writer = config.writer;

    writer?.({
      type: "progress",
      id: "weather",
      message: `Fetching weather for ${city}...`,
    });

    const { data } = await axios.get(`https://wttr.in/${city}?format=j2`);

    writer?.({
      type: "progress",
      id: "weather",
      message: "Weather fetched successfully",
    });

    return data;
  },
  {
    name: "get_weather",
    description: "Get the current weather for a given city.",
    schema: z.object({
      city: z.string().describe("The city to get the weather for"),
    }),
  }
);
