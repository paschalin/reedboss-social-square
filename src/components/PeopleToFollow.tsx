
import { Card } from "@/components/ui/card";

interface Person {
  id: number;
  name: string;
  username: string;
  avatar: string;
}

export function PeopleToFollow() {
  const peopleToFollow: Person[] = [
    { id: 1, name: "Sarah Connor", username: "@sarah", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=1" },
    { id: 2, name: "John Doe", username: "@johndoe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=2" },
    { id: 3, name: "Jane Smith", username: "@janesmith", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=3" }
  ];

  return (
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
  );
}
