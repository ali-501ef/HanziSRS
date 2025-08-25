import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const characters = pgTable("characters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  character: text("character").notNull().unique(),
  pinyin: text("pinyin").notNull(),
  meaning: text("meaning").notNull(),
  mnemonic: text("mnemonic"),
  level: integer("level").notNull().default(1),
  strokeCount: integer("stroke_count"),
  radical: text("radical"),
  frequency: integer("frequency").default(1000),
});

export const userProgress = pgTable("user_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  characterId: varchar("character_id").notNull(),
  level: integer("level").notNull().default(0), // SRS level (0-8)
  interval: integer("interval").notNull().default(1), // Days until next review
  easeFactor: integer("ease_factor").notNull().default(250), // Ease factor * 100
  repetitions: integer("repetitions").notNull().default(0),
  lastReviewed: timestamp("last_reviewed"),
  nextReview: timestamp("next_review").defaultNow(),
  isLearned: boolean("is_learned").default(false),
});

export const studySessions = pgTable("study_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  date: timestamp("date").defaultNow(),
  cardsStudied: integer("cards_studied").notNull().default(0),
  correctAnswers: integer("correct_answers").notNull().default(0),
  totalTime: integer("total_time").notNull().default(0), // in minutes
});

export const userStats = pgTable("user_stats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  streak: integer("streak").notNull().default(0),
  totalCharacters: integer("total_characters").notNull().default(0),
  learnedCharacters: integer("learned_characters").notNull().default(0),
  accuracy: integer("accuracy").notNull().default(0), // Percentage * 100
  studyTime: integer("study_time").notNull().default(0), // Total minutes
  lastStudyDate: timestamp("last_study_date"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCharacterSchema = createInsertSchema(characters).omit({
  id: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export const insertStudySessionSchema = createInsertSchema(studySessions).omit({
  id: true,
});

export const insertUserStatsSchema = createInsertSchema(userStats).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Character = typeof characters.$inferSelect;
export type InsertCharacter = z.infer<typeof insertCharacterSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type StudySession = typeof studySessions.$inferSelect;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
export type UserStats = typeof userStats.$inferSelect;
export type InsertUserStats = z.infer<typeof insertUserStatsSchema>;

// Client-side types for study interface
export type StudyCard = {
  id: string;
  character: string;
  pinyin: string;
  meaning: string;
  mnemonic?: string;
  level: number;
  progress?: UserProgress;
};

export type StudyResult = {
  characterId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  responseTime: number;
};
