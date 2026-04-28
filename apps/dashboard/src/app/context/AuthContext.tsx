import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'ADMIN' | 'EVENT_COMPANY' | 'ENERGY_PROVIDER' | 'FINANCIAL';

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('ADMIN');

  return (
    <AuthContext.Provider value={{ role, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
