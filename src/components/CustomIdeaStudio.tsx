'use client';

import React, { useState } from 'react';
import { Sparkles, Send, Copy, Check } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import confetti from 'canvas-confetti';

interface CustomIdeaStudioProps {
  niche: string;
}

export default function CustomIdeaStudio({ niche }: CustomIdeaStudioProps) {
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('REEL_SHORT');
  const [loading, setLoading] = useState(false);
  const [generatedConcepts, setGeneratedConcepts] = useState<any[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/ai/generate-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, niche, format }),
      });
      const data = await res.json();
      if (data.concepts) {
        setGeneratedConcepts(data.concepts);
        try {
          confetti({ particleCount: 30, spread: 50 });
        } catch {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyConcept = (c: any, index: number) => {
    const text = `Title: ${c.title}\nHook: ${c.hook}\nFormat: ${c.format}\n\nOutline:\n${c.scriptOutline?.map((s: any) => `[${s.timing}] ${s.phase}: ${s.narrationOrText}`).join('\n')}\n\nCaption:\n${c.caption}\n\nTags:\n${c.tags?.join(' ')}`;
    navigator.clipboard.writeText(text);
    setCopiedIdx(index);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <Card className="border-zinc-800 bg-zinc-950/70">
      <CardHeader className="pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <CardTitle className="text-base font-semibold">Custom Topic Idea Engine</CardTitle>
            <CardDescription className="text-xs">
              Generate tailored viral hooks and outlines for upcoming campaigns.
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-[11px] font-normal text-zinc-400 border-zinc-800">
            Niche: {niche}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleGenerate} className="flex flex-wrap gap-2.5 mb-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. 3 productivity tools, Why low carb failed me, Minimalist wardrobe..."
            className="flex-1 min-w-[240px] h-9 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          />

          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="h-9 rounded-md border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-400"
          >
            <option value="REEL_SHORT">7s - 15s Fast Reel</option>
            <option value="CAROUSEL_EDUCATIONAL">Multi-Slide Carousel</option>
            <option value="POV_STORY">POV Storytelling Reel</option>
          </select>

          <Button
            type="submit"
            variant="brand"
            size="sm"
            disabled={loading || !topic.trim()}
            className="h-9 px-4 text-xs"
          >
            <Send className="w-3.5 h-3.5 mr-1.5" />
            {loading ? 'Generating...' : 'Generate Hook'}
          </Button>
        </form>

        {generatedConcepts.length > 0 && (
          <div className="space-y-3 pt-2">
            {generatedConcepts.map((concept, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-zinc-800 bg-zinc-900/30 p-4 text-xs space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-200">{concept.title}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyConcept(concept, idx)}
                    className="h-7 text-xs text-zinc-400 hover:text-zinc-100"
                  >
                    {copiedIdx === idx ? <Check className="w-3 h-3 text-emerald-400 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copiedIdx === idx ? 'Copied' : 'Copy'}
                  </Button>
                </div>

                <div className="rounded border border-zinc-800 bg-zinc-950 p-2.5 text-zinc-200">
                  <span className="text-zinc-500">Hook:</span> &ldquo;{concept.hook}&rdquo;
                </div>

                <div className="space-y-1 text-zinc-400">
                  {concept.scriptOutline?.map((s: any, sIdx: number) => (
                    <div key={sIdx}>
                      <span className="text-zinc-500 font-mono">[{s.timing}]:</span> {s.narrationOrText}
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {concept.tags?.map((t: string, tIdx: number) => (
                    <Badge key={tIdx} variant="outline" className="text-[10px] py-0 px-1.5 text-zinc-400 border-zinc-800">
                      {t}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
