import { useState, useEffect } from 'react';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface User {
  id: string;
  email: string;
  name: string | null;
  isAdmin: boolean;
}

interface AuthState {
  user: User | null;
  tokens: TokenPair | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const TOKEN_STORAGE_KEY = 'auth_tokens';
const USER_STORAGE_KEY = 'auth_user';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    tokens: null,
    isLoading: true,
    isAuthenticated: false,
  });

  // Load tokens and user from localStorage on mount
  useEffect(() => {
    const loadStoredAuth = () => {
      try {
        const storedTokens = localStorage.getItem(TOKEN_STORAGE_KEY);
        const storedUser = localStorage.getItem(USER_STORAGE_KEY);

        if (storedTokens && storedUser) {
          const tokens: TokenPair = JSON.parse(storedTokens);
          const user: User = JSON.parse(storedUser);
          
          setAuthState({
            user,
            tokens,
            isLoading: false,
            isAuthenticated: true,
          });
        } else {
          setAuthState({
            user: null,
            tokens: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } catch (error) {
        console.error('Error loading auth state:', error);
        setAuthState({
          user: null,
          tokens: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    loadStoredAuth();
  }, []);

  const login = (user: User, tokens: TokenPair) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    
    setAuthState({
      user,
      tokens,
      isLoading: false,
      isAuthenticated: true,
    });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    
    setAuthState({
      user: null,
      tokens: null,
      isLoading: false,
      isAuthenticated: false,
    });
  };

  const updateTokens = (tokens: TokenPair) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
    
    setAuthState(prev => ({
      ...prev,
      tokens,
    }));
  };

  const getAccessToken = (): string | null => {
    return authState.tokens?.accessToken || null;
  };

  const getRefreshToken = (): string | null => {
    return authState.tokens?.refreshToken || null;
  };

  const isTokenExpired = (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  };

  const shouldRefreshToken = (): boolean => {
    const accessToken = getAccessToken();
    if (!accessToken) return false;
    
    // Check if token expires in the next 5 minutes
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = payload.exp - currentTime;
      return timeUntilExpiry < 300; // 5 minutes
    } catch (error) {
      return true;
    }
  };

  const refreshTokens = async (): Promise<boolean> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        updateTokens(data.tokens);
        return true;
      } else {
        // Refresh failed, logout user
        logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
      return false;
    }
  };

  return {
    ...authState,
    login,
    logout,
    updateTokens,
    getAccessToken,
    getRefreshToken,
    isTokenExpired,
    shouldRefreshToken,
    refreshTokens,
  };
};
