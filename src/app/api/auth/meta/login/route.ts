import { NextResponse } from 'next/server';
import { getMetaOAuthUrl } from '@/lib/meta/oauth';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const appId = (process.env.META_APP_ID || '').trim();

    // Guard: Prevent Facebook "Invalid app ID" crash if credentials are not configured
    if (!appId || appId === 'your_meta_app_id' || appId.length < 5) {
      const origin = new URL(request.url).origin;
      if (searchParams.get('json') === 'true') {
        return NextResponse.json({
          error: 'Meta App ID is not configured in .env.local. Use Apify Live Scraper instead.',
        }, { status: 400 });
      }
      return NextResponse.redirect(
        new URL('/dashboard/settings?notice=meta_app_id_missing', origin)
      );
    }

    const state = Math.random().toString(36).substring(2, 15);
    const metaOAuthUrl = getMetaOAuthUrl(state);

    if (searchParams.get('json') === 'true') {
      return NextResponse.json({ url: metaOAuthUrl });
    }

    return NextResponse.redirect(metaOAuthUrl);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate Meta OAuth URL' },
      { status: 500 }
    );
  }
}
