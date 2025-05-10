
import React, { createContext, useState, useContext } from 'react';
import { MenuItem } from '../types';
import { toast } from "@/hooks/use-toast";

interface MenuContextType {
  menuItems: MenuItem[];
  categories: string[];
  getItemsByCategory: (category: string) => MenuItem[];
  getItemById: (id: string) => MenuItem | undefined;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
}

const MenuContext = createContext<MenuContextType>({
  menuItems: [],
  categories: [],
  getItemsByCategory: () => [],
  getItemById: () => undefined,
  addMenuItem: () => {},
  updateMenuItem: () => {},
  deleteMenuItem: () => {},
});

// Sample menu items for demonstration
const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and special sauce',
    price: 12.99,
    category: 'Mains',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'French Fries',
    description: 'Crispy golden fries with sea salt',
    price: 4.99,
    category: 'Sides',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with Caesar dressing and croutons',
    price: 9.99,
    category: 'Salads',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Chicken Sandwich',
    description: 'Grilled chicken breast with lettuce, mayo, and pickles',
    price: 11.99,
    category: 'Mains',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'Chocolate Brownie',
    description: 'Warm chocolate brownie with vanilla ice cream',
    price: 7.99,
    category: 'Desserts',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '6',
    name: 'Lemonade',
    description: 'Fresh squeezed lemonade with mint',
    price: 3.99,
    category: 'Drinks',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '7',
    name: 'Fish & Chips',
    description: 'Beer battered cod with thick-cut fries and tartar sauce',
    price: 14.99,
    category: 'Mains',
    imageUrl: '/placeholder.svg'
  },
  {
    id: '8',
    name: 'Onion Rings',
    description: 'Crispy beer-battered onion rings',
    price: 5.99,
    category: 'Sides',
    imageUrl: '/placeholder.svg'
  }
];

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(initialMenuItems);
  
  // Extract unique categories
  const categories = Array.from(new Set(menuItems.map(item => item.category)));

  const getItemsByCategory = (category: string) => {
    return menuItems.filter(item => item.category === category);
  };

  const getItemById = (id: string) => {
    return menuItems.find(item => item.id === id);
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    const newItem = {
      ...item,
      id: `${Date.now()}`, // Generate a unique ID
    };
    setMenuItems(prev => [...prev, newItem]);
    toast({
      title: "Item Added",
      description: `${item.name} has been added to the menu.`,
    });
  };

  const updateMenuItem = (id: string, item: Partial<MenuItem>) => {
    setMenuItems(prev => 
      prev.map(menuItem => menuItem.id === id ? { ...menuItem, ...item } : menuItem)
    );
    toast({
      title: "Item Updated",
      description: `Menu item has been updated.`,
    });
  };

  const deleteMenuItem = (id: string) => {
    const itemToDelete = menuItems.find(item => item.id === id);
    setMenuItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Item Deleted",
      description: itemToDelete ? `${itemToDelete.name} has been removed from the menu.` : "Item removed from the menu.",
    });
  };

  return (
    <MenuContext.Provider value={{
      menuItems,
      categories,
      getItemsByCategory,
      getItemById,
      addMenuItem,
      updateMenuItem,
      deleteMenuItem
    }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => useContext(MenuContext);
