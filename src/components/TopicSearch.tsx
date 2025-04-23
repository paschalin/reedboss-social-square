
import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface TopicSearchProps {
  searchQuery: string;
}

export function TopicSearch({ searchQuery }: TopicSearchProps) {
  const { data: threads, isLoading } = useQuery({
    queryKey: ['threads-topics', searchQuery],
    queryFn: async () => {
      const response = await fetch('http://127.0.0.1:8000/api/threads');
      if (!response.ok) throw new Error('Failed to fetch threads');
      const data = await response.json();
      
      // Extract unique hashtags
      const hashtags = new Set<string>();
      data.forEach((thread: any) => {
        if (thread.hashtags) {
          const tags = Array.isArray(thread.hashtags) 
            ? thread.hashtags 
            : thread.hashtags.split(',').map((tag: string) => tag.trim());
          tags.forEach((tag: string) => hashtags.add(tag));
        }
      });
      
      return Array.from(hashtags)
        .filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    },
    enabled: searchQuery.length > 0
  });

  if (isLoading) return <div>Loading topics...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {threads?.length ? (
        threads.map((topic: string) => (
          <Card key={topic}>
            <CardHeader>
              <CardTitle>#{topic}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click to see related threads
              </p>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-2 text-center py-4 text-gray-500">
          {searchQuery ? "No topics found" : "Start typing to search topics"}
        </div>
      )}
    </div>
  );
}
