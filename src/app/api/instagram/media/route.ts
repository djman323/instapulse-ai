import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { DEMO_CREATORS } from '@/lib/meta/mockData';
import { getInstagramMedia, calculateAccountPerformance } from '@/lib/meta/client';
import { generateSynthesizedStrategy } from '@/lib/ai/geminiClient';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const personaParam = searchParams.get('persona');

  const session = getSession();

  // If explicitly requesting a demo persona or not authenticated, serve demo persona
  if (personaParam && DEMO_CREATORS[personaParam]) {
    const demo = DEMO_CREATORS[personaParam];
    const initialReport = generateSynthesizedStrategy(demo.profile, demo.performance, demo.media);
    return NextResponse.json({
      profile: demo.profile,
      media: demo.media,
      performance: demo.performance,
      report: initialReport,
      isDemo: true,
    });
  }

  if (!session) {
    // Default fallback to tech-ai demo
    const demo = DEMO_CREATORS['tech-ai'];
    const initialReport = generateSynthesizedStrategy(demo.profile, demo.performance, demo.media);
    return NextResponse.json({
      profile: demo.profile,
      media: demo.media,
      performance: demo.performance,
      report: initialReport,
      isDemo: true,
    });
  }

  // If user is logged into a demo account
  if (session.isDemo) {
    // Find matching demo creator or fallback
    const matched = Object.values(DEMO_CREATORS).find(
      (c) => c.profile.username === session.user.username
    ) || DEMO_CREATORS['tech-ai'];

    const initialReport = generateSynthesizedStrategy(matched.profile, matched.performance, matched.media);

    return NextResponse.json({
      profile: matched.profile,
      media: matched.media,
      performance: matched.performance,
      report: initialReport,
      isDemo: true,
    });
  }

  // 1. If this is a live scraped account from Apify (has stored media & report)
  if (session.media && session.media.length > 0) {
    const report = session.report || generateSynthesizedStrategy(
      session.user,
      session.performance || calculateAccountPerformance(session.user, session.media),
      session.media
    );

    return NextResponse.json({
      profile: session.user,
      media: session.media,
      performance: session.performance || calculateAccountPerformance(session.user, session.media),
      report,
      isDemo: false,
    });
  }

  // 2. If this is an authenticated Meta Graph API OAuth account
  if (session.accessToken) {
    try {
      const media = await getInstagramMedia(session.user.id, session.accessToken);
      const performance = calculateAccountPerformance(session.user, media);
      const report = session.report || generateSynthesizedStrategy(session.user, performance, media);

      return NextResponse.json({
        profile: session.user,
        media,
        performance,
        report,
        isDemo: false,
      });
    } catch (error: any) {
      console.error('Error fetching live Instagram media via Meta OAuth:', error);
    }
  }

  // 3. Fallback: generate custom profile strategy dynamically based on session user
  const fallbackReport = generateSynthesizedStrategy(
    session.user,
    calculateAccountPerformance(session.user, []),
    []
  );

  return NextResponse.json({
    profile: session.user,
    media: session.media || [],
    performance: session.performance || calculateAccountPerformance(session.user, []),
    report: fallbackReport,
    isDemo: false,
  });
}
