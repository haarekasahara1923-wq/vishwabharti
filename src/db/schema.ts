import {
  pgTable,
  serial,
  text,
  varchar,
  boolean,
  integer,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
export const galleryTypeEnum = pgEnum("gallery_type", ["photo", "video"]);
export const aboutRoleEnum = pgEnum("about_role", ["director", "principal"]);

// Admin users table
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Gallery items table
export const galleryItems = pgTable("gallery_items", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  type: galleryTypeEnum("type").notNull().default("photo"),
  cloudinaryUrl: text("cloudinary_url").notNull(),
  cloudinaryPublicId: text("cloudinary_public_id").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  category: varchar("category", { length: 100 }),
  description: text("description"),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// About us content (director / principal)
export const aboutContent = pgTable("about_content", {
  id: serial("id").primaryKey(),
  role: aboutRoleEnum("role").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  designation: varchar("designation", { length: 150 }),
  message: text("message"),
  photoUrl: text("photo_url"),
  photoPublicId: text("photo_public_id"),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Contact information
export const contactInfo = pgTable("contact_info", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 20 }),
  whatsapp: varchar("whatsapp", { length: 20 }),
  email: varchar("email", { length: 100 }),
  address: text("address"),
  mapEmbedUrl: text("map_embed_url"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Announcements
export const announcements = pgTable("announcements", {
  id: serial("id").primaryKey(),
  text: text("text").notNull(),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Site settings (key-value pairs)
export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).unique().notNull(),
  value: text("value"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Class details
export const classDetails = pgTable("class_details", {
  id: serial("id").primaryKey(),
  fromClass: varchar("from_class", { length: 50 }).notNull(),
  toClass: varchar("to_class", { length: 50 }).notNull(),
  description: text("description"),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});
