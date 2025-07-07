interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

interface AuthenticatedFetchConfig extends RequestInit {
  skipAuth?: boolean;
  skipRefresh?: boolean;
}

class AuthenticatedHttpClient {
  private baseUrl: string;
  private getTokens: () => TokenPair | null;
  private updateTokens: (tokens: TokenPair) => void;
  private logout: () => void;

  constructor(
    baseUrl: string,
    getTokens: () => TokenPair | null,
    updateTokens: (tokens: TokenPair) => void,
    logout: () => void
  ) {
    this.baseUrl = baseUrl;
    this.getTokens = getTokens;
    this.updateTokens = updateTokens;
    this.logout = logout;
  }

  private async refreshTokens(): Promise<boolean> {
    const tokens = this.getTokens();
    if (!tokens?.refreshToken) return false;

    try {
      const response = await fetch(`${this.baseUrl}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: tokens.refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        this.updateTokens(data.tokens);
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.logout();
      return false;
    }
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch (error) {
      return true;
    }
  }

  private shouldRefreshToken(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = payload.exp - currentTime;
      return timeUntilExpiry < 300; // 5 minutes
    } catch (error) {
      return true;
    }
  }

  async fetch(url: string, config: AuthenticatedFetchConfig = {}): Promise<Response> {
    const { skipAuth = false, skipRefresh = false, ...fetchConfig } = config;
    
    // If skipAuth is true, make the request without authentication
    if (skipAuth) {
      return fetch(`${this.baseUrl}${url}`, fetchConfig);
    }

    const tokens = this.getTokens();
    if (!tokens?.accessToken) {
      throw new Error('No access token available');
    }

    // Check if token should be refreshed
    if (!skipRefresh && this.shouldRefreshToken(tokens.accessToken)) {
      const refreshed = await this.refreshTokens();
      if (!refreshed) {
        throw new Error('Token refresh failed');
      }
    }

    // Get updated tokens after potential refresh
    const updatedTokens = this.getTokens();
    if (!updatedTokens?.accessToken) {
      throw new Error('No access token available after refresh');
    }

    // Make the authenticated request
    const response = await fetch(`${this.baseUrl}${url}`, {
      ...fetchConfig,
      headers: {
        ...fetchConfig.headers,
        Authorization: `Bearer ${updatedTokens.accessToken}`,
      },
    });

    // If we get a 401 and haven't tried refreshing yet, try to refresh
    if (response.status === 401 && !skipRefresh) {
      const refreshed = await this.refreshTokens();
      if (refreshed) {
        // Retry the request with the new token
        const newTokens = this.getTokens();
        if (newTokens?.accessToken) {
          return fetch(`${this.baseUrl}${url}`, {
            ...fetchConfig,
            headers: {
              ...fetchConfig.headers,
              Authorization: `Bearer ${newTokens.accessToken}`,
            },
          });
        }
      }
    }

    return response;
  }

  // Convenience methods
  async get(url: string, config?: AuthenticatedFetchConfig): Promise<Response> {
    return this.fetch(url, { ...config, method: 'GET' });
  }

  async post(url: string, data?: any, config?: AuthenticatedFetchConfig): Promise<Response> {
    return this.fetch(url, {
      ...config,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(url: string, data?: any, config?: AuthenticatedFetchConfig): Promise<Response> {
    return this.fetch(url, {
      ...config,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(url: string, config?: AuthenticatedFetchConfig): Promise<Response> {
    return this.fetch(url, { ...config, method: 'DELETE' });
  }
}

export default AuthenticatedHttpClient;
