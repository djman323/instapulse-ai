import { NextResponse } from 'next/server';

export async function GET() {
  const geminiKey = process.env.GEMINI_API_KEY || '';
  const apifyToken = process.env.APIFY_API_TOKEN || '';
  const metaAppId = process.env.META_APP_ID || '';

  return NextResponse.json({
    gemini: {
      configured: geminiKey.trim().length > 5,
      provider: 'Google Cloud Gemini 1.5 Flash',
      status: geminiKey.trim().length > 5 ? 'ACTIVE' : 'NOT_CONFIGURED',
    },
    apify: {
      configured: apifyToken.trim().length > 5,
      provider: 'Apify Instagram Profile Scraper',
      status: apifyToken.trim().length > 5 ? 'ACTIVE' : 'NOT_CONFIGURED',
    },
    meta: {
      configured: metaAppId.trim().length > 3 && metaAppId !== 'your_meta_app_id',
      provider: 'Meta Graph API OAuth',
      status: metaAppId.trim().length > 3 && metaAppId !== 'your_meta_app_id' ? 'ACTIVE' : 'OPTIONAL',
    },
  });
}
