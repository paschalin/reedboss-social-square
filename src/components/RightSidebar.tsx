
import { Card } from "@/components/ui/card"

export function RightSidebar() {
  const trendingTopics = [
    { id: 1, name: "#technology", posts: "2.5k posts" },
    { id: 2, name: "#programming", posts: "1.8k posts" },
    { id: 3, name: "#webdev", posts: "1.2k posts" }
  ];

  const peopleToFollow = [
    { id: 1, name: "Sarah Connor", username: "@sarah", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1" },
    { id: 2, name: "John Doe", username: "@johndoe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2" },
    { id: 3, name: "Jane Smith", username: "@janesmith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3" }
  ];

  return (
    <aside className="hidden lg:block w-[320px] space-y-4 p-4">
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

      <Card className="p-4">
        <h3 className="font-semibold mb-3">Who to Follow</h3>
        <div className="space-y-4">
          {peopleToFollow.map((person) => (
            <div key={person.id} className="flex items-center gap-3">
              <img
                src={person.avatar}
                alt={person.name}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <p className="font-medium">{person.name}</p>
                <p className="text-sm text-muted-foreground">{person.username}</p>
              </div>
              <button className="text-sm px-3 py-1 bg-primary text-primary-foreground rounded-full hover:bg-primary/90">
                Follow
              </button>
            </div>
          ))}
        </div>
      </Card>
    </aside>
  );
}
