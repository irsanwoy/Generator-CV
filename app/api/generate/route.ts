import { NextRequest, NextResponse } from 'next/server';
import { generateCVContent } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.apiKey) {
      return NextResponse.json(
        { error: 'API Key is required' },
        { status: 400 }
      );
    }

    if (!body.name || !body.email || !body.jobDescription) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate CV using Gemini
    const generatedCV = await generateCVContent(body, body.apiKey);

    return NextResponse.json({
      success: true,
      data: generatedCV
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate CV' },
      { status: 500 }
    );
  }
}