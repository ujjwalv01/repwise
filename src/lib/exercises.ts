import { Exercise } from '@/types';

export const POSE_EXERCISES: Exercise[] = [
  // ── LOWER BODY ─────────────────────────────────────────────
  {
    id: 'squat',
    name: 'Squat',
    category: 'lower_body',
    muscleGroups: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    category: 'lower_body',
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back', 'Traps'],
  },
  {
    id: 'lunge',
    name: 'Lunge',
    category: 'lower_body',
    muscleGroups: ['Quads', 'Glutes', 'Hamstrings', 'Calves'],
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    category: 'lower_body',
    muscleGroups: ['Quads', 'Glutes', 'Hip Flexors'],
  },
  {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    category: 'lower_body',
    muscleGroups: ['Glutes', 'Hamstrings', 'Lower Back'],
  },
  {
    id: 'calf-raise',
    name: 'Calf Raise',
    category: 'lower_body',
    muscleGroups: ['Calves', 'Tibialis'],
  },
  {
    id: 'sumo-squat',
    name: 'Sumo Squat',
    category: 'lower_body',
    muscleGroups: ['Adductors', 'Glutes', 'Quads'],
  },
  {
    id: 'step-up',
    name: 'Step Up',
    category: 'lower_body',
    muscleGroups: ['Quads', 'Glutes', 'Hamstrings'],
  },

  // ── UPPER BODY ─────────────────────────────────────────────
  {
    id: 'push-up',
    name: 'Push-Up',
    category: 'upper_body',
    muscleGroups: ['Chest', 'Triceps', 'Shoulders', 'Core'],
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    category: 'upper_body',
    muscleGroups: ['Shoulders', 'Triceps', 'Upper Traps'],
  },
  {
    id: 'bicep-curl',
    name: 'Bicep Curl',
    category: 'upper_body',
    muscleGroups: ['Biceps', 'Forearms'],
  },
  {
    id: 'tricep-dip',
    name: 'Tricep Dip',
    category: 'upper_body',
    muscleGroups: ['Triceps', 'Chest', 'Shoulders'],
  },
  {
    id: 'lateral-raise',
    name: 'Lateral Raise',
    category: 'upper_body',
    muscleGroups: ['Lateral Deltoid', 'Traps'],
  },
  {
    id: 'front-raise',
    name: 'Front Raise',
    category: 'upper_body',
    muscleGroups: ['Anterior Deltoid', 'Upper Chest'],
  },
  {
    id: 'arnold-press',
    name: 'Arnold Press',
    category: 'upper_body',
    muscleGroups: ['All Deltoid Heads', 'Triceps'],
  },
  {
    id: 'bent-over-row',
    name: 'Bent-Over Row',
    category: 'upper_body',
    muscleGroups: ['Lats', 'Rhomboids', 'Biceps', 'Rear Delts'],
  },
  {
    id: 'upright-row',
    name: 'Upright Row',
    category: 'upper_body',
    muscleGroups: ['Traps', 'Lateral Delts', 'Biceps'],
  },
  {
    id: 'pull-up',
    name: 'Pull-Up',
    category: 'upper_body',
    muscleGroups: ['Lats', 'Biceps', 'Rear Delts', 'Core'],
  },
  {
    id: 'chin-up',
    name: 'Chin-Up',
    category: 'upper_body',
    muscleGroups: ['Biceps', 'Lats', 'Core'],
  },
  {
    id: 'dumbbell-row',
    name: 'Single-Arm Dumbbell Row',
    category: 'upper_body',
    muscleGroups: ['Lats', 'Rhomboids', 'Biceps'],
  },
  {
    id: 'pike-push-up',
    name: 'Pike Push-Up',
    category: 'upper_body',
    muscleGroups: ['Shoulders', 'Triceps', 'Upper Chest'],
  },
  {
    id: 'diamond-push-up',
    name: 'Diamond Push-Up',
    category: 'upper_body',
    muscleGroups: ['Triceps', 'Inner Chest'],
  },

  // ── CORE ───────────────────────────────────────────────────
  {
    id: 'plank',
    name: 'Plank',
    category: 'core',
    muscleGroups: ['Core', 'Shoulders', 'Glutes'],
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    category: 'core',
    muscleGroups: ['Obliques', 'Core', 'Hip Abductors'],
  },
  {
    id: 'crunch',
    name: 'Crunch',
    category: 'core',
    muscleGroups: ['Rectus Abdominis'],
  },
  {
    id: 'bicycle-crunch',
    name: 'Bicycle Crunch',
    category: 'core',
    muscleGroups: ['Obliques', 'Rectus Abdominis', 'Hip Flexors'],
  },
  {
    id: 'leg-raise',
    name: 'Leg Raise',
    category: 'core',
    muscleGroups: ['Lower Abs', 'Hip Flexors'],
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist',
    category: 'core',
    muscleGroups: ['Obliques', 'Core'],
  },
  {
    id: 'mountain-climber',
    name: 'Mountain Climber',
    category: 'core',
    muscleGroups: ['Core', 'Shoulders', 'Hip Flexors'],
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    category: 'core',
    muscleGroups: ['Deep Core', 'Transverse Abdominis'],
  },
  {
    id: 'hollow-hold',
    name: 'Hollow Body Hold',
    category: 'core',
    muscleGroups: ['Core', 'Hip Flexors', 'Lower Abs'],
  },
  {
    id: 'v-up',
    name: 'V-Up',
    category: 'core',
    muscleGroups: ['Rectus Abdominis', 'Hip Flexors'],
  },

  // ── FULL BODY / CARDIO ──────────────────────────────────────
  {
    id: 'burpee',
    name: 'Burpee',
    category: 'full_body',
    muscleGroups: ['Full Body', 'Chest', 'Legs', 'Core'],
  },
  {
    id: 'jump-squat',
    name: 'Jump Squat',
    category: 'full_body',
    muscleGroups: ['Quads', 'Glutes', 'Calves', 'Core'],
  },
  {
    id: 'jumping-jack',
    name: 'Jumping Jack',
    category: 'cardio',
    muscleGroups: ['Full Body', 'Cardiovascular'],
  },
  {
    id: 'high-knees',
    name: 'High Knees',
    category: 'cardio',
    muscleGroups: ['Hip Flexors', 'Quads', 'Calves', 'Core'],
  },
  {
    id: 'bear-crawl',
    name: 'Bear Crawl',
    category: 'full_body',
    muscleGroups: ['Shoulders', 'Core', 'Quads', 'Wrists'],
  },
  {
    id: 'inchworm',
    name: 'Inchworm',
    category: 'full_body',
    muscleGroups: ['Hamstrings', 'Core', 'Shoulders', 'Chest'],
  },
  {
    id: 'hip-thrust',
    name: 'Hip Thrust',
    category: 'lower_body',
    muscleGroups: ['Glutes', 'Hamstrings', 'Core'],
  },
  {
    id: 'reverse-lunge',
    name: 'Reverse Lunge',
    category: 'lower_body',
    muscleGroups: ['Quads', 'Glutes', 'Hamstrings'],
  },
  {
    id: 'good-morning',
    name: 'Good Morning',
    category: 'lower_body',
    muscleGroups: ['Hamstrings', 'Glutes', 'Lower Back'],
  },
];

export const EXERCISE_CATEGORIES = [
  { id: 'all', label: 'All Exercises' },
  { id: 'lower_body', label: 'Lower Body' },
  { id: 'upper_body', label: 'Upper Body' },
  { id: 'core', label: 'Core' },
  { id: 'full_body', label: 'Full Body' },
  { id: 'cardio', label: 'Cardio' },
];
