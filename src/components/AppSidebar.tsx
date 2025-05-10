
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Sidebar, 
  SidebarContent,
  SidebarTrigger, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  useSidebar 
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/AuthContext';

const AppSidebar: React.FC = () => {
  const { state, isMobile, openMobile, setOpenMobile } = useSidebar();
  const { currentUser } = useAuth();
  const location = useLocation();
  
  // Check if sidebar is collapsed based on state
  const collapsed = state === 'collapsed';

  // Define different navigation items based on user role
  const getNavigationItems = () => {
    const commonItems = [
      { title: 'Dashboard', path: '/' },
    ];

    const serverItems = [
      { title: 'Tables', path: '/tables' },
      { title: 'Orders', path: '/orders' },
    ];

    const kitchenItems = [
      { title: 'Kitchen Display', path: '/kitchen' },
    ];

    const managerItems = [
      { title: 'Reports', path: '/reports' },
      { title: 'Manage Menu', path: '/menu-management' },
    ];

    if (!currentUser) return commonItems;

    switch (currentUser.role) {
      case 'server':
        return [...commonItems, ...serverItems];
      case 'kitchen':
        return [...commonItems, ...kitchenItems];
      case 'manager':
        return [...commonItems, ...serverItems, ...kitchenItems, ...managerItems];
      default:
        return commonItems;
    }
  };

  const navItems = getNavigationItems();

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `w-full flex items-center px-3 py-2 rounded-md transition-colors ${
      isActive 
        ? 'bg-restaurant-100 text-restaurant-700 font-medium' 
        : 'text-gray-600 hover:bg-gray-100'
    }`;

  // Handle mobile menu toggle
  const handleMobileMenuToggle = () => {
    if (isMobile) {
      setOpenMobile(!openMobile);
    }
  };

  return (
    <Sidebar className={collapsed ? "w-16" : "w-56"} collapsible="icon">
      <SidebarTrigger className="m-2 self-end" />
      
      <SidebarContent>
        <div className="mb-4 flex justify-center">
          {!collapsed && (
            <span className="text-xl font-bold text-restaurant-700">
              RestaurantOS
            </span>
          )}
          {collapsed && (
            <span className="text-xl font-bold text-restaurant-700">
              R
            </span>
          )}
        </div>
        
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton asChild className="w-full">
                <NavLink 
                  to={item.path} 
                  className={getNavClass}
                  onClick={isMobile ? handleMobileMenuToggle : undefined}
                >
                  <span className="w-full">{!collapsed ? item.title : item.title.charAt(0)}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
