'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDashboard } from '@/context/DashboardContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  TrendingUp,
  Bookmark,
  Eye,
  Layers,
  Clock,
  ArrowRight,
  Zap,
  Instagram,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Video,
  Hash,
  Grid,
} from 'lucide-react';

export default function OverviewPage() {
  const { profile, performance, report, isDemo } = useDashboard();
  const [activeAuditTab, setActiveAuditTab] = useState<'STRENGTHS' | 'GAPS'>('STRENGTHS');

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Performance Overview &amp; Diagnosis
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 mt-1.5">
            Algorithmic audit, retention benchmarks, and audience classification for @{profile.username}.
          </p>
        </div>

        <Link href="/dashboard/studio">
          <Button variant="brand" size="default" className="text-sm sm:text-base font-semibold h-11 px-6 shadow-sm">
            <Sparkles className="w-4 h-4 mr-2" />
            Open Viral Studio &rarr;
          </Button>
        </Link>
      </div>

      {/* Sandbox Notice Banner */}
      {isDemo && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-5 flex flex-wrap items-center justify-between gap-4 text-sm sm:text-base">
          <div className="flex items-center gap-3.5 text-zinc-200">
            <Zap className="w-5 h-5 text-amber-400 shrink-0" />
            <span>
              You are exploring in <strong>Interactive Sandbox Mode</strong> with realistic metrics. Connect your live Meta account to analyze your real content.
            </span>
          </div>
          <Button
            variant="brand"
            size="sm"
            onClick={() => (window.location.href = '/api/auth/meta/login')}
            className="h-9 text-sm font-semibold px-4"
          >
            <Instagram className="w-4 h-4 mr-1.5" /> Connect Meta
          </Button>
        </div>
      )}

      {/* 4 Spacious, Highly Legible Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1: Engagement Rate */}
        <Card className="border-zinc-800 bg-zinc-950/80 p-6 sm:p-7 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider font-mono">
              Engagement Rate
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            {performance.avgEngagementRate}%
          </div>
          <p className="text-sm font-medium text-emerald-400 pt-1 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" /> Top 5% in {report?.detectedNiche.primaryCategory || 'category'}
          </p>
        </Card>

        {/* KPI 2: Save-to-Reach Ratio */}
        <Card className="border-zinc-800 bg-zinc-950/80 p-6 sm:p-7 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider font-mono">
              Save-to-Reach Ratio
            </span>
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-zinc-300" />
            </div>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            {performance.saveToReachRatio}%
          </div>
          <p className="text-sm sm:text-base text-zinc-300 pt-1">
            Avg <strong className="text-white font-semibold">{performance.avgSavesPerPost.toLocaleString()}</strong> saves per post
          </p>
        </Card>

        {/* KPI 3: Reach Velocity */}
        <Card className="border-zinc-800 bg-zinc-950/80 p-6 sm:p-7 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider font-mono">
              Reach Velocity
            </span>
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Eye className="w-5 h-5 text-zinc-300" />
            </div>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
            {performance.avgReachPerPost.toLocaleString()}
          </div>
          <p className="text-sm sm:text-base text-zinc-300 pt-1">
            Accounts reached per published post
          </p>
        </Card>

        {/* KPI 4: Top Performing Format */}
        <Card className="border-zinc-800 bg-zinc-950/80 p-6 sm:p-7 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider font-mono">
              Top Format Signal
            </span>
            <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center">
              <Layers className="w-5 h-5 text-zinc-300" />
            </div>
          </div>
          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight uppercase">
            {performance.topPerformingFormat}
          </div>
          <p className="text-sm sm:text-base text-zinc-300 pt-1">
            Carousels {performance.formatBreakdown.carousels.avgEngagement}% &bull; Reels {performance.formatBreakdown.reels.avgEngagement}%
          </p>
        </Card>
      </div>

      {/* Content Archetype & Prime Timing Card */}
      {report && (
        <Card className="border-zinc-800 bg-zinc-950/80 p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-5">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs sm:text-sm py-1 px-3 font-semibold border-zinc-700 bg-zinc-900 text-zinc-200">
                  CONTENT ARCHETYPE AUDIT
                </Badge>
                <Badge variant="muted" className="text-xs sm:text-sm py-1 px-3 font-mono font-medium">
                  Saturation Score: {report.detectedNiche.nicheSaturationScore}/100
                </Badge>
              </div>

              <div>
                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                  {report.detectedNiche.primaryCategory}
                </h2>
                <div className="text-lg sm:text-xl text-zinc-300 mt-1 font-medium">
                  {report.detectedNiche.subNiche}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-3 border-t border-zinc-800">
                <div className="space-y-1.5">
                  <span className="text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    Target Audience Persona:
                  </span>
                  <p className="text-base sm:text-lg text-zinc-200 leading-relaxed font-normal">
                    {report.detectedNiche.targetAudiencePersona}
                  </p>
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider">
                    Recommended Voice &amp; Tone:
                  </span>
                  <p className="text-base sm:text-lg text-zinc-200 leading-relaxed font-normal">
                    {report.detectedNiche.contentTone}
                  </p>
                </div>
              </div>
            </div>

            {/* Prime Posting Window Box */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 space-y-4">
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider font-mono">
                <Clock className="w-5 h-5 text-zinc-300" /> Prime Posting Window
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {report.optimalPostingSchedule.primeDay}
                </div>
                <div className="text-base sm:text-lg font-bold text-emerald-400 mt-1">
                  {report.optimalPostingSchedule.primeTimeWindow}
                </div>
              </div>
              <p className="text-sm sm:text-base text-zinc-300 leading-relaxed pt-2 border-t border-zinc-800/80">
                {report.optimalPostingSchedule.explanation}
              </p>
              <div className="text-sm text-zinc-400 pt-1">
                Posting cadence: <strong className="text-zinc-200 font-semibold">{report.optimalPostingSchedule.frequencyPerWeek}</strong>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Algorithmic Diagnosis: Strengths & Gaps to Fix */}
      {report && (
        <Card className="border-zinc-800 bg-zinc-950/80 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">
                Algorithmic Audit &amp; Bottleneck Analysis
              </h3>
              <p className="text-sm sm:text-base text-zinc-400 mt-1">
                Exact reasons why your content gets pushed or stalled by the Instagram recommendation engine.
              </p>
            </div>

            <div className="inline-flex rounded-lg bg-zinc-900 p-1.5 border border-zinc-800 text-sm">
              <button
                onClick={() => setActiveAuditTab('STRENGTHS')}
                className={`px-4 py-2 rounded-md font-semibold transition-all ${
                  activeAuditTab === 'STRENGTHS'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Strengths ({report.performanceAudit.strengths.length})
              </button>
              <button
                onClick={() => setActiveAuditTab('GAPS')}
                className={`px-4 py-2 rounded-md font-semibold transition-all ${
                  activeAuditTab === 'GAPS'
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Gaps to Fix ({report.performanceAudit.gapsToFix.length})
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeAuditTab === 'STRENGTHS'
              ? report.performanceAudit.strengths.map((s, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-2.5"
                  >
                    <div className="flex items-center gap-2.5 font-bold text-white text-lg">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      {s.title}
                    </div>
                    <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                      {s.description}
                    </p>
                    <div className="text-sm text-emerald-400 font-mono font-semibold pt-1">
                      Proof: {s.metricProof}
                    </div>
                  </div>
                ))
              : report.performanceAudit.gapsToFix.map((g, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-2.5"
                  >
                    <div className="flex items-center gap-2.5 font-bold text-white text-lg">
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                      {g.title}
                    </div>
                    <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                      {g.description}
                    </p>
                    <div className="text-sm text-amber-400 font-mono font-semibold pt-1">
                      Action Required: {g.fixAction}
                    </div>
                  </div>
                ))}
          </div>
        </Card>
      )}

      {/* Algorithm Directives Footer Banner */}
      {report && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-950/70 p-6 sm:p-7 space-y-4">
          <div className="text-xs sm:text-sm font-bold text-zinc-400 uppercase tracking-wider font-mono">
            Core Algorithmic Rules For Your Account
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm sm:text-base text-zinc-200">
            {report.algorithmDirectives.map((directive, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-xs font-mono font-bold text-zinc-300 shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{directive}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Navigation Cards to Dedicated Pages */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">Workspace Sections</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link href="/dashboard/studio" className="group">
            <Card className="h-full border-zinc-800 bg-zinc-950/80 p-6 space-y-3 group-hover:border-zinc-600 transition-all">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                <Video className="w-5 h-5 text-zinc-200" />
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-zinc-100 flex items-center justify-between">
                Viral Content Studio
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Generate high-retention concepts, test opening hooks, and inspect scene-by-scene teleprompters.
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/hashtags" className="group">
            <Card className="h-full border-zinc-800 bg-zinc-950/80 p-6 space-y-3 group-hover:border-zinc-600 transition-all">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                <Hash className="w-5 h-5 text-zinc-200" />
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-zinc-100 flex items-center justify-between">
                Smart Hashtags &amp; SEO
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                3-tiered search volume distribution tags to optimize Explore discovery and long-tail indexing.
              </p>
            </Card>
          </Link>

          <Link href="/dashboard/media" className="group">
            <Card className="h-full border-zinc-800 bg-zinc-950/80 p-6 space-y-3 group-hover:border-zinc-600 transition-all">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                <Grid className="w-5 h-5 text-zinc-200" />
              </div>
              <h4 className="text-lg font-bold text-white group-hover:text-zinc-100 flex items-center justify-between">
                Historical Media Catalog
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Review recent posts retrieved from Meta Graph API with Likes, Comments, Saves, and Reach benchmarks.
              </p>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
