export async function sendMessage(content: string) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: content }),
  });

  if (!response.ok) {
    throw new Error("Failed to send message");
  }

  return response.json();
}
