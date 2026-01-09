/**
 * Database Types
 */

export interface Organization {
  id: number;
  name: string;
  slug: string;
  createdBy: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  id: number;
  title: string;
  content: string;
  userId: number;
  createdAt: Date;
}

export interface Invite {
  id: number;
  organizationId: number;
  email: string;
  code: string;
  status: "pending" | "accepted" | "expired" | "cancelled";
  expiresAt: Date;
  createdBy: number;
  createdAt: Date;
}

export interface Service {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  isActive: boolean;
}
