import { NextRequest, NextResponse } from 'next/server';
import { DEMO_CREATORS } from '@/lib/meta/mockData';
import { createSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const persona = body.persona || 'tech-ai';

    const demoData = DEMO_CREATORS[persona] || DEMO_CREATORS['tech-ai'];

    createSession({
      user: demoData.profile,
      isDemo: true,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({
      success: true,
      profile: demoData.profile,
      redirect: '/dashboard',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to initialize demo session' },
      { status: 500 }
    );
  }
}
