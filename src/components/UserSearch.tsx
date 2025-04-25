import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";


interface User {
  id: string;
  name: string;
}

interface UserSearchProps {
  searchQuery?: string;
}

export function UserSearch({ searchQuery = "" }: UserSearchProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/auth/users/", {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          }
        });
        
        if (response.status === 401) {
          toast({
            title: "Authentication required",
            description: "Please log in to view users",
            variant: "destructive"
          });
          return;
        }
        
        if (!response.ok) throw new Error("Failed to fetch users");
        const data = await response.json();
        
        const formattedUsers: User[] = Array.isArray(data) 
      ? data.map((user: { id: string | number; name?: string; username?: string }) => ({
          id: String(user.id), // Convert `id` to a string
          name: user.name || user.username || `User ${user.id || '?'}` // Fallback to username or default
        }))
      : [];
        
        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        toast({
          title: "Error",
          description: "Failed to load users. Using demo data.",
          variant: "destructive"
        });
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
  }, [toast]);

  useEffect(() => {
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchQuery, users]);

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
