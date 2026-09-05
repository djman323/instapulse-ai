'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  Zap,
  ArrowRight,
  Check,
  Instagram,
  BarChart2,
  TrendingUp,
  Hash,
  Clock,
  Layers,
  FileText,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

export default function LandingPage() {
  const router = useRouter();
  const [selectedDemo, setSelectedDemo] = useState('tech-ai');
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [handleInput, setHandleInput] = useState('');
  const [loadingHandle, setLoadingHandle] = useState(false);
  const [handleError, setHandleError] = useState('');

  const handleAnalyzeHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleInput.trim()) return;

    setLoadingHandle(true);
    setHandleError('');
    try {
      const res = await fetch('/api/instagram/handle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: handleInput }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/dashboard');
      } else {
        setHandleError(data.error || 'Could not analyze handle.');
      }
    } catch (err: any) {
      setHandleError(err?.message || 'Failed to analyze handle.');
    } finally {
      setLoadingHandle(false);
    }
  };

  const handleLaunchDemo = async (persona: string) => {
    setLoadingDemo(true);
    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ persona }),
      });
      const data = await res.json();
      if (data.success) {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDemo(false);
    }
  };

  const handleConnectMeta = () => {
    const el = document.getElementById('hero-handle-input');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Notification Bar */}
      <div className="border-b border-zinc-800/80 bg-zinc-950/60 py-2 px-4 text-center text-xs text-zinc-400 flex items-center justify-center gap-2">
        <Badge variant="muted" className="text-[10px] py-0 px-2">LIVE</Badge>
        <span>Apify Real-Time Scraper &amp; Google Cloud Gemini AI Engine</span>
        <button onClick={handleConnectMeta} className="text-zinc-200 hover:underline font-medium inline-flex items-center gap-1">
          Analyze Any Handle <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center shadow-sm">
              <Sparkles className="w-4 h-4 text-zinc-950" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-zinc-100">
              InstaPulse <span className="text-zinc-500 font-normal">AI</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-zinc-400">
            <a href="#features" className="hover:text-zinc-100 transition-colors">Features</a>
            <a href="#sandbox" className="hover:text-zinc-100 transition-colors">Demo Sandbox</a>
            <a href="#pricing" className="hover:text-zinc-100 transition-colors">Pricing</a>
            <a href="/dashboard/settings" className="hover:text-zinc-100 transition-colors">API Settings</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleLaunchDemo('tech-ai')}
              disabled={loadingDemo}
              className="text-xs h-8 px-3"
            >
              <Zap className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
              {loadingDemo ? 'Loading...' : 'Instant Demo'}
            </Button>
            <Button
              variant="brand"
              size="sm"
              onClick={handleConnectMeta}
              className="text-xs h-8 px-3"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Analyze @Handle
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 sm:py-28 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex mb-6">
          <Badge variant="outline" className="gap-1.5 py-1 px-3 text-xs text-zinc-300 border-zinc-800 bg-zinc-900/50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Instagram Content Intelligence Platform
          </Badge>
        </div>

        <h1 className="text-4xl sm:text-6xl font-semibold tracking-tight text-zinc-100 leading-[1.15] mb-6">
          Stop guessing what to post. <br />
          <span className="text-zinc-400">Engineer your viral distribution.</span>
        </h1>

        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-8">
          Direct Meta Graph API ingestion paired with Cloud AI. Identify your content archetype, analyze save-to-reach ratios, and generate exact scripts, hooks, and targeted hashtag tiers.
        </p>

        {/* Instant Handle Search Form */}
        <div className="max-w-xl mx-auto mb-8">
          <form
            onSubmit={handleAnalyzeHandle}
            className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-2xl border border-zinc-800 bg-zinc-950/80 shadow-2xl backdrop-blur-md"
          >
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 font-mono text-base">
                @
              </span>
              <input
                id="hero-handle-input"
                type="text"
                value={handleInput}
                onChange={(e) => {
                  setHandleInput(e.target.value);
                  setHandleError('');
                }}
                placeholder="enter your handle or competitor (e.g. hubspot)"
                className="w-full h-12 pl-9 pr-4 rounded-xl border border-transparent bg-transparent text-base text-white placeholder:text-zinc-500 focus:outline-none"
              />
            </div>
            <Button
              type="submit"
              variant="brand"
              size="lg"
              disabled={loadingHandle || !handleInput.trim()}
              className="h-12 px-6 text-sm sm:text-base font-semibold rounded-xl shrink-0 shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {loadingHandle ? 'Scraping & Synthesizing...' : 'Analyze Creator'}
            </Button>
          </form>

          {handleError && (
            <p className="text-xs text-red-400 mt-2 text-center">{handleError}</p>
          )}

          <div className="flex items-center justify-center gap-2.5 mt-3 text-xs text-zinc-400">
            <span>Or analyze popular creators:</span>
            {['hubspot', 'mrbeast', 'duolingo', 'gymshark'].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setHandleInput(s)}
                className="underline hover:text-white font-mono text-zinc-300"
              >
                @{s}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <Button
            variant="outline"
            size="lg"
            onClick={() => handleLaunchDemo('tech-ai')}
            className="h-11 px-6 text-sm font-semibold"
          >
            <Zap className="w-4 h-4 mr-2 text-zinc-400" />
            Explore 1-Click Sandbox
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={handleConnectMeta}
            className="h-11 px-6 text-sm text-zinc-300 hover:text-zinc-100"
          >
            <Sparkles className="w-4 h-4 mr-2 text-emerald-400" />
            Analyze Any @Handle (No Facebook Login)
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-xs text-zinc-500 font-medium">
          <span className="inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-zinc-400" /> Meta Graph API v19.0
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-zinc-400" /> Google Gemini Cloud Engine
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-zinc-400" /> 60-Day Token Lifecycle
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-zinc-400" /> Enterprise-grade Privacy
          </span>
        </div>
      </section>

      {/* Interactive Sandbox Selector */}
      <section id="sandbox" className="max-w-5xl mx-auto px-6 mb-24 w-full">
        <Card className="border-zinc-800 bg-zinc-950/70">
          <CardHeader className="text-center pb-6">
            <div className="inline-flex mx-auto mb-2">
              <Badge variant="muted" className="text-[11px]">INTERACTIVE PREVIEW</Badge>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-semibold">Test Across 4 Creator Verticals</CardTitle>
            <CardDescription className="max-w-lg mx-auto text-xs sm:text-sm">
              Explore live calculated KPIs, Save-to-Reach metrics, and AI recommendations without connecting credentials.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
              {[
                { id: 'tech-ai', name: 'Alex Rivera', handle: '@alexrivera_ai', niche: 'AI & Automation', followers: '54.3k', format: 'Carousels (6.8%)' },
                { id: 'fitness-wellness', name: 'Elena Rostova', handle: '@elenafit_flow', niche: 'Mobility & Strength', followers: '114.2k', format: 'Reels (7.9%)' },
                { id: 'fashion-luxury', name: 'Marcus Vance', handle: '@marcusvance_style', niche: 'Menswear Capsule', followers: '86.4k', format: 'Carousels (5.4%)' },
                { id: 'travel-food', name: 'Maya & Liam', handle: '@nomadfoodie_diaries', niche: 'Hidden Gems', followers: '198.5k', format: 'Viral Reels (8.4%)' },
              ].map((persona) => {
                const isSelected = selectedDemo === persona.id;
                return (
                  <div
                    key={persona.id}
                    onClick={() => setSelectedDemo(persona.id)}
                    className={`rounded-lg border p-4 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-zinc-300 bg-zinc-900/90 shadow-sm'
                        : 'border-zinc-800/80 bg-zinc-900/30 hover:border-zinc-700 hover:bg-zinc-900/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-zinc-100">{persona.name}</span>
                      <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-normal text-zinc-400">
                        {persona.followers}
                      </Badge>
                    </div>
                    <div className="text-xs text-zinc-400 mb-2 font-mono">{persona.handle}</div>
                    <div className="text-[11px] text-zinc-500">
                      <strong>Niche:</strong> {persona.niche}
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1">
                      <strong>Top Signal:</strong> {persona.format}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <Button
                variant="brand"
                size="default"
                onClick={() => handleLaunchDemo(selectedDemo)}
                disabled={loadingDemo}
                className="h-10 px-6 text-xs font-medium"
              >
                <Zap className="w-3.5 h-3.5 mr-2" />
                {loadingDemo ? 'Launching...' : `Launch Sandbox as ${selectedDemo.replace('-', ' ').toUpperCase()}`}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Core Capabilities Bento */}
      <section id="features" className="max-w-5xl mx-auto px-6 mb-24 w-full">
        <div className="text-center mb-12">
          <Badge variant="muted" className="text-[11px] mb-2">SYSTEM CAPABILITIES</Badge>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
            Engineered for Creators &amp; Growth Agencies
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto mt-2">
            Translates raw Instagram Graph API signals into actionable production roadmaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-zinc-800 bg-zinc-950/40">
            <CardHeader className="pb-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
                <Layers className="w-4 h-4 text-zinc-300" />
              </div>
              <CardTitle className="text-base font-semibold">Niche &amp; Persona Detection</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Evaluates historical caption semantics, media ratios, and audience retention tone to isolate primary categories and sub-niche saturation.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/40">
            <CardHeader className="pb-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
                <BarChart2 className="w-4 h-4 text-zinc-300" />
              </div>
              <CardTitle className="text-base font-semibold">Save-to-Reach Ratio Audit</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Benchmarks the Instagram algorithm&apos;s primary recommendation signal to uncover why specific content fails to cross beyond existing followers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/40">
            <CardHeader className="pb-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
                <TrendingUp className="w-4 h-4 text-zinc-300" />
              </div>
              <CardTitle className="text-base font-semibold">Viral Concept Playbook</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Generates 5 ready-to-shoot concepts with 3-second opening hooks, scene-by-scene script timings, and copy-paste caption templates.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/40">
            <CardHeader className="pb-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
                <Hash className="w-4 h-4 text-zinc-300" />
              </div>
              <CardTitle className="text-base font-semibold">3-Tiered Hashtag Studio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Groups tags by volume: Broad Explore anchors (&gt;500k), Niche Targeted (50k-500k), and High-Intent Community tags (&lt;50k).
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/40">
            <CardHeader className="pb-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
                <Clock className="w-4 h-4 text-zinc-300" />
              </div>
              <CardTitle className="text-base font-semibold">Optimal Posting Windows</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Calculates audience bookmarking and scrolling density by day of week and hour to ensure new posts hit peak momentum immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/40">
            <CardHeader className="pb-3">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-3">
                <FileText className="w-4 h-4 text-zinc-300" />
              </div>
              <CardTitle className="text-base font-semibold">Executive Strategy Export</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Produce clean, formatted client deliverables in 1-click. Perfect for consultants and agencies managing creator retainers.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 mb-24 w-full">
        <div className="text-center mb-12">
          <Badge variant="muted" className="text-[11px] mb-2">SUBSCRIPTION TIERS</Badge>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
            Simple, Transparent Pricing
          </h2>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto mt-2">
            Equipped with ready-to-sell billing tiers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-zinc-800 bg-zinc-950/50 flex flex-col justify-between">
            <CardHeader>
              <div className="text-sm font-semibold text-zinc-100">Creator</div>
              <div className="text-xs text-zinc-500">For solo creators scaling distribution</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-zinc-100">$29</span>
                <span className="text-xs text-zinc-400">/ month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2.5 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-zinc-400" /> 1 Connected Account</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-zinc-400" /> Weekly AI Strategy Refresh</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-zinc-400" /> 5 Viral Content Playbooks</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-zinc-400" /> 3-Tiered Hashtags</li>
              </ul>
            </CardContent>
            <div className="p-6 pt-0">
              <Button variant="outline" className="w-full text-xs" onClick={handleConnectMeta}>
                Start Creator
              </Button>
            </div>
          </Card>

          <Card className="border-zinc-400 bg-zinc-900/60 flex flex-col justify-between relative shadow-md">
            <div className="absolute -top-2.5 left-1/2 -translate-x-1/2">
              <Badge variant="default" className="text-[10px] py-0 px-2 font-medium">MOST POPULAR</Badge>
            </div>
            <CardHeader>
              <div className="text-sm font-semibold text-zinc-100">Pro Growth</div>
              <div className="text-xs text-zinc-400">For active creators &amp; brands</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-zinc-100">$79</span>
                <span className="text-xs text-zinc-400">/ month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2.5 text-xs text-zinc-200">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Up to 3 Accounts</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Unlimited Cloud AI Audits</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Scene-by-Scene Timed Scripts</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Custom Topic Prompt Engine</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> PDF Strategy Deck Export</li>
              </ul>
            </CardContent>
            <div className="p-6 pt-0">
              <Button variant="brand" className="w-full text-xs" onClick={handleConnectMeta}>
                Start Pro Trial
              </Button>
            </div>
          </Card>

          <Card className="border-zinc-800 bg-zinc-950/50 flex flex-col justify-between">
            <CardHeader>
              <div className="text-sm font-semibold text-zinc-100">Agency</div>
              <div className="text-xs text-zinc-500">For multi-client management</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-zinc-100">$199</span>
                <span className="text-xs text-zinc-400">/ month</span>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <ul className="space-y-2.5 text-xs text-zinc-300">
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-zinc-400" /> 15 Client Accounts</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-zinc-400" /> White-Label PDF Export</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-zinc-400" /> Priority Cloud LLM Allocation</li>
                <li className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-zinc-400" /> Dedicated Token Manager</li>
              </ul>
            </CardContent>
            <div className="p-6 pt-0">
              <Button variant="outline" className="w-full text-xs" onClick={handleConnectMeta}>
                Contact Sales
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-zinc-800 py-8 px-6 bg-zinc-950">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">InstaPulse AI</span>
            <span>&copy; {new Date().getFullYear()} All rights reserved.</span>
          </div>

          <div className="flex items-center gap-5">
            <a href="#features" className="hover:text-zinc-300 transition-colors">Features</a>
            <a href="#sandbox" className="hover:text-zinc-300 transition-colors">Sandbox</a>
            <a href="#pricing" className="hover:text-zinc-300 transition-colors">Pricing</a>
            <button
              onClick={() => handleLaunchDemo('tech-ai')}
              className="text-zinc-300 hover:text-white font-medium"
            >
              Open Dashboard &rarr;
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
