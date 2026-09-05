'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { ViralContentConcept } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Sparkles,
  Send,
  Copy,
  Check,
  Clock,
  Volume2,
  Video,
  FileImage,
  ChevronRight,
  Flame,
  ArrowUpRight,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ViralStudioPage() {
  const { report, addCustomConcept } = useDashboard();

  const [selectedConcept, setSelectedConcept] = useState<ViralContentConcept | null>(
    report?.viralRecommendations?.[0] || null
  );
  const [activeTab, setActiveTab] = useState<'ALL' | 'REELS' | 'CAROUSELS' | 'HIGH_VIRAL'>('ALL');

  // Custom Prompt Composer State
  const [customPrompt, setCustomPrompt] = useState('');
  const [customFormat, setCustomFormat] = useState('REEL_SHORT');
  const [generatingCustom, setGeneratingCustom] = useState(false);

  // Copy Feedback
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  const handleCustomGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim() || !report) return;

    setGeneratingCustom(true);
    try {
      const res = await fetch('/api/ai/generate-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: customPrompt,
          niche: report.detectedNiche.primaryCategory,
          format: customFormat,
        }),
      });
      const data = await res.json();
      if (data.concepts && data.concepts.length > 0) {
        const newConcept: ViralContentConcept = {
          id: `custom_${Date.now()}`,
          title: data.concepts[0].title,
          hook: data.concepts[0].hook,
          format: data.concepts[0].format,
          formatDisplay: data.concepts[0].format === 'REEL_SHORT' ? 'Fast Looping Reel' : 'Multi-Slide Carousel',
          whyTrending: `Custom engineered for topic: "${customPrompt}"`,
          targetCategory: report.detectedNiche.primaryCategory,
          scriptOutline: data.concepts[0].scriptOutline,
          captionTemplate: data.concepts[0].caption,
          recommendedAudioStyle: 'Trending spoken voiceover + low-tempo lo-fi',
          predictedImpact: {
            viralScore: 93,
            expectedSaves: 'VIRAL',
            reachMultiplier: '3.6x average',
          },
          recommendedTags: data.concepts[0].tags || ['#creator', '#growth', '#strategy'],
        };

        addCustomConcept(newConcept);
        setSelectedConcept(newConcept);
        setCustomPrompt('');

        try {
          confetti({ particleCount: 35, spread: 60 });
        } catch {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingCustom(false);
    }
  };

  const handleCopyCaption = () => {
    if (!selectedConcept) return;
    navigator.clipboard.writeText(selectedConcept.captionTemplate);
    setCopiedCaption(true);
    try {
      confetti({ particleCount: 25, spread: 45, origin: { y: 0.6 } });
    } catch {}
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const handleCopyFullScript = () => {
    if (!selectedConcept) return;
    const fullText = `CONCEPT: ${selectedConcept.title} (${selectedConcept.formatDisplay})\nHOOK: "${selectedConcept.hook}"\nWHY IT WORKS: ${selectedConcept.whyTrending}\n\nSTORYBOARD TIMELINE:\n${selectedConcept.scriptOutline
      .map((s) => `[${s.timing}] ${s.phase}\nVisual: ${s.visualAction}\nSpeech: ${s.narrationOrText}`)
      .join('\n\n')}\n\nCAPTION:\n${selectedConcept.captionTemplate}\n\nTAGS:\n${selectedConcept.recommendedTags.join(' ')}`;

    navigator.clipboard.writeText(fullText);
    setCopiedScript(true);
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.6 } });
    } catch {}
    setTimeout(() => setCopiedScript(false), 2000);
  };

  const filteredConcepts = (report?.viralRecommendations || []).filter((c) => {
    if (activeTab === 'REELS') return c.format.includes('REEL');
    if (activeTab === 'CAROUSELS') return c.format.includes('CAROUSEL');
    if (activeTab === 'HIGH_VIRAL') return c.predictedImpact.viralScore >= 92;
    return true;
  });

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
          Viral Content Studio
        </h1>
        <p className="text-base sm:text-lg text-zinc-300 mt-1.5">
          High-retention concepts, 3-second opening hooks, and scene-by-scene scripts tailored to your niche.
        </p>
      </div>

      {/* Spacious Custom AI Prompt Composer */}
      <Card className="border-zinc-800 bg-zinc-950/80 p-6 sm:p-7 shadow-sm">
        <form onSubmit={handleCustomGenerate} className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-bold text-zinc-300 uppercase tracking-wider font-mono">
              AI Idea &amp; Script Generator
            </span>
            <Badge variant="outline" className="text-xs sm:text-sm font-medium text-zinc-300 border-zinc-700 bg-zinc-900 py-1 px-3">
              Niche: {report?.detectedNiche.primaryCategory || 'Creator'}
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Ask AI: e.g. 3 concepts for launching a paid community, Why low-carb failed me..."
              className="flex-1 h-12 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 text-base text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            />

            <select
              value={customFormat}
              onChange={(e) => setCustomFormat(e.target.value)}
              className="h-12 rounded-xl border border-zinc-800 bg-zinc-900/70 px-4 text-sm sm:text-base text-zinc-200 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            >
              <option value="REEL_SHORT">7s - 15s Fast Looping Reel</option>
              <option value="CAROUSEL_EDUCATIONAL">Multi-Slide Educational Carousel</option>
              <option value="POV_STORY">POV Storytelling Reel</option>
            </select>

            <Button
              type="submit"
              variant="brand"
              size="default"
              disabled={generatingCustom || !customPrompt.trim()}
              className="h-12 px-7 text-sm sm:text-base font-semibold shrink-0 rounded-xl"
            >
              <Send className="w-4 h-4 mr-2" />
              {generatingCustom ? 'Engineering...' : 'Generate Script'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Studio Workbench (2-Column Spacious Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Ideas List (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="inline-flex rounded-lg bg-zinc-900 p-1.5 border border-zinc-800 text-sm">
              {(['ALL', 'REELS', 'CAROUSELS', 'HIGH_VIRAL'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-1.5 rounded-md font-semibold transition-all ${
                    activeTab === tab
                      ? 'bg-zinc-800 text-white shadow-sm'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {tab === 'ALL' ? 'All' : tab === 'REELS' ? 'Reels' : tab === 'CAROUSELS' ? 'Carousels' : 'Top Viral'}
                </button>
              ))}
            </div>

            <span className="text-sm text-zinc-400 font-mono font-medium">
              {filteredConcepts.length} concepts
            </span>
          </div>

          <div className="space-y-4">
            {filteredConcepts.map((concept) => {
              const isSelected = selectedConcept?.id === concept.id;
              return (
                <div
                  key={concept.id}
                  onClick={() => setSelectedConcept(concept)}
                  className={`rounded-2xl border p-6 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-zinc-300 bg-zinc-900 shadow-md ring-1 ring-zinc-400/30'
                      : 'border-zinc-800 bg-zinc-950/70 hover:border-zinc-600 hover:bg-zinc-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {concept.format.includes('REEL') ? (
                        <Video className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <FileImage className="w-4 h-4 text-zinc-400" />
                      )}
                      <span className="text-xs sm:text-sm font-mono text-zinc-300 font-medium">
                        {concept.formatDisplay}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-xs sm:text-sm py-0.5 px-2.5 font-mono font-semibold text-zinc-200 border-zinc-700 bg-zinc-900">
                      Score: {concept.predictedImpact.viralScore}/100
                    </Badge>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-white leading-snug mb-2.5">
                    {concept.title}
                  </h3>

                  <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-4 text-sm sm:text-base text-zinc-200 italic mb-3.5 leading-relaxed">
                    &ldquo;{concept.hook}&rdquo;
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm text-zinc-400 font-mono">
                    <span>{concept.predictedImpact.reachMultiplier}</span>
                    <span className="text-white font-bold flex items-center gap-1">
                      Inspect Teleprompter &rarr;
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Teleprompter & Script Studio (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          {selectedConcept ? (
            <Card className="border-zinc-800 bg-zinc-950/90 p-7 sm:p-9 space-y-7 shadow-sm">
              {/* Studio Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-zinc-800">
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Badge variant="outline" className="text-xs sm:text-sm py-1 px-3 font-mono border-zinc-700 bg-zinc-900 text-zinc-200">
                      {selectedConcept.formatDisplay}
                    </Badge>
                    <Badge variant="success" className="text-xs sm:text-sm py-1 px-3 font-bold">
                      Viral Score: {selectedConcept.predictedImpact.viralScore}/100
                    </Badge>
                    <Badge variant="muted" className="text-xs sm:text-sm py-1 px-3 font-mono">
                      {selectedConcept.predictedImpact.reachMultiplier}
                    </Badge>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {selectedConcept.title}
                  </h2>
                </div>

                <Button
                  variant="brand"
                  size="default"
                  onClick={handleCopyFullScript}
                  className="h-11 px-6 text-sm sm:text-base font-semibold shrink-0 shadow-sm"
                >
                  {copiedScript ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copiedScript ? 'Full Script Copied' : 'Copy Production Script'}
                </Button>
              </div>

              {/* 3-Second Hook Callout */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-6 space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm uppercase font-mono tracking-wider text-zinc-400 font-bold">
                  <span>The 3-Second Opening Hook</span>
                  <span className="text-emerald-400 font-bold">Curiosity Gap: High</span>
                </div>
                <p className="text-xl sm:text-2xl font-black text-white leading-snug">
                  &ldquo;{selectedConcept.hook}&rdquo;
                </p>
                <p className="text-sm sm:text-base text-zinc-300 pt-1 border-t border-zinc-800/70 leading-relaxed">
                  <strong className="text-white font-semibold">Algorithmic Driver:</strong> {selectedConcept.whyTrending}
                </p>
              </div>

              {/* Step-by-Step Script Timeline */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-base sm:text-lg font-bold text-white">
                  <span className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-zinc-400" />
                    Scene-by-Scene Timeline &amp; Teleprompter
                  </span>
                  <span className="text-sm font-mono text-zinc-400">
                    {selectedConcept.scriptOutline.length} segments
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedConcept.scriptOutline.map((step, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs sm:text-sm py-0.5 px-3 font-mono font-bold text-zinc-200 border-zinc-700 bg-zinc-900">
                          {step.phase}
                        </Badge>
                        <span className="text-sm text-zinc-300 font-mono font-bold">{step.timing}</span>
                      </div>
                      <div className="text-sm sm:text-base text-zinc-300">
                        <strong className="text-white font-medium">Visual Action:</strong> {step.visualAction}
                      </div>
                      <div className="text-base sm:text-lg font-semibold text-white pt-1">
                        <strong className="text-zinc-400 font-normal">Spoken / On-Screen:</strong> &ldquo;{step.narrationOrText}&rdquo;
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ready-to-Post Caption Box */}
              <div className="space-y-3 pt-3 border-t border-zinc-800">
                <div className="flex items-center justify-between">
                  <span className="text-base font-bold text-white">Ready Caption &amp; Call-To-Action</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyCaption}
                    className="h-9 text-sm text-zinc-300 hover:text-white font-medium"
                  >
                    {copiedCaption ? <Check className="w-4 h-4 text-emerald-400 mr-1.5" /> : <Copy className="w-4 h-4 mr-1.5" />}
                    {copiedCaption ? 'Copied' : 'Copy Caption'}
                  </Button>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 text-base text-zinc-200 whitespace-pre-wrap leading-relaxed">
                  {selectedConcept.captionTemplate}
                </div>
              </div>

              {/* Audio Recommendation */}
              <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 text-sm sm:text-base">
                <span className="text-zinc-400 font-medium">Recommended Audio Vibe:</span>
                <span className="text-white font-bold">{selectedConcept.recommendedAudioStyle}</span>
              </div>
            </Card>
          ) : (
            <Card className="border-dashed border-zinc-800 p-16 text-center text-base text-zinc-400">
              Select a concept from the left stream to inspect the teleprompter and script.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
