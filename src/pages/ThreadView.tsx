import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card } from "@/components/ui/card";
import { MessageSquare, Share, Eye } from "lucide-react";
import { ReedbossSidebar } from "@/components/ReedbossSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { TopNavbar } from "@/components/TopNavbar";
import { LoginForm } from '@/components/LoginForm';
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CommentForm } from "@/components/CommentForm";
import React from "react";

interface ThreadViewProps {
  onOpenLoginDialog: () => void;
}

// Define Thread interface for type safety
interface Thread {
  id: number;
  slug: string;
  title: string;
  content: string;
  user: string | number;
  hashtags: string[];
  comments_count: number;
  shares_count: number;
  views_count: number;
}

// Updated fetchThread function to fetch a single thread by slug
const fetchThread = async (slug: string): Promise<Thread> => {
  const response = await fetch(`http://127.0.0.1:8000/api/threads/${slug}/`);
  if (!response.ok) {
    throw new Error(`Failed to fetch thread: ${response.statusText}`);
  }
  const thread = await response.json();
  return thread;
};

export default function ThreadView({ onOpenLoginDialog }: ThreadViewProps) {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useQuery<Thread, Error>({
    queryKey: ["thread", slug],
    queryFn: () => fetchThread(slug!),
    enabled: !!slug,
  });
  const [showCommentForm, setShowCommentForm] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const toggleCommentForm = () => {
    setShowCommentForm(!showCommentForm);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen bg-background">
        <TopNavbar onOpenLoginDialog={onOpenLoginDialog} />
        <div className="flex w-full mx-auto max-w-7xl">
          <ReedbossSidebar />
          <main className="flex-1 min-w-0">
            {isLoading ? (
              <div className="p-6">Loading thread...</div>
            ) : error ? (
              <div className="p-6 text-red-600">{error.message}</div>
            ) : post ? (
              <div className="max-w-xl mx-auto py-6">
                <Helmet>
                  <title>{post.title} | Reedboss</title>
                  <meta name="description" content={post.content.slice(0, 160)} />
                  <meta property="og:title" content={post.title} />
                  <meta property="og:description" content={post.content.slice(0, 160)} />
                </Helmet>
                <Card className="p-6">
                  <div className="mb-4">
                    <h1 className="text-2xl font-bold">{post.title}</h1>
                    <Link to={`/u/${post.user}`} className="text-xs text-blue-600 hover:underline">
                      by User {post.user}
                    </Link>
                  </div>
                  <div className="mb-3 whitespace-pre-line">{post.content}</div>
                  <div className="flex gap-2 mb-3">
                  {Array.isArray(post.hashtags) && post.hashtags.length > 0 ? (
                      post.hashtags.map((tag) => (
                        <span key={tag} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                          #{tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">#general</span>
                    )}
                  </div>
                  <div className="flex items-center gap-5 mt-4 text-gray-600">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleCommentForm}
                      className="flex items-center gap-2 text-gray-600"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments_count ?? 0}</span>
                    </Button>
                    <div className="flex gap-1 items-center">
                      <Share className="w-4 h-4" />
                      <span>{post.shares_count ?? 0}</span>
                    </div>
                    <div className="flex gap-1 items-center">
                      <Eye className="w-4 h-4" />
                      <span>{post.views_count ?? 0}</span>
                    </div>
                  </div>
                </Card>
                {showCommentForm && slug && (
                  <div className="mt-4">
                    <CommentForm threadId={post.id} onCommentSubmit={() => {}} />
                  </div>
                )}
              </div>
            ) : null}
          </main>
          <RightSidebar />
        </div>
      </div>      
    </SidebarProvider>
  );
}