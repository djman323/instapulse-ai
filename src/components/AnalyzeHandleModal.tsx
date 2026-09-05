'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  Sparkles,
  X,
  AlertCircle,
  CheckCircle2,
  Instagram,
  ArrowRight,
} from 'lucide-react';

interface AnalyzeHandleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AnalyzeHandleModal({ isOpen, onClose }: AnalyzeHandleModalProps) {
  const { analyzeHandle } = useDashboard();
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handle.trim()) return;

    setLoading(true);
    setError('');

    try {
      const success = await analyzeHandle(handle);
      if (success) {
        onClose();
        setHandle('');
      } else {
        setError('Could not retrieve public profile. Ensure the handle exists and has public posts.');
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to analyze handle.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSelect = (suggestion: string) => {
    setHandle(suggestion);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-7 sm:p-8 shadow-2xl space-y-6 text-zinc-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2">
            <Badge variant="outline" className="text-xs font-mono font-bold py-0.5 px-2.5 border-zinc-700 bg-zinc-900 text-zinc-300">
              ZERO OAUTH FRICTION
            </Badge>
            <Badge variant="success" className="text-xs font-bold py-0.5 px-2">
              Apify Live Engine
            </Badge>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white">
            Analyze Any Instagram Account
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Enter your handle or spy on any top competitor in your niche. We fetch public reels, carousels, and engagement metrics via Apify, then run Cloud Gemini AI.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500 text-base font-mono">
              @
            </div>
            <input
              type="text"
              value={handle}
              onChange={(e) => {
                setHandle(e.target.value);
                setError('');
              }}
              placeholder="username (e.g. hubspot, mrbeast, yourname)"
              className="w-full h-12 pl-9 pr-4 rounded-xl border border-zinc-800 bg-zinc-900/80 text-base text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-400 font-medium"
              autoFocus
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-xs sm:text-sm text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-2">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">
              Quick Suggestions to Test:
            </div>
            <div className="flex flex-wrap gap-2">
              {['hubspot', 'mrbeast', 'alexhormozi', 'duolingo', 'gymshark'].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleQuickSelect(s)}
                  className="px-2.5 py-1 rounded-lg border border-zinc-800 bg-zinc-900/60 text-xs font-mono text-zinc-300 hover:border-zinc-700 hover:text-white transition-colors"
                >
                  @{s}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="default"
              onClick={onClose}
              className="h-11 px-5 text-sm font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="brand"
              size="default"
              disabled={loading || !handle.trim()}
              className="h-11 px-6 text-sm font-semibold shadow-sm"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {loading ? 'Scraping & Synthesizing AI...' : 'Analyze Creator &rarr;'}
            </Button>
          </div>
        </form>

        {/* Footnote */}
        <div className="text-xs text-zinc-500 border-t border-zinc-900 pt-3">
          💡 <strong>Pro-Tip:</strong> No Facebook login or permissions required. Works with any public profile.
        </div>
      </div>
    </div>
  );
}
