
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ReedbossSidebar } from '@/components/ReedbossSidebar';
import { LoginForm } from '@/components/LoginForm';
import { Post } from '@/components/Post';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

const fetchPosts = async () => {
  try {
    console.log('Fetching posts...');
    const response = await fetch('https://dummyjson.com/posts');
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }
    const data = await response.json();
    console.log('Posts received:', data.posts);
    return data.posts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    toast({
      title: "Error loading posts",
      description: "There was a problem loading the posts",
      variant: "destructive"
    });
    return [];
  }
};

const Index = () => {
  const { user, isLoading: authLoading } = useAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { data: posts, isLoading: postsLoading, error } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  console.log('Render state:', { posts, postsLoading, error, user });

  useEffect(() => {
    // Show a welcome toast when component mounts
    toast({
      title: "Welcome to Reedboss",
      description: "Explore the latest posts in your feed"
    });
  }, []);

  const openLoginDialog = () => {
    dialogRef.current?.showModal();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ReedbossSidebar />
        <main className="flex-1 max-w-2xl mx-auto p-4 md:p-6">
          {!user && (
            <div className="mb-6 p-4 bg-primary/5 rounded-lg">
              <p className="mb-2">Want to interact with posts? Sign in to your account!</p>
              <Button onClick={openLoginDialog}>
                Sign In
              </Button>
            </div>
          )}
          <h2 className="text-xl font-semibold mb-6">Your Feed</h2>
          
          {error ? (
            <div className="p-4 border border-red-300 bg-red-50 rounded-md">
              <p className="text-red-600">Failed to load posts. Please try again later.</p>
            </div>
          ) : postsLoading ? (
            <div className="p-4 border border-gray-200 rounded-md animate-pulse">
              <p>Loading posts...</p>
            </div>
          ) : posts && posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post: any) => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="p-4 border border-gray-200 rounded-md">
              <p>No posts found. Check back later!</p>
            </div>
          )}
        </main>
      </div>
      <dialog ref={dialogRef} className="rounded-lg p-0">
        <LoginForm />
      </dialog>
    </SidebarProvider>
  );
};

export default Index;
