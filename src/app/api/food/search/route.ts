import { NextRequest, NextResponse } from 'next/server';

const APP_ID = process.env.NUTRITIONIX_APP_ID;
const APP_KEY = process.env.NUTRITIONIX_APP_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }

  try {
    const res = await fetch(`https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(query)}`, {
      headers: {
        'x-app-id': APP_ID!,
        'x-app-key': APP_KEY!,
      }
    });

    const data = await res.json();
    
    // We want the 'common' items for a broader range
    return NextResponse.json({ 
      results: data.common.slice(0, 8).map((item: any) => ({
        name: item.food_name,
        image: item.photo.thumb,
        serving_unit: item.serving_unit,
        serving_qty: item.serving_qty,
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

    const res = await fetch('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': APP_ID!,
        'x-app-key': APP_KEY!,
        'x-remote-user-id': '0'
      },
      body: JSON.stringify({ query: foodName })
    });

    const data = await res.json();
    const food = data.foods[0];

    return NextResponse.json({
      food: {
        foodName: food.food_name,
        servingSize: `${food.serving_qty} ${food.serving_unit}`,
        calories: food.nf_calories,
        proteinG: food.nf_protein,
        carbsG: food.nf_total_carbohydrate,
        fatG: food.nf_total_fat,
        fiberG: food.nf_dietary_fiber,
        confidence: 1.0
      }
    });

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch nutrition details' }, { status: 500 });
  }
}
