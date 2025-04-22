
import { useEffect, useRef, useState, useCallback } from "react";

export interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
  mediaUrl?: string;
  mediaType?: "image" | "video";
}

type UseChatSocketProps = {
  userId: string;
  peerId: string;
};

export function useChatSocket({ userId, peerId }: UseChatSocketProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!userId || !peerId) return;

    const url = `ws://localhost:8080/chat?userId=${encodeURIComponent(
      userId
    )}&peerId=${encodeURIComponent(peerId)}`;
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setIsConnected(true);
      // Optionally fetch history from backend on open
    };
    ws.current.onclose = () => {
      setIsConnected(false);
    };
    ws.current.onerror = () => setIsConnected(false);
    ws.current.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.type === "message") {
          setMessages((prev) => [...prev, data.message]);
        } else if (data.type === "history" && Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      } catch {
        // Ignore malformed messages
      }
    };

    return () => {
      ws.current?.close();
    };
  }, [userId, peerId]);

  // Sending text or media messages
  const sendMessage = useCallback(
    ({
      content,
      mediaUrl,
      mediaType,
    }: { content: string; mediaUrl?: string; mediaType?: "image" | "video" }) => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
      const msg: ChatMessage = {
        id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
        userId,
        content,
        timestamp: Date.now(),
        ...(mediaUrl && { mediaUrl }),
        ...(mediaType && { mediaType }),
      };
      ws.current.send(
        JSON.stringify({
          type: "message",
          message: msg,
          to: peerId,
        })
      );
      setMessages((prev) => [...prev, msg]);
    },
    [userId, peerId]
  );

  return { messages, sendMessage, isConnected };
}

