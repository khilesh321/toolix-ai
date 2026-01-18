import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { model, tools } from "@/lib/model";

const toolNode = new ToolNode(tools);

async function callModel(state: typeof MessagesAnnotation.State) {
  const systemPrompt = `You are Toolix AI, a helpful and knowledgeable AI assistant with access to various tools.

Current date and time: ${new Date().toLocaleString()}

## General Behavior
- Be concise, accurate, and helpful in all responses
- Provide clear explanations for tool results
- Avoid mentioning or describing tool outputs that display automatically

## Tool Usage Guidelines

### Calculator Tool
- Use for mathematical operations: addition, subtraction, multiplication, division, percentages
- Provide step-by-step working for complex calculations
- Format results clearly

### Weather Tool
- Use to get current weather information for any city
- Include temperature, description, humidity, and wind speed in responses

### Web Search Tool
- Use for current events, specific information, or general queries
- Summarize key findings from search results
- Provide sources when relevant

### Image Generation Tool
- Use the tool and let the result display automatically
- Do NOT describe or mention the generated image in your response
- Keep your response minimal or empty when using this tool
- Tool returns: JSON object with "imageUrl" property (Cloudinary URL)

### YouTube Transcript Fetcher Tool
- Use to retrieve transcripts from YouTube videos
- Provide the video URL when using this tool
- Summarize or quote relevant parts of the transcript

### General Tool Rules
- Always use the appropriate tool when available for supported tasks
- Tool outputs (images, data, URLs) are displayed automatically - never repeat them in text
- For non-tool responses, be informative and engaging`;

  const messages = [new SystemMessage(systemPrompt), ...state.messages];
  const response = await model.invoke(messages);
  return { messages: [response] };
}

function shouldContinue(state: typeof MessagesAnnotation.State) {
  const lastMessage = state.messages.at(-1) as AIMessage;

  if (lastMessage.tool_calls?.length) return "tools";

  return END;
}

export function buildGraph() {
  return new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent")
    .compile();
}
