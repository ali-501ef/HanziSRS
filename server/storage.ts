import { type User, type InsertUser, type Character, type InsertCharacter, type UserProgress, type InsertUserProgress, type StudySession, type InsertStudySession, type UserStats, type InsertUserStats } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Character methods
  getCharacters(limit?: number, offset?: number): Promise<Character[]>;
  getCharacter(id: string): Promise<Character | undefined>;
  getCharacterByText(character: string): Promise<Character | undefined>;
  createCharacter(character: InsertCharacter): Promise<Character>;

  // User progress methods
  getUserProgress(userId: string): Promise<UserProgress[]>;
  getUserProgressForCharacter(userId: string, characterId: string): Promise<UserProgress | undefined>;
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  updateUserProgress(id: string, progress: Partial<UserProgress>): Promise<UserProgress>;
  getDueCharacters(userId: string): Promise<(UserProgress & { character: Character })[]>;

  // Study session methods
  createStudySession(session: InsertStudySession): Promise<StudySession>;
  getUserStudySessions(userId: string, limit?: number): Promise<StudySession[]>;

  // User stats methods
  getUserStats(userId: string): Promise<UserStats | undefined>;
  createUserStats(stats: InsertUserStats): Promise<UserStats>;
  updateUserStats(userId: string, stats: Partial<UserStats>): Promise<UserStats>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private characters: Map<string, Character>;
  private userProgress: Map<string, UserProgress>;
  private studySessions: Map<string, StudySession>;
  private userStats: Map<string, UserStats>;

  constructor() {
    this.users = new Map();
    this.characters = new Map();
    this.userProgress = new Map();
    this.studySessions = new Map();
    this.userStats = new Map();
    
    // Initialize with sample characters
    this.initializeCharacters();
  }

  private initializeCharacters() {
    const sampleCharacters = [
      { character: "学", pinyin: "xué", meaning: "learn, study", mnemonic: "A child under a roof learning from books", level: 1, frequency: 100 },
      { character: "书", pinyin: "shū", meaning: "book", mnemonic: "Stacked papers bound together", level: 1, frequency: 200 },
      { character: "水", pinyin: "shuǐ", meaning: "water", mnemonic: "Flowing stream with ripples", level: 1, frequency: 150 },
      { character: "人", pinyin: "rén", meaning: "person", mnemonic: "A person standing with legs apart", level: 1, frequency: 50 },
      { character: "树", pinyin: "shù", meaning: "tree", mnemonic: "A tree with roots deep in the earth and branches reaching toward the sky", level: 1, frequency: 300 },
      { character: "火", pinyin: "huǒ", meaning: "fire", mnemonic: "Flames dancing upward", level: 1, frequency: 250 },
      { character: "山", pinyin: "shān", meaning: "mountain", mnemonic: "Three peaks reaching to the sky", level: 1, frequency: 400 },
      { character: "日", pinyin: "rì", meaning: "sun, day", mnemonic: "The sun as a bright circle", level: 1, frequency: 80 },
      { character: "月", pinyin: "yuè", meaning: "moon, month", mnemonic: "Crescent moon in the night sky", level: 1, frequency: 120 },
      { character: "大", pinyin: "dà", meaning: "big, large", mnemonic: "A person with arms stretched wide", level: 1, frequency: 90 },
    ];

    sampleCharacters.forEach(char => {
      const character: Character = {
        id: randomUUID(),
        ...char,
        strokeCount: null,
        radical: null,
      };
      this.characters.set(character.id, character);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    
    // Initialize user stats
    await this.createUserStats({
      userId: id,
      streak: 0,
      totalCharacters: 0,
      learnedCharacters: 0,
      accuracy: 0,
      studyTime: 0,
      lastStudyDate: null,
    });
    
    return user;
  }

  async getCharacters(limit = 50, offset = 0): Promise<Character[]> {
    const characters = Array.from(this.characters.values());
    return characters.slice(offset, offset + limit);
  }

  async getCharacter(id: string): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async getCharacterByText(character: string): Promise<Character | undefined> {
    return Array.from(this.characters.values()).find(char => char.character === character);
  }

  async createCharacter(insertCharacter: InsertCharacter): Promise<Character> {
    const id = randomUUID();
    const character: Character = { ...insertCharacter, id };
    this.characters.set(id, character);
    return character;
  }

  async getUserProgress(userId: string): Promise<UserProgress[]> {
    return Array.from(this.userProgress.values()).filter(progress => progress.userId === userId);
  }

  async getUserProgressForCharacter(userId: string, characterId: string): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(
      progress => progress.userId === userId && progress.characterId === characterId
    );
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = randomUUID();
    const progress: UserProgress = { 
      ...insertProgress, 
      id,
      lastReviewed: null,
      nextReview: new Date(),
    };
    this.userProgress.set(id, progress);
    return progress;
  }

  async updateUserProgress(id: string, updates: Partial<UserProgress>): Promise<UserProgress> {
    const progress = this.userProgress.get(id);
    if (!progress) throw new Error("Progress not found");
    
    const updated = { ...progress, ...updates };
    this.userProgress.set(id, updated);
    return updated;
  }

  async getDueCharacters(userId: string): Promise<(UserProgress & { character: Character })[]> {
    const now = new Date();
    const userProgressList = Array.from(this.userProgress.values()).filter(
      progress => progress.userId === userId && progress.nextReview <= now
    );

    const results = [];
    for (const progress of userProgressList) {
      const character = this.characters.get(progress.characterId);
      if (character) {
        results.push({ ...progress, character });
      }
    }
    return results;
  }

  async createStudySession(insertSession: InsertStudySession): Promise<StudySession> {
    const id = randomUUID();
    const session: StudySession = { 
      ...insertSession, 
      id,
      date: new Date(),
    };
    this.studySessions.set(id, session);
    return session;
  }

  async getUserStudySessions(userId: string, limit = 10): Promise<StudySession[]> {
    const sessions = Array.from(this.studySessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, limit);
    return sessions;
  }

  async getUserStats(userId: string): Promise<UserStats | undefined> {
    return Array.from(this.userStats.values()).find(stats => stats.userId === userId);
  }

  async createUserStats(insertStats: InsertUserStats): Promise<UserStats> {
    const id = randomUUID();
    const stats: UserStats = { 
      ...insertStats, 
      id,
      lastStudyDate: null,
    };
    this.userStats.set(id, stats);
    return stats;
  }

  async updateUserStats(userId: string, updates: Partial<UserStats>): Promise<UserStats> {
    const stats = Array.from(this.userStats.values()).find(s => s.userId === userId);
    if (!stats) throw new Error("Stats not found");
    
    const updated = { ...stats, ...updates };
    this.userStats.set(stats.id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
