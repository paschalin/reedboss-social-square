
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatPreview {
  userId: string;
  username: string;
  lastMessage: string;
  timestamp: Date;
  unread?: boolean;
}

export function ChatList() {
  const [chats, setChats] = useState<ChatPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchChats = async () => {
      try {
        // In a real app, this would come from your backend
        // For demo, we'll create some mock data
        const mockChats: ChatPreview[] = [
          {
            userId: "1",
            username: "User 1",
            lastMessage: "Hey, how's it going?",
            timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
            unread: true,
          },
          {
            userId: "2",
            username: "User 2",
            lastMessage: "Did you see the latest update?",
            timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
          },
          {
            userId: "3",
            username: "User 3",
            lastMessage: "Thanks for your help yesterday!",
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          },
        ];
        setChats(mockChats);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const filteredChats = chats.filter(chat => 
    chat.username.toLowerCase().includes(search.toLowerCase()) || 
    chat.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Recent Conversations</h2>
      <Input 
        placeholder="Search conversations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      {loading ? (
        <div>Loading conversations...</div>
      ) : filteredChats.length > 0 ? (
        <div className="space-y-2">
          {filteredChats.map((chat) => (
            <Link
              to={`/chat/${chat.userId}`}
              key={chat.userId}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Avatar>
                <img
                  src={`https://ui-avatars.com/api/?name=${chat.username}&background=random&size=32`}
                  alt={chat.username}
                />
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <span className="font-medium">{chat.username}</span>
                  <span className="text-xs text-gray-500">
                    {chat.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
              {chat.unread && (
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">No conversations found</div>
      )}
    </div>
  );
}
