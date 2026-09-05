'use client';

import React, { useState } from 'react';
import { ViralContentConcept } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Check, Clock, Volume2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScriptModalProps {
  concept: ViralContentConcept | null;
  onClose: () => void;
}

export default function ScriptModal({ concept, onClose }: ScriptModalProps) {
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  if (!concept) return null;

  const triggerConfetti = () => {
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.7 } });
    } catch {}
  };

  const copyCaption = () => {
    navigator.clipboard.writeText(concept.captionTemplate);
    setCopiedCaption(true);
    triggerConfetti();
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const copyFullScript = () => {
    const fullScriptText = `Title: ${concept.title}\nHook: ${concept.hook}\nFormat: ${concept.formatDisplay}\n\nSTORYBOARD & SCRIPT:\n${concept.scriptOutline
      .map((s) => `[${s.timing}] ${s.phase}\nVisual: ${s.visualAction}\nSpeech/Text: ${s.narrationOrText}\n`)
      .join('\n')}\n\nCAPTION:\n${concept.captionTemplate}\n\nTAGS:\n${concept.recommendedTags.join(' ')}`;

    navigator.clipboard.writeText(fullScriptText);
    setCopiedScript(true);
    triggerConfetti();
    setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <Dialog open={!!concept} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-6 border-zinc-800 bg-zinc-950 text-zinc-100">
        <DialogHeader className="text-left space-y-2 pb-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="text-[11px] font-mono border-zinc-700 bg-zinc-900 text-zinc-300">
              {concept.formatDisplay}
            </Badge>
            <Badge variant="success" className="text-[11px]">
              Score: {concept.predictedImpact.viralScore}/100
            </Badge>
            <Badge variant="muted" className="text-[11px]">
              {concept.predictedImpact.reachMultiplier}
            </Badge>
          </div>
          <DialogTitle className="text-xl font-semibold text-zinc-100 leading-snug">
            {concept.title}
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            <strong>Algorithmic Trigger:</strong> {concept.whyTrending}
          </DialogDescription>
        </DialogHeader>

        {/* 3-Second Hook */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <div className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
            The 3-Second Opening Hook
          </div>
          <p className="text-sm font-medium text-zinc-100 leading-relaxed">
            &ldquo;{concept.hook}&rdquo;
          </p>
        </div>

        {/* Storyboard Phases */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            Scene-by-Scene Script Breakdown
          </div>

          <div className="space-y-2">
            {concept.scriptOutline.map((step, idx) => (
              <div
                key={idx}
                className="rounded-md border border-zinc-800/80 bg-zinc-900/30 p-3 text-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-mono text-zinc-400 border-zinc-800">
                    {step.phase}
                  </Badge>
                  <span className="text-[11px] text-zinc-500 font-mono">{step.timing}</span>
                </div>
                <div className="text-zinc-400 mb-1">
                  <span className="text-zinc-500">Visual:</span> {step.visualAction}
                </div>
                <div className="text-zinc-200">
                  <span className="text-zinc-500">Speech / Text:</span> &ldquo;{step.narrationOrText}&rdquo;
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Audio Recommendation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="rounded-md border border-zinc-800/80 bg-zinc-900/30 p-3">
            <div className="text-[11px] font-medium text-zinc-400 flex items-center gap-1.5 mb-1">
              <Volume2 className="w-3.5 h-3.5 text-zinc-400" /> Audio Style
            </div>
            <div className="text-zinc-200">{concept.recommendedAudioStyle}</div>
          </div>
          <div className="rounded-md border border-zinc-800/80 bg-zinc-900/30 p-3">
            <div className="text-[11px] font-medium text-zinc-400 mb-1">
              Target Tags
            </div>
            <div className="flex flex-wrap gap-1">
              {concept.recommendedTags.map((t, i) => (
                <span key={i} className="text-[11px] text-zinc-400">{t}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Caption */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-300">Ready Caption</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyCaption}
              className="h-7 text-xs text-zinc-400 hover:text-zinc-100"
            >
              {copiedCaption ? <Check className="w-3 h-3 text-emerald-400 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
              {copiedCaption ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <div className="rounded-md border border-zinc-800 bg-zinc-950 p-3 text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed">
            {concept.captionTemplate}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
          <Button variant="outline" size="sm" onClick={onClose} className="text-xs">
            Close
          </Button>
          <Button variant="brand" size="sm" onClick={copyFullScript} className="text-xs">
            {copiedScript ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 mr-1" />}
            {copiedScript ? 'Full Script Copied' : 'Copy Production Script'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
