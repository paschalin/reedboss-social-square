
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

interface User {
  id: string;
  name: string;
}

export function UserSearch() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // In a real app, fetch from your API
        const response = await fetch("http://127.0.0.1:8000/api/auth/users/");
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        
        // Transform data to our User interface
        const formattedUsers: User[] = Array.isArray(data) 
          ? data.map((user: any) => ({
              id: user.id || String(user.id),
              name: user.name || user.username || `User ${user.id || '?'}`
            }))
          : [];
        
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        // Fallback to mock data
        const mockUsers = [
          { id: "1", name: "User 1" },
          { id: "2", name: "User 2" },
          { id: "3", name: "User 3" },
          { id: "4", name: "User 4" },
          { id: "5", name: "User 5" },
        ];
        setUsers(mockUsers);
        setFilteredUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const startChat = (userId: string) => {
    navigate(`/chat/${userId}`);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Start New Chat</h2>
      <Input
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4"
      />
      {loading ? (
        <div>Loading users...</div>
      ) : filteredUsers.length > 0 ? (
        <div className="space-y-2">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <img
                    src={`https://ui-avatars.com/api/?name=${user.name}&background=random&size=32`}
                    alt={user.name}
                  />
                </Avatar>
                <span>{user.name}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => startChat(user.id)}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-gray-500">No users found</div>
      )}
    </div>
  );
}
