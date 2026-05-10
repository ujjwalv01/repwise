import { NextRequest, NextResponse } from 'next/server';

const APP_ID = process.env.EDAMAM_APP_ID;
const APP_KEY = process.env.EDAMAM_APP_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=${encodeURIComponent(query)}`);

    const data = await res.json();
    
    // Edamam returns results in 'hints'
    const hints = data.hints || [];
    
    return NextResponse.json({ 
      results: hints.slice(0, 8).map((hint: any) => ({
        name: hint.food.label,
        image: hint.food.image || '/repwise_icon.png', // Fallback image if none
        serving_unit: '100g', // Edamam generic nutrients are usually per 100g
        serving_qty: 1,
      }))
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch food data' }, { status: 500 });
  }
}

/**
 * Get detailed nutrition for a selected food item
 */
export async function POST(req: NextRequest) {
  try {
    const { foodName } = await req.json();

    // Query Edamam again for the specific food name to get its exact macros
    const res = await fetch(`https://api.edamam.com/api/food-database/v2/parser?app_id=${APP_ID}&app_key=${APP_KEY}&ingr=${encodeURIComponent(foodName)}`);

    const data = await res.json();
    const hints = data.hints || [];
    
    if (hints.length === 0) {
      return NextResponse.json({ error: 'Food not found' }, { status: 404 });
    }

    const food = hints[0].food;

    return NextResponse.json({
      food: {
        foodName: food.label,
        servingSize: '100g',
        calories: food.nutrients.ENERC_KCAL || 0,
        proteinG: food.nutrients.PROCNT || 0,
        carbsG: food.nutrients.CHOCDF || 0,
        fatG: food.nutrients.FAT || 0,
        fiberG: food.nutrients.FIBTG || 0,
        confidence: 1.0
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch nutrition details' }, { status: 500 });
  }
}
