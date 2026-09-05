// ============================================================================
// Meta Graph API - OAuth 2.0 Integration Layer
// Complies with official Meta Instagram Graph API specification
// ============================================================================

const META_APP_ID = process.env.META_APP_ID || '';
const META_APP_SECRET = process.env.META_APP_SECRET || '';
const META_REDIRECT_URI = process.env.META_REDIRECT_URI || 'http://localhost:3000/api/auth/meta/callback';
const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || 'v19.0';

// Official Meta scopes required for Instagram Business / Creator Insights
export const INSTAGRAM_OAUTH_SCOPES = [
  'instagram_basic',
  'instagram_manage_insights',
  'pages_show_list',
  'pages_read_engagement',
  'public_profile',
].join(',');

export interface MetaTokenResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

export interface MetaErrorResponse {
  error: {
    message: string;
    type: string;
    code: number;
    fbtrace_id?: string;
  };
}

/**
 * Builds the official Facebook Login dialog URL for Instagram permissions
 */
export function getMetaOAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: META_APP_ID,
    redirect_uri: META_REDIRECT_URI,
    state: state,
    scope: INSTAGRAM_OAUTH_SCOPES,
    response_type: 'code',
  });

  return `https://www.facebook.com/${GRAPH_VERSION}/dialog/oauth?${params.toString()}`;
}

/**
 * Exchanges the temporary authorization code for a short-lived user access token
 */
export async function exchangeCodeForShortLivedToken(code: string): Promise<string> {
  const tokenUrl = `https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`;
  const params = new URLSearchParams({
    client_id: META_APP_ID,
    client_secret: META_APP_SECRET,
    redirect_uri: META_REDIRECT_URI,
    code: code,
  });

  const res = await fetch(`${tokenUrl}?${params.toString()}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(`Meta OAuth Error: ${data.error.message} (code ${data.error.code})`);
  }

  return data.access_token;
}

/**
 * Exchanges a short-lived user token for a 60-day long-lived access token
 */
export async function exchangeForLongLivedToken(shortLivedToken: string): Promise<{
  accessToken: string;
  expiresInSeconds: number;
}> {
  const tokenUrl = `https://graph.facebook.com/${GRAPH_VERSION}/oauth/access_token`;
  const params = new URLSearchParams({
    grant_type: 'fb_exchange_token',
    client_id: META_APP_ID,
    client_secret: META_APP_SECRET,
    fb_exchange_token: shortLivedToken,
  });

  const res = await fetch(`${tokenUrl}?${params.toString()}`, {
    method: 'GET',
    headers: { 'Accept': 'application/json' },
  });

  const data = await res.json();
  if (data.error) {
    throw new Error(`Meta Long-Lived Token Error: ${data.error.message}`);
  }

  return {
    accessToken: data.access_token,
    expiresInSeconds: data.expires_in || 5184000, // 60 days default
  };
}
