
import { useState } from 'react';
import { Heart, MessageSquare, Share, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';

// thread object is assumed to support these fields based on your backend
interface PostProps {
  post: {
    id: number | string;
    title: string;
    content?: string; // renamed from body, support both for compat
    body?: string;
    userId?: number;
    reactions?: number | { likes: number; dislikes: number };
    views?: number;
    tags?: string[] | string;
    slug?: string;
    likes?: number;
    comments_count?: number;
    shares_count?: number;
    views_count?: number;
    hashtags?: string[] | string;
  };
}

export function Post({ post }: PostProps) {
  // Prefer content over body
  const content = post.content || post.body || "";

  // Handle hashtags/tags as array or csv
  const getTags = () => {
    if (Array.isArray(post.hashtags) && post.hashtags.length > 0) {
      return post.hashtags;
    }
    if (typeof post.hashtags === "string" && post.hashtags.length > 0)
      return post.hashtags.split(",").map((t) => t.trim());
    if (Array.isArray(post.tags) && post.tags.length > 0) {
      return post.tags;
    }
    if (typeof post.tags === "string" && post.tags.length > 0)
      return post.tags.split(",").map((t) => t.trim());
    return [];
  };
  const tags = getTags();

  // Prefer post.likes or reactions.likes
  const getInitialLikes = () => {
    if (typeof post.likes === "number") return post.likes;
    if (post.reactions && typeof post.reactions === "object")
      return post.reactions.likes || 0;
    if (typeof post.reactions === "number") return post.reactions;
    return 0;
  };
  
  const [likes, setLikes] = useState(getInitialLikes());
  const [isLiked, setIsLiked] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const READ_MORE_LIMIT = 160;

  const toggleLike = () => {
    if (isLiked) setLikes(likes - 1);
    else setLikes(likes + 1);
    setIsLiked((v) => !v);
  };

  // Use slug, fallback to id, for thread link
  const threadSlug = post.slug
    ? post.slug
    : post.title
      ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      : String(post.id);

  const threadUrl = `http://localhost:8080/t/${threadSlug}`;
  const commentsCount = (typeof post.comments_count === "number") ? post.comments_count : 0;
  const sharesCount = (typeof post.shares_count === "number") ? post.shares_count : 0;
  const viewsCount =
    typeof post.views_count === "number"
      ? post.views_count
      : typeof post.views === "number"
        ? post.views
        : 0;

  return (
    <Card className="p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center">
            {post.userId || "-"}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1">{post.title}</h3>
          <div className="text-gray-600 mb-3">
            {/* Readmore logic */}
            {content.length > READ_MORE_LIMIT && !expanded ? (
              <>
                {content.slice(0, READ_MORE_LIMIT) + "... "}
                <button className="text-blue-600 text-xs font-medium ml-2 hover:underline" onClick={() => setExpanded(true)}>
                  Read more
                </button>
              </>
            ) : (
              <>
                {content}
                {content.length > READ_MORE_LIMIT && expanded && (
                  <button className="text-blue-600 text-xs font-medium ml-2 hover:underline" onClick={() => setExpanded(false)}>
                    Show less
                  </button>
                )}
              </>
            )}
          </div>
          <div className="flex items-center gap-4 mb-2">
            <button
              onClick={toggleLike}
              className={`flex items-center gap-1 text-sm ${
                isLiked ? 'text-red-500' : 'text-gray-500'
              } hover:text-red-500 transition-colors`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              <span>{likes}</span>
            </button>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MessageSquare className="w-4 h-4" />
              <span>{commentsCount}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Share className="w-4 h-4" />
              <span>{sharesCount}</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Eye className="w-4 h-4" />
              <span>{viewsCount}</span>
            </div>
            <a
              href={threadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-sm text-blue-600 hover:underline"
            >
              View Thread
            </a>
          </div>
          <div className="flex gap-2">
            {tags.length > 0
              ? tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600"
                  >
                    #{tag}
                  </span>
                ))
              : (
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                  #general
                </span>
              )}
          </div>
        </div>
      </div>
    </Card>
  );
}
