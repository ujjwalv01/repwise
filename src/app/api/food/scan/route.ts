import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { analyzeFoodImage } from '@/lib/gemini';
import { auth } from '@/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // 1. Upload to Cloudinary
    const imageUrl = await uploadImage(file);
    
    // 2. Analyze with Groq Vision
    const analysisJson = await analyzeFoodImage(imageUrl);
    
    // Clean up analysis JSON (sometimes models add markdown backticks)
    const cleanJson = analysisJson.replace(/```json|```/g, '').trim();
    const food = JSON.parse(cleanJson);

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      food 
    });

  } catch (error: any) {
    console.error('Food scan error:', error);
    return NextResponse.json({ error: error.message || 'Failed to scan food' }, { status: 500 });
  }
}
