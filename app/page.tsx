'use client';

import { useChat } from '@ai-sdk/react';
import { BadgeCheck, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Chat() {
  const [input, setInput] = useState('');
  const { messages, sendMessage } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      {messages.map(message => (
        <div key={message.id} className="whitespace-pre-wrap mb-4">
          <strong>{message.role === 'user' ? 'User' : 'AI'}:</strong>

          {message.parts.map((part, i) => {
            switch (part.type) {
              case 'text':
                return (
                  <div key={`${message.id}-${i}`}>
                    {part.text}
                  </div>
                );

              case 'data-progress':
                const data = part.data as { message: string };
                const success = data.message.includes('successfully') || data.message.includes('fetched');
                return (
                  <div
                    key={`${message.id}-${i}`}
                    className={`text-sm text-blue-500 h-8 rounded flex items-center ${success && 'text-green-600'}`}
                  >
                    {success ? <BadgeCheck className='mr-2'/> : <Loader2 className="inline-block mr-2 animate-spin" />} {(part.data as { message: string }).message}
                  </div>
                );
              default:
                return null;
            }
          })}
        </div>
      ))}

      <form
        onSubmit={e => {
          e.preventDefault();
          sendMessage({ text: input });
          setInput('');
        }}
      >
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border rounded shadow-xl
                     dark:bg-zinc-900 dark:border-zinc-800"
          value={input}
          placeholder="Ask weather..."
          onChange={e => setInput(e.currentTarget.value)}
        />
      </form>
    </div>
  );
}
