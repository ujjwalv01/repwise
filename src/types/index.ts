export type GoalType = 'LOSE_FAT' | 'GAIN_MUSCLE' | 'MAINTAIN' | 'IMPROVE_ENDURANCE';
export type ActivityLevel = 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'ACTIVE' | 'VERY_ACTIVE';
export type WorkoutLocation = 'GYM' | 'HOME' | 'BOTH';
export type MealType = 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  image?: string;
  age?: number;
  heightCm?: number;
  weightKg?: number;
  goalType: GoalType;
  activityLevel: ActivityLevel;
  workoutLocation: WorkoutLocation;
  onboardingDone: boolean;
  targetCalories?: number;
  targetProteinG?: number;
  targetCarbsG?: number;
  targetFatG?: number;
  targetWaterMl?: number;
  targetSteps: number;
}

export interface FoodLog {
  id: string;
  userId: string;
  date: string;
  mealType: MealType;
  foodName: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG?: number;
  imageUrl?: string;
  aiScanned: boolean;
  servingSize: number;
  unit: string;
}

export interface FoodAnalysis {
  foodName: string;
  servingSize: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  confidence: number;
  alternatives?: { name: string; probability: number }[];
}

export interface ExerciseSet {
  name: string;
  sets: number;
  reps: string;
  restSec: number;
  muscleGroups: string[];
  tips: string;
  difficulty: 1 | 2 | 3;
  weightKg?: number;
}

export interface WorkoutDay {
  day: string;
  focus: string;
  exercises: ExerciseSet[];
  estimatedDurationMin: number;
  estimatedCalories: number;
}

export interface WorkoutPlan {
  planName: string;
  weeklySchedule: WorkoutDay[];
  progressionNote: string;
}

export interface WorkoutLog {
  id: string;
  userId: string;
  date: string;
  planName: string;
  durationMin: number;
  caloriesBurned?: number;
  location: WorkoutLocation;
  notes?: string;
}

export interface HydrationLog {
  id: string;
  userId: string;
  date: string;
  amountMl: number;
  drinkType: string;
}

export interface StepLog {
  id: string;
  userId: string;
  date: string;
  steps: number;
  distanceM?: number;
  source: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  type: GoalType;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  completed: boolean;
  createdAt: string;
}

export interface MealItem {
  name: string;
  ingredients: string[];
  cookTimeMin: number;
  macros: { calories: number; proteinG: number; carbsG: number; fatG: number };
}

export interface MealDay {
  dayNumber: number;
  breakfast: MealItem;
  lunch: MealItem;
  dinner: MealItem;
  snacks: MealItem;
  totalCalories: number;
  totalProtein: number;
}

export interface Exercise {
  id: string;
  name: string;
  category: string;
  muscleGroups: string[];
}

// Daily statistics for dashboard and progress tracking
export interface DailyStats {
  steps: number;
  caloriesConsumed: number;
  caloriesBurned: number;
  waterMl: number;
  workoutStreak: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
}
