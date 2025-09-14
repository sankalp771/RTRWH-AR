import { type UserSubmission, type InsertUserSubmission, type UserInput, type CalculationResults } from "@shared/schema";
import { randomUUID } from "crypto";

// Storage interface for rainwater harvesting calculations
export interface IStorage {
  saveSubmission(userInputs: UserInput, calculationType: 'rainwater' | 'recharge', results: CalculationResults): Promise<UserSubmission>;
  getSubmission(id: string): Promise<UserSubmission | undefined>;
  getRecentSubmissions(limit?: number): Promise<UserSubmission[]>;
}

export class MemStorage implements IStorage {
  private submissions: Map<string, UserSubmission>;

  constructor() {
    this.submissions = new Map();
  }

  async saveSubmission(userInputs: UserInput, calculationType: 'rainwater' | 'recharge', results: CalculationResults): Promise<UserSubmission> {
    const id = randomUUID();
    const submission: UserSubmission = {
      id,
      userInputs,
      calculationType,
      results,
      createdAt: new Date()
    };
    this.submissions.set(id, submission);
    return submission;
  }

  async getSubmission(id: string): Promise<UserSubmission | undefined> {
    return this.submissions.get(id);
  }

  async getRecentSubmissions(limit = 10): Promise<UserSubmission[]> {
    const submissions = Array.from(this.submissions.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
    return submissions;
  }
}

export const storage = new MemStorage();
