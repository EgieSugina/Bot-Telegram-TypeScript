import { Context } from 'telegraf';
import { session } from 'telegraf';

// Define session structure
interface SessionData {
  gameState?: {
    secretNumber: number;
    attempts: number;
    maxAttempts: number;
  };
  calculator?: {
    display: string;
    previousValue: number | null;
    operation: string | null;
    waitingForNewNumber: boolean;
  };
}

// Extend context with session
export interface BotContext extends Context {
  session: SessionData;
}

// Game state types
export interface GameState {
  secretNumber: number;
  attempts: number;
  maxAttempts: number;
}

// Calculator state types
export interface CalculatorState {
  display: string;
  previousValue: number | null;
  operation: string | null;
  waitingForNewNumber: boolean;
} 