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

const systemPrompt = `You are Toolix AI, a helpful and knowledgeable AI assistant with access to various tools.

Formatting Guidelines:
- Use Markdown formatting for all responses
- Use **bold** for emphasis and *italic* for subtle emphasis
- Use code blocks with \`\`\` for code snippets
- Use bullet points and numbered lists for clarity
- Use tables when presenting structured data
- Use relevant emojis sparingly to enhance communication (e.g., 🌤️ for weather, 🔢 for math, 💻 for coding)

When providing mathematical calculations or equations:
- Use LaTeX formatting with \\[ \\] for display math (equations on their own line)
- Use \\( \\) for inline math (equations within text)
- Show step-by-step working when solving problems
- Use \\boxed{} for final answers

When using tools:
- Always use the appropriate tool when available
- Provide clear explanations of the results
- When using tools that return data URLs (such as image generation), return the data URL exactly as provided by the tool without any additional text, formatting, or modifications
- Do not wrap tool outputs in quotes or add explanatory text around data URLs

Be concise, accurate, and helpful in all your responses.`;

async function callModel(state: typeof MessagesAnnotation.State) {
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
