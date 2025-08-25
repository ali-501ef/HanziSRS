import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertStudySessionSchema, type StudyResult } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Characters routes
  app.get("/api/characters", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;
      const characters = await storage.getCharacters(limit, offset);
      res.json(characters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch characters" });
    }
  });

  app.get("/api/characters/:id", async (req, res) => {
    try {
      const character = await storage.getCharacter(req.params.id);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(character);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch character" });
    }
  });

  // Study routes (simplified for demo - normally would require auth)
  app.get("/api/study/due", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      let dueCards = await storage.getDueCharacters(userId);
      
      // If no due cards, create initial progress for first few characters
      if (dueCards.length === 0) {
        const characters = await storage.getCharacters(10, 0);
        for (const character of characters) {
          const existing = await storage.getUserProgressForCharacter(userId, character.id);
          if (!existing) {
            await storage.createUserProgress({
              userId,
              characterId: character.id,
              level: 0,
              interval: 1,
              easeFactor: 250,
              repetitions: 0,
            });
          }
        }
        dueCards = await storage.getDueCharacters(userId);
      }

      res.json(dueCards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch due cards" });
    }
  });

  app.post("/api/study/review", async (req, res) => {
    try {
      const { userId, results } = req.body as { userId: string; results: StudyResult[] };
      
      if (!userId || !results) {
        return res.status(400).json({ message: "User ID and results required" });
      }

      let correctAnswers = 0;
      
      for (const result of results) {
        const progress = await storage.getUserProgressForCharacter(userId, result.characterId);
        if (!progress) continue;

        const now = new Date();
        let newLevel = progress.level;
        let newInterval = progress.interval;
        let newEaseFactor = progress.easeFactor;
        let newRepetitions = progress.repetitions;

        // Simple SRS algorithm
        if (result.difficulty === 'easy') {
          newLevel = Math.min(8, progress.level + 1);
          newInterval = Math.max(1, Math.round(progress.interval * (progress.easeFactor / 100)));
          newEaseFactor = Math.min(300, progress.easeFactor + 15);
          newRepetitions = progress.repetitions + 1;
          correctAnswers++;
        } else if (result.difficulty === 'medium') {
          newInterval = Math.max(1, Math.round(progress.interval * (progress.easeFactor / 100) * 0.8));
          newRepetitions = progress.repetitions + 1;
          correctAnswers++;
        } else { // hard
          newLevel = Math.max(0, progress.level - 1);
          newInterval = 1;
          newEaseFactor = Math.max(130, progress.easeFactor - 20);
          newRepetitions = 0;
        }

        const nextReview = new Date(now.getTime() + newInterval * 24 * 60 * 60 * 1000);

        await storage.updateUserProgress(progress.id, {
          level: newLevel,
          interval: newInterval,
          easeFactor: newEaseFactor,
          repetitions: newRepetitions,
          lastReviewed: now,
          nextReview,
          isLearned: newLevel >= 4,
        });
      }

      // Create study session
      await storage.createStudySession({
        userId,
        cardsStudied: results.length,
        correctAnswers,
        totalTime: Math.round(results.reduce((sum, r) => sum + r.responseTime, 0) / 1000 / 60), // convert to minutes
      });

      // Update user stats
      const stats = await storage.getUserStats(userId);
      if (stats) {
        const accuracy = Math.round((correctAnswers / results.length) * 100);
        await storage.updateUserStats(userId, {
          totalCharacters: stats.totalCharacters + results.length,
          accuracy: Math.round((stats.accuracy * stats.totalCharacters + accuracy * results.length) / (stats.totalCharacters + results.length)),
          lastStudyDate: new Date(),
        });
      }

      res.json({ success: true, correctAnswers, totalCards: results.length });
    } catch (error) {
      res.status(500).json({ message: "Failed to process review" });
    }
  });

  // Stats routes
  app.get("/api/stats/:userId", async (req, res) => {
    try {
      const stats = await storage.getUserStats(req.params.userId);
      if (!stats) {
        return res.status(404).json({ message: "Stats not found" });
      }
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Demo user creation (normally would be through proper auth)
  app.post("/api/demo-user", async (req, res) => {
    try {
      const user = await storage.createUser({
        username: `demo_${Date.now()}`,
        password: "demo",
      });
      res.json({ userId: user.id });
    } catch (error) {
      res.status(500).json({ message: "Failed to create demo user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
