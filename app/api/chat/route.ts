import { toBaseMessages, toUIMessageStream } from "@ai-sdk/langchain";
import { createUIMessageStreamResponse, UIMessage } from "ai";
import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
} from "@langchain/langgraph";
import { ChatGroq } from "@langchain/groq";
import { tool, ToolRuntime } from "@langchain/core/tools";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "@langchain/core/messages";
import axios from "axios";
import z from "zod";

export const maxDuration = 30;

const weatherTool = tool(
  async ({ city }: { city: string }, config: ToolRuntime): Promise<string> => {

    config.writer?.({
      type: "progress",
      id: "weather",
      message: `Fetching weather for ${city}...`,
    });

    const { data } = await axios.get(`https://wttr.in/${city}?format=j2`);

    config.writer?.({
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

const tools = [weatherTool];
const toolNode = new ToolNode(tools);

const model = new ChatGroq({
  model: "openai/gpt-oss-120b",
  temperature: 0,
}).bindTools(tools);

async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

function shouldContinue(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages.at(-1) as AIMessage;

  console.log(lastMessage.tool_calls);

  if (lastMessage.tool_calls?.length) return "tools";

  return END;
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const graph = new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent")
    .compile();

  const langchainMessages = await toBaseMessages(messages);

  const stream = await graph.stream(
    { messages: langchainMessages },
    { streamMode: ["values", "messages", "custom"] }
  );

  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });
}
