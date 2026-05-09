import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Vision model for image analysis
const VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct';
// Fast text model for generation
const TEXT_MODEL = 'llama-3.3-70b-versatile';

/**
 * Analyse a food image (base64 or public URL) using Groq vision
 */
export async function analyzeFoodImage(imageSource: string): Promise<string> {
  const imageContent =
    imageSource.startsWith('data:')
      ? { type: 'image_url' as const, image_url: { url: imageSource } }
      : { type: 'image_url' as const, image_url: { url: imageSource } };

  const response = await groq.chat.completions.create({
    model: VISION_MODEL,
    messages: [
      {
        role: 'user',
        content: [
          imageContent,
          {
            type: 'text',
            text: `Analyze this food image. Return ONLY valid JSON, no markdown, no explanation:
{
  "foodName": "string",
  "servingSize": "string (e.g. '1 cup', '200g', '2 rotis')",
  "calories": number,
  "proteinG": number,
  "carbsG": number,
  "fatG": number,
  "fiberG": number,
  "confidence": number (0.0 to 1.0),
  "alternatives": [{"name": "string", "probability": number}]
}
Be specific about Indian foods (dal, roti, rice portions, sabzi, biryani, paneer dishes etc.).
Estimate realistic home cooking portions.`,
          },
        ],
      },
    ],
    max_tokens: 512,
    temperature: 0.1,
  });

  return response.choices[0].message.content ?? '{}';
}

/**
 * Generate a multi-day meal plan using Groq
 */
export async function generateMealPlan(
  calories: number,
  proteinG: number,
  carbsG: number,
  fatG: number,
  preferences: string[],
  cuisine: string,
  days: number = 7
): Promise<string> {
  const response = await groq.chat.completions.create({
    model: TEXT_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are a certified nutritionist. Return only valid JSON arrays, no markdown, no explanation.',
      },
      {
        role: 'user',
        content: `Generate a ${days}-day meal plan for someone with these daily targets:
${calories} kcal, ${proteinG}g protein, ${carbsG}g carbs, ${fatG}g fat.
Preferences: ${preferences.join(', ') || 'none'}.
Cuisine style: ${cuisine}.

Rules:
- No two days should repeat the same breakfast, lunch, or dinner
- Vary cooking methods (bake, stir-fry, grill, steam, raw)
- Include 1 snack per day
- Keep meals practical with widely available ingredients

Return a JSON array only:
[{
  "dayNumber": 1,
  "breakfast": { "name": "string", "ingredients": ["string"], "cookTimeMin": number, "macros": { "calories": number, "proteinG": number, "carbsG": number, "fatG": number } },
  "lunch": { "name": "string", "ingredients": ["string"], "cookTimeMin": number, "macros": { "calories": number, "proteinG": number, "carbsG": number, "fatG": number } },
  "dinner": { "name": "string", "ingredients": ["string"], "cookTimeMin": number, "macros": { "calories": number, "proteinG": number, "carbsG": number, "fatG": number } },
  "snacks": { "name": "string", "ingredients": ["string"], "cookTimeMin": number, "macros": { "calories": number, "proteinG": number, "carbsG": number, "fatG": number } },
  "totalCalories": number,
  "totalProtein": number
}]`,
      },
    ],
    max_tokens: 4096,
    temperature: 0.7,
  });

  return response.choices[0].message.content ?? '[]';
}

/**
 * Generate a structured weekly workout plan using Groq
 */
export async function generateWorkoutPlan(
  goalType: string,
  fitnessLevel: string,
  daysPerWeek: number,
  sessionDuration: number,
  location: string
): Promise<string> {
  const response = await groq.chat.completions.create({
    model: TEXT_MODEL,
    messages: [
      {
        role: 'system',
        content: 'You are an expert personal trainer. Return only valid JSON, no markdown, no explanation.',
      },
      {
        role: 'user',
        content: `Create a ${daysPerWeek}-day/week workout plan for someone who wants to ${goalType.replace('_', ' ')}.
Location: ${location} (${location === 'GYM' ? 'has full gym equipment' : 'bodyweight & dumbbells only'})
Fitness level: ${fitnessLevel}
Time per session: ${sessionDuration} minutes

Return JSON only:
{
  "planName": "string",
  "weeklySchedule": [{
    "day": "Monday",
    "focus": "string (e.g. Push Day - Chest & Triceps)",
    "exercises": [{
      "name": "string",
      "sets": number,
      "reps": "string (e.g. 8-12 or 30 sec)",
      "restSec": number,
      "muscleGroups": ["string"],
      "tips": "string (1 sentence)",
      "difficulty": 1
    }],
    "estimatedDurationMin": number,
    "estimatedCalories": number
  }],
  "progressionNote": "string"
}`,
      },
    ],
    max_tokens: 3000,
    temperature: 0.6,
  });

  return response.choices[0].message.content ?? '{}';
}
