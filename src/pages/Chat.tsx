
import React from "react";
import { useParams } from "react-router-dom";
import { Chat } from "@/components/Chat";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReedbossSidebar } from "@/components/ReedbossSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { TopNavbar } from "@/components/TopNavbar";

export default function ChatPage() {
  const { peerId } = useParams();
  // For demo purposes - in production this would come from auth context
  const senderUserId = "1";

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <TopNavbar onOpenSidebar={() => {}} onOpenLoginDialog={() => {}} />
        <div className="flex w-full mx-auto max-w-7xl">
          <ReedbossSidebar />
          <main className="flex-1 min-w-0 p-4">
            <div className="max-w-3xl mx-auto">
              <Chat userId={senderUserId} peerId={peerId || ""} />
            </div>
          </main>
          <RightSidebar />
        </div>
      </div>
    </SidebarProvider>
  );
}
