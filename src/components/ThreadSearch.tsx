
import { useQuery } from "@tanstack/react-query";
import { Post } from "./Post";

interface ThreadSearchProps {
  searchQuery: string;
}

export function ThreadSearch({ searchQuery }: ThreadSearchProps) {
  const { data: threads, isLoading } = useQuery({
    queryKey: ['threads', searchQuery],
    queryFn: async () => {
      const response = await fetch('http://127.0.0.1:8000/api/threads');
      if (!response.ok) throw new Error('Failed to fetch threads');
      const data = await response.json();
      return data.filter((thread: any) => 
        thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        thread.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    },
    enabled: searchQuery.length > 0
  });

  if (isLoading) return <div>Loading threads...</div>;
  
  return (
    <div className="space-y-4">
      {threads?.length ? (
        threads.map((thread: any) => (
          <Post key={thread.id} thread={thread} />
        ))
      ) : (
        <div className="text-center py-4 text-gray-500">
          {searchQuery ? "No threads found" : "Start typing to search threads"}
        </div>
      )}
    </div>
  );
}
