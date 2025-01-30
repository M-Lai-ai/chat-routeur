import Message from "./message";
import { type Message as MessageType } from "@/lib/messages";

interface MessageListProps {
  messages: MessageType[];
}

export default function MessageList({ messages }: MessageListProps) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <Message
          key={message.id}
          content={message.content}
          isUser={message.isUser}
          timestamp={message.timestamp}
        />
      ))}
    </div>
  );
}
