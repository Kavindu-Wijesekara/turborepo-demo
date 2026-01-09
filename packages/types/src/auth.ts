/**
 * Authentication Types
 */

export interface User {
  id: string;
  authId: string;
  name: string | null;
  email: string;
  phone: string | null;
  organizationId: number | null;
  profileCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthSession {
  user: User;
  expiresAt: Date;
}

export interface ClerkUser {
  id: string;
  emailAddresses: Array<{ emailAddress: string }>;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string;
}

export interface SupabaseUser {
  id: string;
  email: string;
  user_metadata?: Record<string, unknown>;
}
