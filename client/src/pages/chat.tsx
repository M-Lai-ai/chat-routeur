import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import MessageList from "@/components/chat/message-list";
import ChatInput from "@/components/chat/input";
import { useMessages } from "@/lib/messages";

export default function Chat() {
  const { messages, sendMessage, isLoading } = useMessages();

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <MessageList messages={messages} />
        </ScrollArea>
        <div className="p-4 border-t">
          <ChatInput onSend={sendMessage} isLoading={isLoading} />
        </div>
      </Card>
    </div>
  );
}
