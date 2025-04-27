import { useState } from 'react';
import { Heart, MessageSquare, Eye } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from "react-router-dom";
import { PostContent } from './post/PostContent';
import { PostMedia } from './post/PostMedia';
import { PostTags } from './post/PostTags';
import { PostShareMenu } from './post/PostShareMenu';

interface ThreadProps {
  thread: {
    id: number | string;
    title: string;
    content?: string;
    body?: string;
    user?: number;
    reactions?: number | { likes: number; dislikes: number };
    views?: number;
    tags?: string[] | string;
    slug?: string;
    likes?: number;
    comments_count?: number;
    shares_count?: number;
    views_count?: number;
    hashtags?: string[] | string;
    media?: Array<{
      type: 'image' | 'video' | 'file';
      url: string;
      alt?: string;
    }> | {
      id: number | string;
      file: string;
      content_type?: string;
      media_id?: string;
      uploaded_at?: string;
    };
  };
}

export function Post({ thread: post }: ThreadProps) {
  const content = post.content || post.body || "";

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
  
  const getInitialLikes = () => {
    if (typeof post.likes === "number") return post.likes;
    if (post.reactions && typeof post.reactions === "object")
      return post.reactions.likes || 0;
    if (typeof post.reactions === "number") return post.reactions;
    return 0;
  };
  
  const [likes, setLikes] = useState(getInitialLikes());
  const [isLiked, setIsLiked] = useState(false);

  const toggleLike = () => {
    if (isLiked) setLikes(likes - 1);
    else setLikes(likes + 1);
    setIsLiked((v) => !v);
  };

  const threadSlug = post.slug
    ? post.slug
    : post.title
      ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      : String(post.id);

  const threadUrl = `/t/${threadSlug}`;
  const userUrl = post.user ? `/u/${post.user}` : "#";
  const commentsCount = (typeof post.comments_count === "number") ? post.comments_count : 0;
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
          <Link to={userUrl} className="w-5 h-5 rounded-full bg-primary text-white flex items-center justify-center hover:underline">
            {post.user || "-"}
          </Link>
        </div>
        <div className="flex-1">
          <Link to={threadUrl}>
            <h3 className="font-semibold text-gray-700 mb-1 hover:underline">{post.title}</h3>
          </Link>
            <div className="break-words text-base text-gray-600 sm:text-[1rem] leading-relaxed max-w-full overflow-x-auto" style={{ wordBreak: "break-word" }}>
              <PostContent content={content} />
            </div>
            <div className="my-2 ">
              {Array.isArray(post.media) && post.media.length > 0 && post.media[0].type !== "file" ? (
                <PostMedia media={post.media} className="w-full max-w-xs h-auto object-contain rounded" />
              ) : Array.isArray(post.media) && post.media.length > 0 ? (
                <PostMedia media={post.media} className="w-full max-w-xs h-auto object-contain rounded" />
              ) : (
                <PostMedia media={post.media} className="w-full max-w-xs h-auto object-contain rounded" />
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
            <PostShareMenu threadSlug={threadSlug} title={post.title} />
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Eye className="w-4 h-4" />
              <span>{viewsCount}</span>
            </div>
            <Link
              to={threadUrl}
              className="ml-2 text-sm text-blue-600 hover:underline"
            >
              View Thread
            </Link>
          </div>
          <PostTags tags={getTags()} />
        </div>
      </div>
    </Card>
  );
}
