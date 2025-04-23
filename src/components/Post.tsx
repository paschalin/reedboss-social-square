import { useState } from 'react';
import { Heart, MessageSquare, Share, Copy, Eye, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

interface ThreadProps {
  thread: {
    id: number | string;
    title: string;
    content?: string; // renamed from body, support both for compat
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
    }>;
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
  const tags = getTags();

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

  const threadSlug = post.slug
    ? post.slug
    : post.title
      ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      : String(post.id);

  const threadUrl = `/t/${threadSlug}`;
  const userUrl = post.user ? `/u/${post.user}` : "#";
  const commentsCount = (typeof post.comments_count === "number") ? post.comments_count : 0;
  const sharesCount = (typeof post.shares_count === "number") ? post.shares_count : 0;
  const viewsCount =
    typeof post.views_count === "number"
      ? post.views_count
      : typeof post.views === "number"
        ? post.views
        : 0;

  const { toast } = useToast();
  const shareUrl = `${window.location.origin}/t/${threadSlug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copied",
        description: "Thread link copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive"
      });
    }
  };

  const shareToSocial = (platform: string) => {
    const title = encodeURIComponent(post.title);
    const url = encodeURIComponent(shareUrl);
    
    const links = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?text=${title}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      instagram: `https://www.instagram.com/` // Instagram doesn't support direct sharing
    };

    window.open(links[platform as keyof typeof links], '_blank');
  };

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
            <h3 className="font-semibold mb-1 hover:underline">{post.title}</h3>
          </Link>
          <div className="text-gray-600 mb-3">
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
            {post.media && post.media.length > 0 && (
              <div className="mb-3">
                {post.media.map((mediaItem, index) => {
                  if (mediaItem.type === 'image') {
                    return (
                      <img
                        key={index}
                        src={mediaItem.url}
                        alt={mediaItem.alt || 'Media'}
                        className="w-full h-auto rounded-md mb-2"
                      />
                    );
                  } else if (mediaItem.type === 'video') {
                    return (
                      <video
                        key={index}
                        controls
                        className="w-full h-auto rounded-md mb-2"
                      >
                        <source src={mediaItem.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    );
                  } else if (mediaItem.type === 'file') {
                    return (
                      <a
                        key={index}
                        href={mediaItem.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline block mb-2"
                      >
                        {mediaItem.alt || 'Download File'}
                      </a>
                    );
                  }
                  return null;
                })}
              </div>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <Share className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleCopyLink}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToSocial('facebook')}>
                  <Facebook className="mr-2 h-4 w-4" />
                  Share to Facebook
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToSocial('twitter')}>
                  <Twitter className="mr-2 h-4 w-4" />
                  Share to Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToSocial('linkedin')}>
                  <Linkedin className="mr-2 h-4 w-4" />
                  Share to LinkedIn
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToSocial('instagram')}>
                  <Instagram className="mr-2 h-4 w-4" />
                  Share to Instagram
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
