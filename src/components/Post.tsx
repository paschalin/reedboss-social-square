
import { useState } from 'react';
import { Heart, MessageSquare, Share, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface PostProps {
  post: {
    id: number;
    title: string;
    body: string;
    userId: number;
    reactions: number | { likes: number; dislikes: number };
    tags: string[];
  };
}

export function Post({ post }: PostProps) {
  // Handle reactions whether it's a number or an object
  const getInitialLikes = () => {
    if (typeof post.reactions === 'number') {
      return post.reactions;
    } else if (post.reactions && typeof post.reactions === 'object') {
      return post.reactions.likes || 0;
    }
    return 0;
  };
  
  const [likes, setLikes] = useState(getInitialLikes());
  const [isLiked, setIsLiked] = useState(false);

  // Add logging to see post data
  console.log('Rendering post:', post);

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
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              <MessageSquare className="w-4 h-4" />
              <span>24</span>
            </button>
            <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              <Share className="w-4 h-4" />
              <span>12</span>
            </button>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Eye className="w-4 h-4" />
              <span>1.2k</span>
            </div>
            <div className="flex gap-2">
              {post.tags && post.tags.length > 0 ? (
                post.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600"
                  >
                    #{tag}
                  </span>
                ))
              ) : (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                  #general
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
