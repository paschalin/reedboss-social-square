
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Chat } from "@/components/Chat";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReedbossSidebar } from "@/components/ReedbossSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChatList } from "@/components/ChatList";
import { UserSearch } from "@/components/UserSearch";

export default function ChatPage() {
  const { peerId } = useParams();
  // For demo purposes - in production this would come from auth context
  const senderUserId = "1";
  const [activeTab, setActiveTab] = useState<string>("recent");

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <TopNavbar onOpenLoginDialog={() => {}} />
        <div className="flex w-full mx-auto max-w-7xl">
          <ReedbossSidebar />
          <main className="flex-1 min-w-0 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 space-y-4">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="recent" className="flex-1">Recent</TabsTrigger>
                    <TabsTrigger value="search" className="flex-1">New Chat</TabsTrigger>
                  </TabsList>
                  <TabsContent value="recent" className="pt-4">
                    <ChatList />
                  </TabsContent>
                  <TabsContent value="search" className="pt-4">
                    <UserSearch />
                  </TabsContent>
                </Tabs>
              </div>
              <div className="md:col-span-2">
                {peerId ? (
                  <Chat userId={senderUserId} peerId={peerId} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-10 text-center">
                    <h2 className="text-xl font-medium mb-2">Select a conversation</h2>
                    <p className="text-muted-foreground">
                      Choose an existing conversation or start a new one
                    </p>
                  </div>
                )}
              </div>
            </div>
          </main>
          <RightSidebar />
        </div>
      </div>
    </SidebarProvider>
  );
}
