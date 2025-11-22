import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@stackframe/react';
import { User } from '../types';
import { apiService } from '../services/api.service';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const stackUser = useUser();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Sync Stack Auth user with our app user
    const syncUser = async () => {
      if (stackUser) {
        try {
          // Get or create user in our database
          const accessToken = await stackUser.getAuthJson();
          apiService.setToken(accessToken.access_token);
          
          // Map Stack user to our User type
          const appUser: User = {
            id: stackUser.id,
            email: stackUser.primaryEmail || '',
            fullName: stackUser.displayName || stackUser.primaryEmail || 'User',
            role: 'user',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          
          setUser(appUser);
        } catch (error) {
          console.error('Error syncing user:', error);
          setUser(null);
        }
      } else {
        setUser(null);
        apiService.clearToken();
      }
      setIsLoading(false);
    };

    syncUser();
  }, [stackUser]);

  const login = async (email: string, password: string) => {
    // Stack Auth handles login via UI components
    toast.info('Please use the Stack Auth login component');
  };

  const register = async (email: string, password: string, fullName: string) => {
    // Stack Auth handles registration via UI components
    toast.info('Please use the Stack Auth registration component');
  };

  const logout = async () => {
    try {
      await stackUser?.signOut();
      setUser(null);
      apiService.clearToken();
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Logout failed');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
