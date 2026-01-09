import { ChatGroq } from "@langchain/groq";
import { weatherTool } from "@/lib/tools/weather";
import { webSearchTool } from "./tools/webSearch";

export const tools = [weatherTool, webSearchTool];

export const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
}).bindTools(tools);
