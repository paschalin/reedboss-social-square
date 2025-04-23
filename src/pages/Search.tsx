
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { UserSearch } from "@/components/UserSearch";
import { ThreadSearch } from "@/components/ThreadSearch";
import { TopicSearch } from "@/components/TopicSearch";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("users");

  return (
    <div className="container mx-auto p-4 max-w-4xl">
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
  );
};

export default Search;
