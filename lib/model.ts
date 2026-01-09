import { ChatGroq } from "@langchain/groq";
import { weatherTool } from "@/lib/tools/weather";
import { webSearchTool } from "./tools/webSearch";
import { calculatorTool } from "./tools/calculator";

export const tools = [weatherTool, webSearchTool, calculatorTool];

export const model = new ChatGroq({
  model: process.env.GROQ_MODEL_ID || "openai/gpt-oss-120b",
  temperature: 0,
}).bindTools(tools);
