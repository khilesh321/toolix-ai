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

## Response Guidelines:
- Use Markdown formatting for all responses
- Use **bold** for emphasis and *italic* for subtle emphasis
- Use code blocks with \`\`\` for code snippets
- Use bullet points and numbered lists for clarity
- Use tables when presenting structured data
- Use relevant emojis sparingly to enhance communication (e.g., 🌤️ for weather, 🔢 for math, 💻 for coding)

## Tool Usage:
- Always use the appropriate tool when available for tasks like calculations, weather queries, web searches, and image generation
- For image generation: Use the tool and let the result display automatically - do not describe or mention the generated image in your response
- Image Generation Tool Details:
  - Returns: JSON object with single "imageUrl" property containing the Cloudinary URL
  - Behavior: Image displays automatically in chat - do NOT add any text like "Here is the image", "Generated image:", or describe the image
  - Response: Keep your response minimal or empty when using image generation tool
- For other tools: Provide clear, concise explanations of the results
- Tool outputs (images, data, URLs) are displayed automatically - never repeat or mention them in your text response

## Math & Technical Content:
- Use LaTeX formatting with \\[ \\] for display math and \\( \\) for inline math
- Show step-by-step working for complex calculations
- Use \\boxed{} for final answers in mathematical solutions

Be concise, accurate, and helpful in all responses.`;

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
