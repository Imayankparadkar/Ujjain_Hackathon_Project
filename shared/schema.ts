import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  aadhaarNumber: text("aadhaar_number"),
  emergencyContact: text("emergency_contact"),
  qrId: text("qr_id").unique(),
  isVerified: boolean("is_verified").default(false),
  isBlocked: boolean("is_blocked").default(false),
  role: text("role").default("user"), // user, admin
  currentLocation: text("current_location"),
  savedRoutes: json("saved_routes").$type<string[]>().default([]),
  language: text("language").default("en"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const lostAndFound = pgTable("lost_and_found", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // missing_person, missing_item, found_person, found_item
  reportedBy: text("reported_by").notNull(),
  contactPhone: text("contact_phone").notNull(),
  description: text("description").notNull(),
  lastSeenLocation: text("last_seen_location"),
  status: text("status").default("active"), // active, resolved, closed
  isApproved: boolean("is_approved").default(false),
  assignedOfficer: text("assigned_officer"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const safetyAlerts = pgTable("safety_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  message: text("message").notNull(),
  alertType: text("alert_type").notNull(), // crowd, emergency, weather, route
  priority: text("priority").notNull(), // low, medium, high, critical
  location: text("location"),
  isActive: boolean("is_active").default(true),
  createdBy: text("created_by").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const spiritualEvents = pgTable("spiritual_events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  dateTime: timestamp("date_time").notNull(),
  duration: integer("duration"), // in minutes
  isLive: boolean("is_live").default(false),
  liveStreamUrl: text("live_stream_url"),
  reminderUserIds: json("reminder_user_ids").$type<string[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const cleanlinessReports = pgTable("cleanliness_reports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  facilityType: text("facility_type").notNull(), // toilet, ghat, general
  rating: integer("rating").notNull(), // 1-5
  feedback: text("feedback"),
  reportedBy: text("reported_by").notNull(),
  isResolved: boolean("is_resolved").default(false),
  assignedStaff: text("assigned_staff"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const crowdData = pgTable("crowd_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  location: text("location").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  crowdCount: integer("crowd_count").notNull(),
  densityLevel: text("density_level").notNull(), // low, medium, high, critical
  timestamp: timestamp("timestamp").defaultNow(),
});

export const helpBooths = pgTable("help_booths", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  location: text("location").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
  volunteers: json("volunteers").$type<string[]>().default([]),
  isActive: boolean("is_active").default(true),
  contactNumber: text("contact_number"),
  services: json("services").$type<string[]>().default([]),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: text("user_id"),
  message: text("message").notNull(),
  response: text("response"),
  language: text("language").default("en"),
  sessionId: text("session_id"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  qrId: true,
});

export const insertLostAndFoundSchema = createInsertSchema(lostAndFound).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertSafetyAlertSchema = createInsertSchema(safetyAlerts).omit({
  id: true,
  createdAt: true,
});

export const insertSpiritualEventSchema = createInsertSchema(spiritualEvents).omit({
  id: true,
  createdAt: true,
});

export const insertCleanlinessReportSchema = createInsertSchema(cleanlinessReports).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertCrowdDataSchema = createInsertSchema(crowdData).omit({
  id: true,
  timestamp: true,
});

export const insertHelpBoothSchema = createInsertSchema(helpBooths).omit({
  id: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type LostAndFound = typeof lostAndFound.$inferSelect;
export type InsertLostAndFound = z.infer<typeof insertLostAndFoundSchema>;

export type SafetyAlert = typeof safetyAlerts.$inferSelect;
export type InsertSafetyAlert = z.infer<typeof insertSafetyAlertSchema>;

export type SpiritualEvent = typeof spiritualEvents.$inferSelect;
export type InsertSpiritualEvent = z.infer<typeof insertSpiritualEventSchema>;

export type CleanlinessReport = typeof cleanlinessReports.$inferSelect;
export type InsertCleanlinessReport = z.infer<typeof insertCleanlinessReportSchema>;

export type CrowdData = typeof crowdData.$inferSelect;
export type InsertCrowdData = z.infer<typeof insertCrowdDataSchema>;

export type HelpBooth = typeof helpBooths.$inferSelect;
export type InsertHelpBooth = z.infer<typeof insertHelpBoothSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
