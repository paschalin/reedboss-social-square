
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserSearch } from "@/components/UserSearch";
import { ThreadSearch } from "@/components/ThreadSearch";
import { TopicSearch } from "@/components/TopicSearch";
import { useSearchParams } from "react-router-dom";
import { ReedbossSidebar } from "@/components/ReedbossSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <TopNavbar onOpenLoginDialog={() => {}} />
        <div className="flex w-full mx-auto max-w-7xl">
          <ReedbossSidebar />
          <main className="flex-1 min-w-0 p-4">
            <div className="max-w-4xl mx-auto">
              <Input
                type="search"
                placeholder="Search..."
                className="mb-4"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="users">People</TabsTrigger>
                  <TabsTrigger value="threads">Threads</TabsTrigger>
                  <TabsTrigger value="topics">Topics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="users">
                  <UserSearch searchQuery={searchQuery} />
                </TabsContent>
                
                <TabsContent value="threads">
                  <ThreadSearch searchQuery={searchQuery} />
                </TabsContent>
                
                <TabsContent value="topics">
                  <TopicSearch searchQuery={searchQuery} />
                </TabsContent>
              </Tabs>
            </div>
          </main>
          <RightSidebar />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Search;
