
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Card } from "@/components/ui/card";
import { MessageSquare, Share, Eye } from "lucide-react";
import { ReedbossSidebar } from "@/components/ReedbossSidebar";
import { RightSidebar } from "@/components/RightSidebar";
import { TopNavbar } from "@/components/TopNavbar";
import React from "react";

const fetchThread = async (slug: string | undefined) => {
  if (!slug) throw new Error("Missing slug");
  const response = await fetch(`http://127.0.0.1:8000/api/threads`);
  if (!response.ok) throw new Error("Failed to fetch thread");
  const threads = await response.json();
  // Find the thread by slug, fallback to id = slug if numeric
  const thread =
    threads.find((t: any) => t.slug === slug) ||
    threads.find((t: any) => String(t.id) === slug);
  if (!thread) throw new Error("Thread not found");
  return thread;
};

export default function ThreadView() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["thread", slug],
    queryFn: () => fetchThread(slug),
    enabled: !!slug,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Layout
  return (
    <div className="min-h-screen bg-background">
      <TopNavbar onOpenSidebar={() => {}} onOpenLoginDialog={() => {}} />
      <div className="flex w-full mx-auto max-w-7xl">
        <ReedbossSidebar />
        <main className="flex-1 min-w-0">
          {isLoading ? (
            <div className="p-6">Loading thread...</div>
          ) : error ? (
            <div className="p-6 text-red-600">Thread not found.</div>
          ) : post ? (
            <div className="max-w-xl mx-auto py-6">
              <Helmet>
                <title>{post.title} | Reedboss</title>
                <meta name="description" content={(post.content || post.body || "").slice(0, 160)} />
                <meta property="og:title" content={post.title} />
                <meta property="og:description" content={(post.content || post.body || "").slice(0, 160)} />
              </Helmet>
              <Card className="p-6">
                <div className="mb-4">
                  <h1 className="text-2xl font-bold">{post.title}</h1>
                  <Link to={`/u/${post.user ? String(post.user) : "unknown"}`} className="text-xs text-blue-600 hover:underline">
                    by User {post.user ? String(post.user) : "unknown"}
                  </Link>
                </div>
                <div className="mb-3 whitespace-pre-line">{post.content || post.body || ""}</div>
                <div className="flex gap-2 mb-3">
                  {(typeof post.hashtags === "string"
                    ? post.hashtags.split(",").map((t: string) => t.trim())
                    : post.hashtags) && Array.isArray(post.hashtags) && post.hashtags[0] !== "" ? (
                    post.hashtags.map((t: string) => (
                      <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">#{t}</span>
                    ))
                  ) : (
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600">#general</span>
                  )}
                </div>
                <div className="flex items-center gap-5 mt-4 text-gray-600">
                  <div className="flex gap-1 items-center">
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments_count ?? 0}</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <Share className="w-4 h-4" />
                    <span>{post.shares_count ?? 0}</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <Eye className="w-4 h-4" />
                    <span>{post.views_count ?? post.views ?? 0}</span>
                  </div>
                </div>
              </Card>
            </div>
          ) : null}
        </main>
        <RightSidebar />
      </div>
    </div>
  );
}
