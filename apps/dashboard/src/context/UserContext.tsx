import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

type UserRole = 'admin' | 'event_company' | 'provider' | 'operator';

interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  companyId?: string;
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  switchUser: (email: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mockEmail, setMockEmail] = useState<string | null>(localStorage.getItem('ecovolt_mock_email'));
  
  const user = useQuery(api.users.getMe, mockEmail ? { email: mockEmail } : {});
  const isLoading = user === undefined;

  const switchUser = (email: string) => {
    localStorage.setItem('ecovolt_mock_email', email);
    setMockEmail(email);
  };

  const logout = () => {
    localStorage.removeItem('ecovolt_mock_email');
    setMockEmail(null);
  };

  return (
    <UserContext.Provider value={{ 
      user: user as User | null, 
      isLoading, 
      switchUser, 
      logout 
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
