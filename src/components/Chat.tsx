
import React, { useRef, useState } from "react";
import { useChatSocket, ChatMessage } from "@/hooks/useChatSocket";
import { MessageCircle, Send, Image, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

type ChatProps = {
  userId: string;
  peerId: string;
};

export function Chat({ userId, peerId }: ChatProps) {
  const { messages, sendMessage, isConnected } = useChatSocket({ userId, peerId });
  const [text, setText] = useState("");
  const [media, setMedia] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Simple media upload to a mock endpoint (you should replace with your backend/Supabase)
  const uploadMedia = async (file: File): Promise<{ url: string; type: "image" | "video" }> => {
    // For the demo: use Object URLs (not persistent). Replace for production!
    const url = URL.createObjectURL(file);
    const type = file.type.startsWith("image") ? "image" : "video";
    return { url, type };
  };

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text && !media) return;

    setLoading(true);
    let mediaUrl, mediaType;
    if (media) {
      const uploaded = await uploadMedia(media);
      mediaUrl = uploaded.url;
      mediaType = uploaded.type;
    }

    sendMessage({ content: text, mediaUrl, mediaType });
    setText("");
    setMedia(null);
    setLoading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col w-full max-w-lg h-[450px] border rounded-lg shadow-md bg-white dark:bg-gray-950">
      <div className="flex items-center gap-2 p-3 border-b bg-gray-50 dark:bg-gray-800 rounded-t-lg">
        <MessageCircle className="text-gray-400 w-5 h-5" />
        <span className="text-base font-semibold">Chat</span>
        <span className={`ml-auto rounded px-2 py-1 text-xs ${isConnected ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{isConnected ? "Online" : "Offline"}</span>
      </div>
      <ScrollArea className="flex-1 overflow-y-scroll p-3 space-y-2 max-h-[270px] min-h-[160px] bg-background">
        {messages.length === 0 ? (
          <div className="text-sm text-center text-gray-400 mt-4">No messages yet.</div>
        ) : (
          messages.map((m: ChatMessage) => (
            <div key={m.id} className={`flex flex-col ${m.userId === userId ? "items-end" : "items-start"}`}>
              <div className={`rounded-xl px-3 py-2 shadow max-w-[80%] ${m.userId === userId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-100"}`}>
                {m.mediaUrl && m.mediaType === "image" && (
                  <img src={m.mediaUrl} alt="attachment" className="mb-1 max-h-32 rounded-lg" />
                )}
                {m.mediaUrl && m.mediaType === "video" && (
                  <video src={m.mediaUrl} className="mb-1 max-h-36 rounded-lg" controls />
                )}
                <span>{m.content}</span>
              </div>
              <span className="text-xs mt-1 text-gray-400">
                {new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                {m.userId === userId && " • You"}
              </span>
            </div>
          ))
        )}
      </ScrollArea>
      <form
        className="flex flex-col gap-2 p-3 bg-white dark:bg-gray-950 rounded-b-lg border-t"
        onSubmit={handleSend}
      >
        <Textarea
          placeholder="Type a message..."
          rows={2}
          value={text}
          onChange={e => setText(e.target.value)}
          className="resize-none"
          disabled={loading}
        />
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*,video/*"
            className="hidden"
            onChange={e => setMedia(e.target.files?.[0] || null)}
          />
          <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={loading}>
            <Image />
          </Button>
          <Button type="button" variant="ghost" size="icon" onClick={() => fileInputRef.current?.click()} disabled={loading}>
            <Video />
          </Button>
          <Button
            type="submit"
            variant="default"
            size="sm"
            disabled={(!text && !media) || loading}
            className="ml-auto flex gap-1"
          >
            <Send /> Send
          </Button>
        </div>
      </form>
    </div>
  );
}

