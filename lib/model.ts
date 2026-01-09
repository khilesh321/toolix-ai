import { ChatGroq } from "@langchain/groq";
import { weatherTool } from "@/lib/tools/weather";

export const tools = [weatherTool];

export const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
}).bindTools(tools);
