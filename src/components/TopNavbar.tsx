import { Search, Menu, CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ReedbossSidebar } from "./ReedbossSidebar"
import { CreateThreadForm } from "./CreateThreadForm"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

interface TopNavbarProps {
  onOpenSidebar: () => void;
  onOpenLoginDialog: () => void;
}

export function TopNavbar({ onOpenLoginDialog }: TopNavbarProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isCreateThreadOpen, setIsCreateThreadOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <ReedbossSidebar />
              </SheetContent>
            </Sheet>
          )}
          <h1 className="text-xl font-semibold text-primary">Reedboss</h1>
        </div>

        <div className="flex items-center flex-1 gap-4 justify-end md:justify-between">
          <div className="hidden md:flex relative max-w-sm flex-1 mx-8">
            <Button
              variant="ghost"
              className="w-full justify-start pl-8"
              onClick={() => navigate('/search')}
            >
              <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
              Search...
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {!isMobile && (
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            {user ? (
              <Button size="icon" onClick={() => setIsCreateThreadOpen(true)}>
                <CirclePlus className="h-5 w-5" />
              </Button>
            ) : (
              <Button onClick={onOpenLoginDialog}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
      <CreateThreadForm 
        isOpen={isCreateThreadOpen} 
        onClose={() => setIsCreateThreadOpen(false)} 
      />
    </nav>
  );
}
