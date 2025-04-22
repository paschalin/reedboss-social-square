
import { TrendingTopics } from './TrendingTopics';
import { PeopleToFollow } from './PeopleToFollow';

export function RightSidebar() {
  return (
    <aside className="hidden lg:block w-[320px] space-y-4 p-4">
      <TrendingTopics />
      <PeopleToFollow />
    </aside>
  );
}
