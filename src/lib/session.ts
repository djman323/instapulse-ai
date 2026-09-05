import { cookies } from 'next/headers';
import { AuthSession } from '@/types';

const SESSION_COOKIE_NAME = 'instapulse_session';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

// In-memory persistent session cache across server requests
const globalSessions = ((globalThis as any).__instapulse_sessions =
  (globalThis as any).__instapulse_sessions || new Map<string, AuthSession>());

export function createSession(session: AuthSession): void {
  const cookieStore = cookies();
  const sessionId = session.sessionId || `sess_${session.user.username}_${Date.now()}`;
  const fullSession: AuthSession = { ...session, sessionId };

  // Store full data (including 12+ media items and synthesized AI strategy) in server store
  globalSessions.set(sessionId, fullSession);
  globalSessions.set(session.user.username.toLowerCase(), fullSession);

  // Store lightweight metadata in cookie (under 2KB to prevent browser cookie drops)
  const cookieData = {
    sessionId,
    user: session.user,
    accessToken: session.accessToken,
    isDemo: session.isDemo,
    expiresAt: session.expiresAt,
  };

  const serialized = Buffer.from(JSON.stringify(cookieData)).toString('base64url');
  
  cookieStore.set(SESSION_COOKIE_NAME, serialized, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export function getSession(): AuthSession | null {
  try {
    const cookieStore = cookies();
    const cookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!cookie?.value) return null;

    const raw = Buffer.from(cookie.value, 'base64url').toString('utf-8');
    const cookieData: AuthSession = JSON.parse(raw);

    // Check expiry
    if (cookieData.expiresAt && Date.now() > cookieData.expiresAt) {
      return null;
    }

    // Attempt to retrieve full cached session with media, performance, and report
    if (cookieData.sessionId && globalSessions.has(cookieData.sessionId)) {
      return globalSessions.get(cookieData.sessionId)!;
    }

    if (cookieData.user?.username && globalSessions.has(cookieData.user.username.toLowerCase())) {
      return globalSessions.get(cookieData.user.username.toLowerCase())!;
    }

    return cookieData;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  const cookieStore = cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
