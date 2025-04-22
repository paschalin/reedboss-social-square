
import { Search, Menu, CirclePlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/contexts/AuthContext"
import { useIsMobile } from "@/hooks/use-mobile"

interface TopNavbarProps {
  onOpenSidebar: () => void;
  onOpenLoginDialog: () => void;
}

export function TopNavbar({ onOpenSidebar, onOpenLoginDialog }: TopNavbarProps) {
  const { user } = useAuth();
  const isMobile = useIsMobile();

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onOpenSidebar} className="mr-2">
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <h1 className="text-xl font-semibold text-primary">Reedboss</h1>
        </div>

        <div className="flex items-center flex-1 gap-4 justify-end md:justify-between">
          <div className="hidden md:flex relative max-w-sm flex-1 mx-8">
            <Input
              type="search"
              placeholder="Search..."
              className="pl-8"
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>

          <div className="flex items-center gap-2">
            {!isMobile && (
              <Button variant="ghost" size="icon" className="md:hidden">
                <Search className="h-5 w-5" />
              </Button>
            )}
            
            {user ? (
              <Button size="icon">
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
    </nav>
  );
}
