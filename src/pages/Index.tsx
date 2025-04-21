
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ReedbossSidebar } from '@/components/ReedbossSidebar';
import { LoginForm } from '@/components/LoginForm';
import { Post } from '@/components/Post';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';

const fetchPosts = async () => {
  const response = await fetch('https://dummyjson.com/posts');
  const data = await response.json();
  return data.posts;
};

const Index = () => {
  const { user, isLoading: authLoading } = useAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { data: posts, isLoading: postsLoading } = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

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
      <dialog ref={dialogRef} className="rounded-lg p-0">
        <LoginForm />
      </dialog>
    </SidebarProvider>
  );
};

export default Index;
