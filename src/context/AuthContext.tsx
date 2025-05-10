
import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  login: async () => false,
  logout: () => {},
  isAuthenticated: false,
});

// Mock users for demo purposes
const mockUsers: User[] = [
  { id: '1', name: 'Server User', role: 'server' as Role },
  { id: '2', name: 'Kitchen User', role: 'kitchen' as Role },
  { id: '3', name: 'Manager User', role: 'manager' as Role },
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored user on component mount
    const storedUser = localStorage.getItem('restaurantUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would validate against a backend
    // Here we're just simulating authentication with mock data
    
    // For demo, match username with our mock users
    const matchedUser = mockUsers.find(user => 
      user.name.toLowerCase() === username.toLowerCase()
    );
    
    if (matchedUser) {
      localStorage.setItem('restaurantUser', JSON.stringify(matchedUser));
      setCurrentUser(matchedUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('restaurantUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
