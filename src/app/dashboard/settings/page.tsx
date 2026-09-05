'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Instagram,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Key,
  ExternalLink,
  Sparkles,
  Search,
  Check,
} from 'lucide-react';

export default function SettingsPage() {
  const { profile, isDemo, activePersona, switchPersona, analyzeHandle } = useDashboard();
  const [handleInput, setHandleInput] = useState('');
  const [handleLoading, setHandleLoading] = useState(false);
  const [handleStatus, setHandleStatus] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<{
    gemini?: { configured: boolean; provider: string };
    apify?: { configured: boolean; provider: string };
    meta?: { configured: boolean; provider: string };
  } | null>(null);

  const [metaNotice, setMetaNotice] = useState<string | null>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('notice') === 'meta_app_id_missing') {
        setMetaNotice('Meta App ID is not set in .env.local. Facebook login requires a registered Meta Developer App ID.');
      }
    }

    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => setApiStatus(data))
      .catch(() => null);
  }, []);

  const handleTestScrape = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleInput.trim()) return;

    setHandleLoading(true);
    setHandleStatus(null);
    try {
      const success = await analyzeHandle(handleInput);
      if (success) {
        setHandleStatus(`Successfully scraped & synthesized AI strategy for @${handleInput.replace('@', '')}!`);
        setHandleInput('');
      } else {
        setHandleStatus('Scraping completed with dynamic fallback profile.');
      }
    } catch (err: any) {
      setHandleStatus(`Error: ${err?.message || 'Failed'}`);
    } finally {
      setHandleLoading(false);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Connection &amp; API Settings
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 mt-1.5">
          Manage your Apify Instagram Scraper tokens, Meta Graph API OAuth credentials, and active creator profiles.
        </p>
      </div>

      {/* Meta Notice Alert if Facebook Login was attempted without App ID */}
      {metaNotice && (
        <div className="rounded-2xl border border-amber-500/40 bg-amber-950/40 p-5 text-amber-200 text-sm flex items-start gap-3.5 shadow-lg">
          <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-amber-300 text-base">Facebook Login Requires a Meta Developer App ID</div>
            <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              Your <code>META_APP_ID</code> is currently empty in <code>.env.local</code>. Facebook displayed &ldquo;Invalid app ID&rdquo; because it cannot log in without a registered Meta Developer App.
            </p>
            <p className="text-xs sm:text-sm text-emerald-300 font-semibold pt-1">
              ✨ The Good News: You do NOT need Facebook login! Your Apify Live Scraper is fully active. Simply use the &ldquo;Test Live Handle Scrape&rdquo; input below to analyze any Instagram handle directly without Meta developer friction.
            </p>
          </div>
        </div>
      )}

      {/* Live System Integration Status Banner */}
      <Card className="border-zinc-800 bg-zinc-950/90 p-6 sm:p-7 space-y-4 shadow-sm ring-1 ring-zinc-800">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-zinc-300" />
            <h2 className="text-lg sm:text-xl font-bold text-white">Active Integrations Diagnostic</h2>
          </div>
          <Badge variant="outline" className="text-xs font-mono text-zinc-400 border-zinc-700">
            Live Server Check
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 font-mono">CLOUD AI ENGINE</span>
              {apiStatus?.gemini?.configured ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              ) : (
                <span className="text-xs text-amber-400 font-mono">Checking...</span>
              )}
            </div>
            <div className="text-sm font-bold text-white">Google Gemini 1.5 Flash</div>
            <p className="text-xs text-zinc-400">
              Generates hooks, viral angles, audience breakdowns &amp; content scripts.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 font-mono">INSTAGRAM SCRAPER</span>
              {apiStatus?.apify?.configured ? (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active
                </span>
              ) : (
                <span className="text-xs text-amber-400 font-mono">Checking...</span>
              )}
            </div>
            <div className="text-sm font-bold text-white">Apify Actor Engine</div>
            <p className="text-xs text-zinc-400">
              Scrapes public reels, carousels, metrics and engagement without Meta friction.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400 font-mono">META GRAPH OAUTH</span>
              <span className="text-xs text-zinc-500 font-mono">Optional</span>
            </div>
            <div className="text-sm font-bold text-white">Direct Meta App</div>
            <p className="text-xs text-zinc-400">
              Optional official OAuth login if Meta App Review is approved.
            </p>
          </div>
        </div>
      </Card>

      {/* Apify Instagram Live Scraper (The Recommended Solution) */}
      <Card className="border-zinc-800 bg-zinc-950/80 p-7 sm:p-9 space-y-6 shadow-sm ring-1 ring-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="success" className="text-xs font-bold py-0.5 px-2.5">
                RECOMMENDED ALTERNATIVE
              </Badge>
              <Badge variant="outline" className="text-xs font-mono py-0.5 px-2 text-zinc-300 border-zinc-700">
                Zero Meta Friction
              </Badge>
            </div>
            <h2 className="text-2xl font-bold text-white pt-1">
              Apify Live Instagram Scraper
            </h2>
          </div>

          <a
            href="https://apify.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 underline"
          >
            Get Free Apify Token <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          Bypasses all Meta Developer account registration, phone SMS verification bugs, and Facebook Page requirements. Allows your SaaS users to simply type <strong>@anyhandle</strong> to fetch public reels, carousels, likes, comments, and captions in real time.
        </p>

        {/* 3 Step Setup Guide */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-1.5">
            <div className="text-xs font-mono font-bold text-emerald-400">STEP 1</div>
            <div className="font-bold text-white">Create Free Apify Account</div>
            <p className="text-xs text-zinc-400">
              Sign up at <a href="https://apify.com" target="_blank" className="underline text-zinc-300">apify.com</a>. You receive $5 free monthly recurring credits.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-1.5">
            <div className="text-xs font-mono font-bold text-emerald-400">STEP 2</div>
            <div className="font-bold text-white">Copy API Token</div>
            <p className="text-xs text-zinc-400">
              Navigate to <strong>Settings &rarr; Integrations &rarr; API Tokens</strong> and copy your personal token.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 space-y-1.5">
            <div className="text-xs font-mono font-bold text-emerald-400">STEP 3</div>
            <div className="font-bold text-white">Paste in .env.local</div>
            <p className="text-xs text-zinc-400 font-mono">
              APIFY_API_TOKEN=apify_api_xxx
            </p>
          </div>
        </div>

        {/* Live Test Handle Scrape Bar */}
        <form onSubmit={handleTestScrape} className="space-y-3 pt-2">
          <div className="text-sm font-bold text-zinc-300 uppercase tracking-wider font-mono">
            Test Live Handle Scrape Right Now:
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500 font-mono">
                @
              </span>
              <input
                type="text"
                value={handleInput}
                onChange={(e) => setHandleInput(e.target.value)}
                placeholder="Enter any Instagram handle (e.g. hubspot, mrbeast, yourname)"
                className="w-full h-11 pl-8 pr-4 rounded-xl border border-zinc-800 bg-zinc-900/70 text-sm sm:text-base text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400"
              />
            </div>
            <Button
              type="submit"
              variant="brand"
              size="default"
              disabled={handleLoading || !handleInput.trim()}
              className="h-11 px-6 text-sm font-semibold rounded-xl shrink-0"
            >
              <Search className="w-4 h-4 mr-2" />
              {handleLoading ? 'Scraping & Synthesizing...' : 'Scrape Handle &rarr;'}
            </Button>
          </div>

          {handleStatus && (
            <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-400 pt-1">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{handleStatus}</span>
            </div>
          )}
        </form>
      </Card>

      {/* Current Connection Status Card */}
      <Card className="border-zinc-800 bg-zinc-950/80 p-7 sm:p-9 space-y-7 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-5 border-b border-zinc-800">
          <div>
            <div className="text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider font-mono">
              Current Active Account
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1.5 flex items-center gap-3">
              <span>@{profile.username}</span>
              <Badge variant={isDemo ? 'muted' : 'success'} className="text-xs sm:text-sm font-semibold py-1 px-3">
                {isDemo ? 'Sandbox Demo Account' : 'Live Analyzed Account'}
              </Badge>
            </div>
          </div>

          <Button
            variant="outline"
            size="default"
            onClick={() => {
              if (!apiStatus?.meta?.configured) {
                setMetaNotice('Meta App ID is not configured in .env.local. Because your Apify live scraper is active, you do not need Facebook login! Simply use the handle search box above to analyze any Instagram account.');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                window.location.href = '/api/auth/meta/login';
              }
            }}
            className="h-11 px-6 text-sm font-semibold shadow-sm"
          >
            <Instagram className="w-4 h-4 mr-2" />
            Meta OAuth {apiStatus?.meta?.configured ? '' : '(Not Configured)'}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-1.5">
            <div className="text-xs sm:text-sm text-zinc-400 font-mono font-bold">ACCOUNT ID</div>
            <div className="text-base sm:text-lg font-bold text-white font-mono">{profile.id}</div>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-1.5">
            <div className="text-xs sm:text-sm text-zinc-400 font-mono font-bold">DATA SOURCE</div>
            <div className="text-base sm:text-lg font-bold text-white">
              {isDemo ? 'Sandbox Benchmark' : 'Apify Live Scraper'}
            </div>
          </div>
        </div>
      </Card>

      {/* Switch Sandbox Creator */}
      <Card className="border-zinc-800 bg-zinc-950/80 p-7 sm:p-9 space-y-5 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Switch Sandbox Creator Vertical</h2>
          <p className="text-sm sm:text-base text-zinc-400 mt-1">
            Test how the AI categorizes content and recommends hooks across different niches.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {[
            { id: 'tech-ai', name: 'Alex Rivera', niche: 'AI & Automation', handle: '@alexrivera_ai' },
            { id: 'fitness-wellness', name: 'Elena Rostova', niche: 'Mobility & Strength', handle: '@elenafit_flow' },
            { id: 'fashion-luxury', name: 'Marcus Vance', niche: 'Menswear Capsule', handle: '@marcusvance_style' },
            { id: 'travel-food', name: 'Maya & Liam', niche: 'Hidden Gems', handle: '@nomadfoodie_diaries' },
          ].map((persona) => (
            <button
              key={persona.id}
              onClick={() => switchPersona(persona.id)}
              className={`p-5 rounded-xl border text-left transition-all ${
                activePersona === persona.id
                  ? 'border-zinc-200 bg-zinc-900 text-white shadow-md ring-1 ring-zinc-400/30'
                  : 'border-zinc-800 bg-zinc-900/40 text-zinc-300 hover:border-zinc-700 hover:text-white hover:bg-zinc-900/60'
              }`}
            >
              <div className="font-bold text-base text-white">{persona.name}</div>
              <div className="text-sm text-zinc-400 mt-0.5">{persona.handle}</div>
              <div className="text-xs sm:text-sm text-zinc-400 mt-2 font-mono font-medium">{persona.niche}</div>
            </button>
          ))}
        </div>
      </Card>

      {/* Meta Developer App Reference */}
      <Card className="border-zinc-800 bg-zinc-950/80 p-7 sm:p-9 space-y-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Key className="w-5 h-5 text-zinc-300" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">Official Meta Developer Credentials (Optional)</h2>
        </div>
        <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
          If you get approved by Meta in the future and want official OAuth, add your <code>META_APP_ID</code> and <code>META_APP_SECRET</code> in <code>.env.local</code>.
        </p>

        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 font-mono text-sm text-zinc-300 space-y-1.5">
          <div>META_APP_ID=your_meta_app_id</div>
          <div>META_APP_SECRET=your_meta_app_secret</div>
          <div>META_REDIRECT_URI=http://localhost:3000/api/auth/meta/callback</div>
        </div>

        <div className="pt-2">
          <a
            href="https://developers.facebook.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-zinc-300 hover:text-white font-semibold inline-flex items-center gap-2 underline"
          >
            Open Meta Developer Portal <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </Card>
    </div>
  );
}
