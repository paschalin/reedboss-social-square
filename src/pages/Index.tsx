
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ReedbossSidebar } from '@/components/ReedbossSidebar';
import { LoginForm } from '@/components/LoginForm';
import { Post } from '@/components/Post';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';

const fetchPosts = async () => {
  const response = await fetch('https://dummyjson.com/posts');
  const data = await response.json();
  return data.posts;
};

const Index = () => {
  const { user, isLoading: authLoading } = useAuth();
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  if (authLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <LoginForm />
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <ReedbossSidebar />
        <main className="flex-1 max-w-2xl mx-auto p-4 md:p-6">
          <h2 className="text-xl font-semibold mb-6">Your Feed</h2>
          {postsLoading ? (
            <div>Loading posts...</div>
          ) : (
            <div className="space-y-4">
              {posts?.map((post: any) => (
                <Post key={post.id} post={post} />
              ))}
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
