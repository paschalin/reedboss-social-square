import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { useState } from "react";
import { Post } from "@/components/Post";
import { ReedbossSidebar } from "@/components/ReedbossSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

const fetchUserThreads = async (userId: string) => {
  const response = await fetch("http://127.0.0.1:8000/api/threads");
  if (!response.ok) throw new Error("Failed to fetch threads");
  const threads = await response.json();
  return threads.filter((t: any) => String(t.user) === userId);
};

const coverPhotos = [
  "photo-1581091226825-a6a2a5aee158",
  "photo-1649972904349-6e44c42644a7",
  "photo-1488590528505-98d2b5aba04b",
];
const getCover = (userId: string) =>
  `https://images.unsplash.com/${coverPhotos[Number(userId) % coverPhotos.length]}?auto=format&fit=cover&w=900&q=80`;

export default function UserProfile() {
  const { userId = "" } = useParams<{ userId: string }>();
  const [tab, setTab] = useState("all");
  const { data: threads, isLoading, error } = useQuery({
    queryKey: ["userThreads", userId],
    queryFn: () => fetchUserThreads(userId),
    enabled: !!userId,
  });

  const avatarUrl = `https://ui-avatars.com/api/?name=User+${userId}&background=random&size=128`;

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <TopNavbar onOpenLoginDialog={() => {}} />
        <div className="flex w-full mx-auto max-w-7xl">
          <ReedbossSidebar />
          <main className="flex-1 min-w-0">
            <div className="w-full h-40 rounded-b-xl mb-6" style={{background: `url(${getCover(userId)}) center/cover`}} />
            <Card className="relative -mt-16 mb-6 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <img src={avatarUrl} alt={`User ${userId}`} className="w-20 h-20 rounded-full border-2 border-white" />
                  </Avatar>
                  <div>
                    <div className="font-bold text-xl">User {userId}</div>
                    <div className="text-muted-foreground text-sm">Joined recently</div>
                  </div>
                </div>
                <Link to={`/chat/${userId}`}>
                  <Button variant="outline">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Message
                  </Button>
                </Link>
              </div>
            </Card>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="image">Image</TabsTrigger>
                <TabsTrigger value="video">Video</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <div className="space-y-4 pt-4">
                  {isLoading ? (
                    <div>Loading threads...</div>
                  ) : error ? (
                    <div className="text-red-600">Failed to load threads.</div>
                  ) : threads && threads.length > 0 ? (
                    threads.map((thread: any) => <Post key={thread.id} thread={thread} />)
                  ) : (
                    <div>No threads found.</div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="image">
                <div className="space-y-4 pt-4">
                  {threads &&
                    threads
                      .filter((t: any) =>
                        Array.isArray(t.media)
                          ? t.media.some((m: any) => m.type === "image")
                          : false
                      )
                      .map((thread: any) => <Post key={thread.id} thread={thread} />)}
                </div>
              </TabsContent>
              <TabsContent value="video">
                <div className="space-y-4 pt-4">
                  {threads &&
                    threads
                      .filter((t: any) =>
                        Array.isArray(t.media)
                          ? t.media.some((m: any) => m.type === "video")
                          : false
                      )
                      .map((thread: any) => <Post key={thread.id} thread={thread} />)}
                </div>
              </TabsContent>
            </Tabs>
          </main>
          <RightSidebar />
        </div>
      </div>
    </SidebarProvider>
  );
}
