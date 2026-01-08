import { toBaseMessages, toUIMessageStream } from '@ai-sdk/langchain';
import { ChatGroq } from '@langchain/groq';
import { createUIMessageStreamResponse, UIMessage } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const model = new ChatGroq({
    model: 'openai/gpt-oss-120b',
    temperature: 0,
  });

  const langchainMessages = await toBaseMessages(messages);

  const stream = await model.stream(langchainMessages);

  return createUIMessageStreamResponse({
    stream: toUIMessageStream(stream),
  });
}