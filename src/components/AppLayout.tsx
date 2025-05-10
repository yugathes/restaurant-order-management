
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-2">
              <div className="md:hidden">
                <SidebarTrigger>
                  <Menu className="h-5 w-5" />
                </SidebarTrigger>
              </div>
              <h1 className="text-2xl font-bold text-restaurant-700">
                Restaurant Order System
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              {currentUser && (
                <>
                  <span className="text-sm text-gray-600 hidden sm:inline">
                    {currentUser.name} ({currentUser.role})
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </>
              )}
            </div>
          </header>
          
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AppLayout;
