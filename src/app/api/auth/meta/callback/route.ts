import { NextRequest, NextResponse } from 'next/server';
import { exchangeCodeForShortLivedToken, exchangeForLongLivedToken } from '@/lib/meta/oauth';
import { getConnectedInstagramAccountId, getInstagramProfile } from '@/lib/meta/client';
import { createSession } from '@/lib/session';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (error || !code) {
    console.error('Meta OAuth callback error:', error, errorDescription);
    return NextResponse.redirect(`${baseUrl}/?auth_error=${encodeURIComponent(errorDescription || error || 'Missing authorization code')}`);
  }

  try {
    // 1. Exchange authorization code for short-lived token
    const shortLivedToken = await exchangeCodeForShortLivedToken(code);

    // 2. Exchange for 60-day long-lived token
    const { accessToken, expiresInSeconds } = await exchangeForLongLivedToken(shortLivedToken);

    // 3. Locate linked Instagram Business/Creator Account
    const accountInfo = await getConnectedInstagramAccountId(accessToken);
    if (!accountInfo) {
      return NextResponse.redirect(
        `${baseUrl}/?auth_error=${encodeURIComponent('No Instagram Business/Creator account found linked to your Facebook Page. Please ensure your Instagram is switched to a Professional/Creator account.')}`
      );
    }

    // 4. Fetch Profile
    const profile = await getInstagramProfile(accountInfo.instagramAccountId, accessToken);

    // 5. Store Session
    createSession({
      user: profile,
      accessToken,
      isDemo: false,
      expiresAt: Date.now() + expiresInSeconds * 1000,
    });

    return NextResponse.redirect(`${baseUrl}/dashboard`);
  } catch (err: any) {
    console.error('Meta OAuth token exchange failed:', err);
    return NextResponse.redirect(`${baseUrl}/?auth_error=${encodeURIComponent(err.message || 'Meta token exchange failed')}`);
  }
}
