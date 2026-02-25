import { type ClassValue, clsx } from 'clsx';
import { format, parseISO, differenceInDays, addDays, startOfWeek } from 'date-fns';

/**
 * Merge class names
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') {
    date = parseISO(date);
  }
  return format(date, 'yyyy-MM-dd');
}

/**
 * Get today's date as YYYY-MM-DD
 */
export function getToday(): string {
  return formatDate(new Date());
}

/**
 * Calculate program progress
 */
export function calculateProgress(startDate: string, durationDays: number): {
  currentDay: number;
  daysRemaining: number;
  percentComplete: number;
} {
  const start = parseISO(startDate);
  const today = new Date();
  const daysPassed = differenceInDays(today, start);
  const currentDay = Math.max(1, Math.min(daysPassed + 1, durationDays));
  const daysRemaining = Math.max(0, durationDays - daysPassed);
  const percentComplete = Math.round((currentDay / durationDays) * 100);

  return { currentDay, daysRemaining, percentComplete };
}

/**
 * Calculate workout streak
 */
export function calculateStreak(completedDates: string[]): number {
  if (completedDates.length === 0) return 0;

  const sortedDates = completedDates
    .map(d => parseISO(d))
    .sort((a, b) => b.getTime() - a.getTime());

  let streak = 0;
  let currentDate = new Date();

  for (const completedDate of sortedDates) {
    const diff = differenceInDays(currentDate, completedDate);
    if (diff === 0 || diff === 1) {
      streak++;
      currentDate = completedDate;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Get workout for specific day of week
 */
export function getDayOfWeek(date: Date | string): number {
  if (typeof date === 'string') {
    date = parseISO(date);
  }
  return date.getDay(); // 0 = Sunday, 6 = Saturday
}

/**
 * Format macros display
 */
export function formatMacros(protein: number, carbs: number, fats: number): string {
  return `P: ${protein}g | C: ${carbs}g | F: ${fats}g`;
}

/**
 * Calculate total calories from macros
 */
export function calculateCalories(protein: number, carbs: number, fats: number): number {
  return protein * 4 + carbs * 4 + fats * 9;
}

/**
 * Validate PIN format (4-6 digits)
 */
export function isValidPin(pin: string): boolean {
  return /^\d{4,6}$/.test(pin);
}

/**
 * Get calendar month data
 */
export function getCalendarMonth(year: number, month: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDate = startOfWeek(firstDay);
  
  const days: Date[] = [];
  let currentDate = startDate;
  
  // Generate 6 weeks (42 days) for consistent calendar grid
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  
  return { days, firstDay, lastDay };
}
