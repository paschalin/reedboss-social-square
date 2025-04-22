
import { useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ReedbossSidebar } from '@/components/ReedbossSidebar';
import { RightSidebar } from '@/components/RightSidebar';
import { TopNavbar } from '@/components/TopNavbar';
import { LoginForm } from '@/components/LoginForm';
import { Post } from '@/components/Post';
import { Button } from '@/components/ui/button';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useQuery } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

// Updated fetchThreads to match your API
const fetchThreads = async () => {
  try {
    console.log('Fetching threads...');
    const response = await fetch('http://127.0.0.1:8000/api/threads');
    if (!response.ok) {
      throw new Error(`Failed to fetch threads: ${response.status}`);
    }
    const data = await response.json();
    // Expecting data.results or data.threads depending on your API structure.
    // We'll support both for flexibility.
    console.log('Threads received:', data);
    return data.results || data.threads || data;
  } catch (error) {
    console.error('Error fetching threads:', error);
    toast({
      title: "Error loading threads",
      description: "There was a problem loading the threads",
      variant: "destructive"
    });
    return [];
  }
};

const Index = () => {
  const { user, isLoading: authLoading } = useAuth();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { data: threads, isLoading: threadsLoading, error } = useQuery({
    queryKey: ['threads'],
    queryFn: fetchThreads,
  });

  useEffect(() => {
    toast({
      title: "Welcome to Reedboss",
      description: "Explore the latest threads in your feed"
    });
  }, []);

  const openLoginDialog = () => {
    dialogRef.current?.showModal();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full flex-col">
        <TopNavbar onOpenSidebar={() => document.dispatchEvent(new CustomEvent('toggle-sidebar'))} onOpenLoginDialog={openLoginDialog} />
        <div className="flex flex-1">
          <ReedbossSidebar />
          <main className="flex-1 max-w-2xl w-full mx-auto p-4 md:p-6">
            {!user && (
              <div className="mb-6 p-4 bg-primary/5 rounded-lg">
                <p className="mb-2">Want to interact with threads? Sign in to your account!</p>
                <Button onClick={openLoginDialog}>
                  Sign In
                </Button>
              </div>
            )}
            <h2 className="text-xl font-semibold mb-6">Your Feed</h2>
            {error ? (
              <div className="p-4 border border-red-300 bg-red-50 rounded-md">
                <p className="text-red-600">Failed to load threads. Please try again later.</p>
              </div>
            ) : threadsLoading ? (
              <div className="p-4 border border-gray-200 rounded-md animate-pulse">
                <p>Loading threads...</p>
              </div>
            ) : threads && threads.length > 0 ? (
              <div className="space-y-4">
                {threads.map((thread: any) => (
                  <Post key={thread.id} post={thread} />
                ))}
              </div>
            ) : (
              <div className="p-4 border border-gray-200 rounded-md">
                <p>No threads found. Check back later!</p>
              </div>
            )}
          </main>
          <RightSidebar />
        </div>
      </div>
      <dialog ref={dialogRef} className="rounded-lg p-0">
        <LoginForm />
      </dialog>
    </SidebarProvider>
  );
};

export default Index;
