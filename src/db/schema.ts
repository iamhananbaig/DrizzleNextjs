import {
  mysqlTable,
  varchar,
  text,
  timestamp,
  boolean,
  int,
} from "drizzle-orm/mysql-core";

export const user = mysqlTable("user", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

export const permission = mysqlTable("permission", {
  id: int("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

// Role Table (corrected table name)
export const role = mysqlTable("role", {
  id: int("id").primaryKey(),
  name: text("name").notNull(),
});

// RolePermissions Table (Many-to-Many between roles and permissions)
export const rolePermissions = mysqlTable("role_permissions", {
  roleId: int("role_id")
    .notNull()
    .references(() => role.id),
  permissionId: int("permission_id")
    .notNull()
    .references(() => permission.id),
});

// UserRoles Table (Many-to-Many between users and roles)
export const userRoles = mysqlTable("user_roles", {
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => user.id),
  roleId: int("role_id")
    .notNull()
    .references(() => role.id),
});

// Exporting the schema
export const schema = {
  user,
  session,
  account,
  verification,
  role,
  permission,
  rolePermissions,
  userRoles,
};
