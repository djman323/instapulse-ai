'use client';

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, FileImage, Heart, MessageCircle, Bookmark, Eye } from 'lucide-react';

export default function MediaCatalogPage() {
  const { media, profile } = useDashboard();
  const [filter, setFilter] = useState<'ALL' | 'VIDEO' | 'CAROUSEL_ALBUM' | 'IMAGE'>('ALL');
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  const filtered = media.filter((m) => {
    if (filter === 'ALL') return true;
    return m.media_type === filter;
  });

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Historical Media Catalog
          </h1>
          <p className="text-base sm:text-lg text-zinc-300 mt-1.5">
            {media.length} recent posts retrieved via Meta Graph API for @{profile.username}.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="inline-flex rounded-lg bg-zinc-900 p-1.5 border border-zinc-800 text-sm">
          {(['ALL', 'VIDEO', 'CAROUSEL_ALBUM', 'IMAGE'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md font-semibold transition-all ${
                filter === f
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {f === 'ALL' ? 'All Formats' : f === 'VIDEO' ? 'Reels' : f === 'CAROUSEL_ALBUM' ? 'Carousels' : 'Photos'}
            </button>
          ))}
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post) => {
          const isExpanded = expandedPostId === post.id;
          const likes = post.like_count || 0;
          const comments = post.comments_count || 0;
          const saves = post.insights?.saved || Math.round((likes + comments) * 0.3);
          const reach = post.insights?.reach || Math.round((likes + comments) * 8.5);

          return (
            <Card key={post.id} className="border-zinc-800 bg-zinc-950/80 p-6 sm:p-7 flex flex-col justify-between space-y-5 shadow-sm">
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs sm:text-sm font-mono font-bold py-1 px-3 border-zinc-700 bg-zinc-900 text-zinc-200">
                    {post.media_type === 'VIDEO' ? 'REEL' : post.media_type === 'CAROUSEL_ALBUM' ? 'CAROUSEL' : 'PHOTO'}
                  </Badge>
                  <span className="text-sm text-zinc-400 font-mono">
                    {new Date(post.timestamp).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <div className="text-sm sm:text-base text-zinc-200 leading-relaxed">
                  <p className={isExpanded ? 'whitespace-pre-wrap' : 'line-clamp-3'}>
                    {post.caption || 'No caption available.'}
                  </p>
                  {(post.caption?.length || 0) > 120 && (
                    <button
                      onClick={() => setExpandedPostId(isExpanded ? null : post.id)}
                      className="text-sm text-zinc-400 hover:text-white font-semibold mt-2 inline-block underline"
                    >
                      {isExpanded ? 'Show less' : 'Read full caption'}
                    </button>
                  )}
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-2.5 pt-4 border-t border-zinc-800 text-center">
                <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-2.5">
                  <div className="text-xs font-bold text-zinc-400 font-mono tracking-wider">LIKES</div>
                  <div className="text-base sm:text-lg font-black text-white mt-0.5">{likes.toLocaleString()}</div>
                </div>
                <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-2.5">
                  <div className="text-xs font-bold text-zinc-400 font-mono tracking-wider">COMMENTS</div>
                  <div className="text-base sm:text-lg font-black text-white mt-0.5">{comments.toLocaleString()}</div>
                </div>
                <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-2.5">
                  <div className="text-xs font-bold text-emerald-400 font-mono tracking-wider">SAVES</div>
                  <div className="text-base sm:text-lg font-black text-emerald-400 mt-0.5">{saves.toLocaleString()}</div>
                </div>
                <div className="rounded-xl bg-zinc-900/60 border border-zinc-800/80 p-2.5">
                  <div className="text-xs font-bold text-zinc-400 font-mono tracking-wider">REACH</div>
                  <div className="text-base sm:text-lg font-black text-white mt-0.5">{reach.toLocaleString()}</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
