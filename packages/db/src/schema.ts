import {
  pgTable,
  serial,
  text,
  timestamp,
  integer,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const inviteStatusEnum = pgEnum("invite_status", [
  "pending",
  "accepted",
  "expired",
  "cancelled",
]);

// Organizations table
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  createdBy: integer("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  authId: text("auth_id").unique().notNull(),
  name: text("name"),
  email: text("email").notNull(),
  phone: text("phone"),
  organizationId: integer("organization_id").references(
    () => organizations.id,
    { onDelete: "set null" },
  ),
  profileCompleted: boolean("profile_completed").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Posts table
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Invites table
export const invites = pgTable("invites", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id")
    .references(() => organizations.id, { onDelete: "cascade" })
    .notNull(),
  email: text("email").notNull(),
  code: text("code").unique().notNull(),
  status: inviteStatusEnum("status").default("pending").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdBy: integer("created_by")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Services table (products/subscriptions)
export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price"), // in cents
  category: text("category"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// User-Services junction table
export const userServices = pgTable("user_services", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  serviceId: integer("service_id")
    .references(() => services.id, { onDelete: "cascade" })
    .notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
});

// Relations
export const organizationsRelations = relations(
  organizations,
  ({ many, one }) => ({
    users: many(users, { relationName: "organizationMembers" }),
    invites: many(invites),
    creator: one(users, {
      fields: [organizations.createdBy],
      references: [users.id],
      relationName: "organizationCreator",
    }),
  }),
);

export const usersRelations = relations(users, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
    relationName: "organizationMembers",
  }),
  posts: many(posts),
  userServices: many(userServices),
  createdInvites: many(invites),
  createdOrganizations: many(organizations, {
    relationName: "organizationCreator",
  }),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  user: one(users, {
    fields: [posts.userId],
    references: [users.id],
  }),
}));

export const invitesRelations = relations(invites, ({ one }) => ({
  organization: one(organizations, {
    fields: [invites.organizationId],
    references: [organizations.id],
  }),
  creator: one(users, {
    fields: [invites.createdBy],
    references: [users.id],
  }),
}));

export const servicesRelations = relations(services, ({ many }) => ({
  userServices: many(userServices),
}));

export const userServicesRelations = relations(userServices, ({ one }) => ({
  user: one(users, {
    fields: [userServices.userId],
    references: [users.id],
  }),
  service: one(services, {
    fields: [userServices.serviceId],
    references: [services.id],
  }),
}));

// Types
export type Organization = typeof organizations.$inferSelect;
export type NewOrganization = typeof organizations.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Invite = typeof invites.$inferSelect;
export type NewInvite = typeof invites.$inferInsert;
export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
export type UserService = typeof userServices.$inferSelect;
export type NewUserService = typeof userServices.$inferInsert;
