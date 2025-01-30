import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sendMessage as sendMessageApi } from "./api";

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export function useMessages() {
  const queryClient = useQueryClient();
  
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
    initialData: []
  });

  const { mutate: sendMessage, isPending: isLoading } = useMutation({
    mutationFn: async (content: string) => {
      const userMessage: Message = {
        id: crypto.randomUUID(),
        content,
        isUser: true,
        timestamp: new Date()
      };
      
      queryClient.setQueryData<Message[]>(["/api/messages"], (old = []) => [
        ...old,
        userMessage
      ]);

      const response = await sendMessageApi(content);

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        content: response.message,
        isUser: false,
        timestamp: new Date()
      };

      queryClient.setQueryData<Message[]>(["/api/messages"], (old = []) => [
        ...old,
        assistantMessage
      ]);
    }
  });

  return {
    messages,
    sendMessage,
    isLoading
  };
}
