'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hash, Copy, Check, Info, Sparkles, TrendingUp } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function HashtagsPage() {
  const { report } = useDashboard();
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  const [copiedTierIdx, setCopiedTierIdx] = useState<number | null>(null);

  const copyIndividualTag = (tag: string) => {
    navigator.clipboard.writeText(tag);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 1500);
  };

  const copyEntireTier = (tags: { tag: string }[], tierIdx: number) => {
    const text = tags.map((t) => t.tag).join(' ');
    navigator.clipboard.writeText(text);
    setCopiedTierIdx(tierIdx);
    try {
      confetti({ particleCount: 25, spread: 45 });
    } catch {}
    setTimeout(() => setCopiedTierIdx(null), 2000);
  };

  const copyAllTiers = () => {
    if (!report) return;
    const allTags = report.hashtagClusters.flatMap((c) => c.tags.map((t) => t.tag)).join(' ');
    navigator.clipboard.writeText(allTags);
    try {
      confetti({ particleCount: 40, spread: 60 });
    } catch {}
  };

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Smart 3-Tiered Hashtags &amp; Search SEO
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 mt-1.5">
            Segmented by search volume to optimize both Explore discovery and long-tail Instagram SEO indexing.
          </p>
        </div>

        <Button
          variant="brand"
          size="default"
          onClick={copyAllTiers}
          className="text-sm sm:text-base font-semibold h-11 px-6 shadow-sm"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy All 3 Tiers
        </Button>
      </div>

      {/* 3 Tier Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {report?.hashtagClusters.map((cluster, idx) => (
          <Card key={idx} className="border-zinc-800 bg-zinc-950/80 p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs sm:text-sm font-mono font-bold py-1 px-3 border-zinc-700 bg-zinc-900 text-zinc-200">
                  TIER {idx + 1}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyEntireTier(cluster.tags, idx)}
                  className="h-9 text-sm text-zinc-300 hover:text-white font-medium"
                >
                  {copiedTierIdx === idx ? <Check className="w-4 h-4 mr-1.5 text-emerald-400" /> : <Copy className="w-4 h-4 mr-1.5" />}
                  {copiedTierIdx === idx ? 'Copied Tier' : 'Copy Tier'}
                </Button>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">{cluster.label}</h3>
                <p className="text-sm sm:text-base text-zinc-300 mt-1.5 leading-relaxed">
                  {cluster.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-3">
                {cluster.tags.map((item, tIdx) => {
                  const isCopied = copiedTag === item.tag;
                  return (
                    <button
                      key={tIdx}
                      onClick={() => copyIndividualTag(item.tag)}
                      className={`rounded-xl border px-3.5 py-2.5 text-sm sm:text-base font-semibold transition-all flex items-center gap-2.5 ${
                        isCopied
                          ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 shadow-sm'
                          : 'border-zinc-800 bg-zinc-900/70 text-zinc-200 hover:border-zinc-600 hover:bg-zinc-900 hover:text-white'
                      }`}
                    >
                      <Hash className="w-4 h-4 text-zinc-400" />
                      <span>{item.tag.replace('#', '')}</span>
                      <span className="text-xs sm:text-sm text-zinc-400 font-mono font-normal">
                        {item.estimatedVolume}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-sm text-zinc-400 pt-4 border-t border-zinc-800 font-mono">
              {cluster.tags.length} recommended anchor tags
            </div>
          </Card>
        ))}
      </div>

      {/* SEO & Algorithm Indexing Guide */}
      <Card className="border-zinc-800 bg-zinc-950/80 p-7 sm:p-9 space-y-5 shadow-sm">
        <div className="flex items-center gap-2.5">
          <Info className="w-5 h-5 text-zinc-300" />
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Instagram Search &amp; Explore SEO Formula
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-zinc-300 pt-2">
          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-2.5">
            <div className="font-bold text-white text-lg">1. The First 5 Words</div>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Instagram&apos;s semantic vision parser prioritizes the first 5 words of your caption. Always lead with your primary target keyword.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-2.5">
            <div className="font-bold text-white text-lg">2. Tiered Distribution</div>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              Mix 1 Broad tag, 3 Niche tags, and 2 Community tags. Do not exceed 8 hashtags per post to avoid spam de-ranking.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-6 space-y-2.5">
            <div className="font-bold text-white text-lg">3. Comment Triggers</div>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
              End captions with a specific keyword trigger (e.g. &ldquo;Drop PROMPT below&rdquo;). This boosts initial engagement signals by 3.8x.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
