
import { Home, User, Bell, BookmarkCheck, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function ReedbossSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { title: 'Home', icon: Home, path: '/' },
    { title: 'Profile', icon: User, path: '/profile' },
    { title: 'Notifications', icon: Bell, path: '/notifications' },
    { title: 'Bookmarks', icon: BookmarkCheck, path: '/bookmarks' },
    { title: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarContent>
        <div className="p-4">
          <h1 className="text-2xl font-bold text-primary">Reedboss</h1>
        </div>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton onClick={() => navigate(item.path)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {user && (
          <div className="absolute bottom-4 left-4 right-4">
            <button
              onClick={logout}
              className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
            >
              Logout
            </button>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
