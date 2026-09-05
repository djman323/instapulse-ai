import { NextRequest, NextResponse } from 'next/server';
import { fetchInstagramByHandle } from '@/lib/apify/client';
import { generateContentStrategy } from '@/lib/ai/geminiClient';
import { createSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username } = body;

    if (!username || typeof username !== 'string' || !username.trim()) {
      return NextResponse.json(
        { error: 'Please provide a valid Instagram username or handle.' },
        { status: 400 }
      );
    }

    // 1. Fetch profile & media from Apify (or fallback synthesizer)
    const { profile, media, performance } = await fetchInstagramByHandle(username);

    // 2. Generate Cloud AI Strategy via Google Gemini / Synthesizer
    const report = await generateContentStrategy(profile, performance, media);

    // 3. Save active session for the dashboard with scraped media & report
    createSession({
      user: profile,
      isDemo: false,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30, // 30 days
      media,
      performance,
      report,
    });

    return NextResponse.json({
      success: true,
      profile,
      media,
      performance,
      report,
    });
  } catch (error: any) {
    console.error('Handle analysis error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to analyze Instagram handle' },
      { status: 500 }
    );
  }
}
