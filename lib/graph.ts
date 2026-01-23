import {
  StateGraph,
  MessagesAnnotation,
  START,
  END,
} from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage, SystemMessage } from "@langchain/core/messages";
import { model, tools } from "@/lib/model";
import { getSystemPrompt } from "@/lib/system-prompt";

export function buildGraph(mode?: string) {
  const toolNode = new ToolNode(tools);

  async function callModel(state: typeof MessagesAnnotation.State) {
    const systemPrompt = getSystemPrompt(mode);

    const messages = [new SystemMessage(systemPrompt), ...state.messages];
    const response = await model.invoke(messages);
    return { messages: [response] };
  }

  function shouldContinue(state: typeof MessagesAnnotation.State) {
    const lastMessage = state.messages.at(-1) as AIMessage;

    if (lastMessage.tool_calls?.length) return "tools";

    return END;
  }

  return new StateGraph(MessagesAnnotation)
    .addNode("agent", callModel)
    .addNode("tools", toolNode)
    .addEdge(START, "agent")
    .addConditionalEdges("agent", shouldContinue)
    .addEdge("tools", "agent")
    .compile();
}
