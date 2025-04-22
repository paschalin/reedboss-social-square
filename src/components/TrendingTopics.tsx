
import { Card } from "@/components/ui/card";

interface TrendingTopic {
  id: number;
  name: string;
  posts: string;
}

export function TrendingTopics() {
  const trendingTopics: TrendingTopic[] = [
    { id: 1, name: "#technology", posts: "2.5k posts" },
    { id: 2, name: "#programming", posts: "1.8k posts" },
    { id: 3, name: "#webdev", posts: "1.2k posts" }
  ];

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3">Trending Topics</h3>
      <div className="space-y-2">
        {trendingTopics.map((topic) => (
          <div key={topic.id} className="hover:bg-accent rounded-lg p-2 cursor-pointer">
            <p className="font-medium text-primary">{topic.name}</p>
            <p className="text-sm text-muted-foreground">{topic.posts}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
