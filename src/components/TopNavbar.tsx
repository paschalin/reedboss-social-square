
import { Search, Menu, CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ReedbossSidebar } from "./ReedbossSidebar"
import { CreateThreadForm } from "./CreateThreadForm"
import { ThemeToggle } from "./ThemeToggle"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "./ui/input"
import { Form } from "./ui/form"

interface TopNavbarProps {
  onOpenLoginDialog: () => void;
}

export function TopNavbar({ onOpenLoginDialog }: TopNavbarProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [isCreateThreadOpen, setIsCreateThreadOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue("");
    }
  };

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
          <form onSubmit={handleSearch} className="hidden md:flex relative max-w-sm flex-1 mx-8">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </form>

          <div className="flex items-center gap-2">
            {!isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden"
                onClick={() => navigate('/search')}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            <ThemeToggle />
            
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
