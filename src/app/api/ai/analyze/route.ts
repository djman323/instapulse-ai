import { NextRequest, NextResponse } from 'next/server';
import { generateContentStrategy } from '@/lib/ai/geminiClient';
import { InstagramProfile, AccountPerformanceSummary, InstagramMediaItem } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, performance, media } = body as {
      profile: InstagramProfile;
      performance: AccountPerformanceSummary;
      media: InstagramMediaItem[];
    };

    if (!profile) {
      return NextResponse.json(
        { error: 'Missing creator profile data for AI analysis' },
        { status: 400 }
      );
    }

    const report = await generateContentStrategy(
      profile,
      performance || {
        totalFollowers: profile.followers_count || 1000,
        avgEngagementRate: 4.2,
        avgSavesPerPost: 120,
        avgReachPerPost: 3500,
        saveToReachRatio: 3.4,
        topPerformingFormat: 'REELS',
        formatBreakdown: {
          reels: { count: 4, avgEngagement: 4.5 },
          carousels: { count: 3, avgEngagement: 5.2 },
          images: { count: 2, avgEngagement: 2.1 },
        },
        bestPostingHours: [],
      },
      media || []
    );

    return NextResponse.json({
      success: true,
      report,
    });
  } catch (error: any) {
    console.error('AI content strategy generation failed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate AI content strategy' },
      { status: 500 }
    );
  }
}
