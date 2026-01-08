import { toBaseMessages, toUIMessageStream } from '@ai-sdk/langchain';
import { createUIMessageStreamResponse, UIMessage } from 'ai';
import { StateGraph, MessagesAnnotation } from '@langchain/langgraph';
import { ChatGroq } from '@langchain/groq';

export const maxDuration = 30;

const model = new ChatGroq({
  model: 'openai/gpt-oss-120b',
  temperature: 0,
});

async function callModel(state: typeof MessagesAnnotation.State) {
  const response = await model.invoke(state.messages);
  return { messages: [response] };
}

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const graph = new StateGraph(MessagesAnnotation)
    .addNode('agent', callModel)
    .addEdge('__start__', 'agent')
    .addEdge('agent', '__end__')
    .compile();

  const langchainMessages = await toBaseMessages(messages);

  const stream = await graph.stream(
    { messages: langchainMessages },
    { streamMode: ['values', 'messages'] },
  );

  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });
}