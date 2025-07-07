# JWT Authentication System

This application now includes a complete JWT (JSON Web Token) authentication system with access tokens and refresh tokens.

## Features

- **Secure Password Hashing**: Passwords are hashed using bcrypt with 12 salt rounds
- **JWT Access Tokens**: Short-lived tokens (15 minutes) for API authentication
- **JWT Refresh Tokens**: Long-lived tokens (7 days) for obtaining new access tokens
- **Automatic Token Refresh**: Client-side automatic token refresh when tokens are about to expire
- **Secure Token Storage**: Refresh tokens are stored in the database and can be invalidated
- **Protected Routes**: Middleware for protecting API routes with JWT authentication

## API Endpoints

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive access/refresh tokens
- `POST /api/auth/refresh` - Refresh access token using refresh token
- `POST /api/auth/logout` - Logout and invalidate refresh token
- `GET /api/auth/profile` - Get current user profile (protected)

### Request/Response Examples

#### Login Request
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login Response
```json
{
  "message": "Login successful",
  "user": {
    "id": "user-uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "isAdmin": false
  },
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Refresh Token Request
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Refresh Token Response
```json
{
  "message": "Tokens refreshed successfully",
  "tokens": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

## Environment Variables

Add these to your `.env` file:

```env
JWT_ACCESS_SECRET=your-super-secret-access-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production-make-it-different-from-access
```

⚠️ **Important**: Change these to strong, random keys in production!

## Usage

### Client-Side Authentication Hook

```tsx
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { user, isAuthenticated, login, logout, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Making Authenticated API Requests

```tsx
import AuthenticatedHttpClient from '@/lib/http-client';
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  const { getAccessToken, getRefreshToken, updateTokens, logout } = useAuth();

  const httpClient = new AuthenticatedHttpClient(
    '',
    () => ({ 
      accessToken: getAccessToken() || '', 
      refreshToken: getRefreshToken() || '' 
    }),
    updateTokens,
    logout
  );

  const fetchUserProfile = async () => {
    try {
      const response = await httpClient.get('/api/auth/profile');
      const data = await response.json();
      console.log('User profile:', data.user);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  return (
    <button onClick={fetchUserProfile}>
      Get Profile
    </button>
  );
}
```

### Protecting API Routes

```typescript
// In your API route
import { authenticateToken, getAuthenticatedUser } from '@/lib/auth-middleware';

export async function GET(req: NextRequest) {
  // Authenticate the request
  const authError = authenticateToken(req);
  if (authError) {
    return authError;
  }

  // Get the authenticated user
  const user = getAuthenticatedUser(req);

  return NextResponse.json({
    message: "Protected data",
    userId: user?.userId
  });
}
```

## Security Features

1. **Password Hashing**: Passwords are hashed using bcrypt with 12 salt rounds
2. **Token Expiration**: Access tokens expire in 15 minutes, refresh tokens in 7 days
3. **Token Rotation**: New refresh tokens are issued when refreshing access tokens
4. **Token Invalidation**: Refresh tokens can be invalidated on logout
5. **Secure Headers**: JWT tokens include issuer and audience claims
6. **Automatic Refresh**: Client automatically refreshes tokens before they expire

## Database Schema

The user table includes a `refreshToken` field to store the current refresh token:

```sql
ALTER TABLE "users" ADD COLUMN "refresh_token" varchar(512);
```

## Migration

Run the following commands to apply the database migrations:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Notes

- Access tokens are short-lived (15 minutes) for security
- Refresh tokens are long-lived (7 days) but can be invalidated
- The system automatically handles token refresh on the client side
- All API routes that require authentication should use the `authenticateToken` middleware
- Refresh tokens are stored in the database and validated on each refresh request
