import { Shimmer } from "./ai-elements/shimmer";

export function TypingIndicator() {
  return (
    <div className="mb-8">
      <Shimmer>AI is Thinking...</Shimmer>
    </div>
  );
}
