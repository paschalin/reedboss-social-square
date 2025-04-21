
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PostProps {
  post: {
    id: number;
    title: string;
    body: string;
    userId: number;
    reactions: number;
    tags: string[];
  };
}

export function Post({ post }: PostProps) {
  const [likes, setLikes] = useState(post.reactions);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    if (isLiked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
            {post.userId}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{post.title}</h3>
          <p className="text-gray-600 mb-3">{post.body}</p>
          <div className="flex items-center gap-4">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 text-sm ${
                isLiked ? 'text-red-500' : 'text-gray-500'
              } hover:text-red-500 transition-colors`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
