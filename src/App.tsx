
import { Toaster } from "@/components/ui/toaster";
import { LoginForm } from "@/components/LoginForm";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import ThreadView from "./pages/ThreadView";
import UserProfile from "./pages/UserProfile";
import ChatPage from "./pages/Chat";
import Search from "./pages/Search";
import { useState } from "react";

const queryClient = new QueryClient();

const App = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const openLoginDialog = () => setIsLoginOpen(true);
  const closeLoginDialog = () => setIsLoginOpen(false);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              {/* Pass openLoginDialog to all routes as context or prop */}
              <Routes>
                <Route path="/" element={<Index onOpenLoginDialog={openLoginDialog} />} />
                <Route path="/search" element={<Search onOpenLoginDialog={openLoginDialog} />} />
                <Route path="/threads/:slug" element={<ThreadView onOpenLoginDialog={openLoginDialog} />} />
                <Route path="/u/:userId" element={<UserProfile onOpenLoginDialog={openLoginDialog} />} />
                <Route path="/chat/:peerId" element={<ChatPage onOpenLoginDialog={openLoginDialog} />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <LoginForm isOpen={isLoginOpen} onClose={closeLoginDialog} />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
