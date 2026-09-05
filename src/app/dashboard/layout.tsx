'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { DashboardProvider, useDashboard } from '@/context/DashboardContext';
import ExportModal from '@/components/ExportModal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  BarChart3,
  Video,
  Hash,
  Grid,
  Settings,
  RotateCw,
  FileText,
  LogOut,
  Zap,
  Instagram,
  Search,
} from 'lucide-react';
import AnalyzeHandleModal from '@/components/AnalyzeHandleModal';

function DashboardNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    profile,
    performance,
    report,
    isDemo,
    activePersona,
    switchPersona,
    refreshStrategy,
    generatingStrategy,
  } = useDashboard();

  const [showExportModal, setShowExportModal] = useState(false);
  const [showHandleModal, setShowHandleModal] = useState(false);

  const navTabs = [
    { name: 'Overview', href: '/dashboard', icon: BarChart3 },
    { name: 'Viral Studio', href: '/dashboard/studio', icon: Video },
    { name: 'Hashtags & SEO', href: '/dashboard/hashtags', icon: Hash },
    { name: 'Media Catalog', href: '/dashboard/media', icon: Grid },
    { name: 'API Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-md">
        {/* Top Command Row */}
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5 hover:opacity-85 transition-opacity">
              <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-zinc-950" />
              </div>
              <span className="font-semibold text-base tracking-tight text-zinc-100">
                InstaPulse <span className="text-zinc-500 font-normal">AI</span>
              </span>
            </Link>

            <div className="h-5 w-[1px] bg-zinc-800 hidden md:block" />

            {/* Creator Profile Chip */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-zinc-700 bg-zinc-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={profile.profile_picture_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                  alt={profile.username}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-zinc-100">@{profile.username}</span>
                  <Badge variant="outline" className="text-xs py-0.5 px-2 font-medium text-zinc-300 border-zinc-700">
                    {isDemo ? 'Sandbox Demo' : 'Live Analyzed'}
                  </Badge>
                </div>
                <div className="text-xs sm:text-sm text-zinc-400">
                  {profile.followers_count.toLocaleString()} followers &bull; {profile.media_count} posts
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="brand"
              size="sm"
              onClick={() => setShowHandleModal(true)}
              className="h-9 px-3.5 text-xs sm:text-sm font-semibold shadow-sm"
            >
              <Search className="w-3.5 h-3.5 mr-1.5" />
              Analyze @handle
            </Button>

            <select
              value={!isDemo ? 'custom' : activePersona}
              onChange={(e) => switchPersona(e.target.value)}
              className="h-9 rounded-md border border-zinc-800 bg-zinc-900 px-3 text-xs sm:text-sm text-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-400"
            >
              {!isDemo && (
                <option value="custom">✨ @{profile.username} (Live Analyzed)</option>
              )}
              <option value="tech-ai">⚡ Tech / AI (@alexrivera_ai)</option>
              <option value="fitness-wellness">🧘‍♀️ Fitness (@elenafit_flow)</option>
              <option value="fashion-luxury">👔 Menswear (@marcusvance_style)</option>
              <option value="travel-food">🍜 Food &amp; Travel (@nomadfoodie_diaries)</option>
            </select>

            <Button
              variant="outline"
              size="sm"
              onClick={refreshStrategy}
              disabled={generatingStrategy}
              className="h-9 px-3 text-xs sm:text-sm font-medium"
            >
              <RotateCw className={`w-3.5 h-3.5 mr-1.5 ${generatingStrategy ? 'animate-spin' : ''}`} />
              {generatingStrategy ? 'Analyzing...' : 'Sync AI'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowExportModal(true)}
              className="h-9 px-3 text-xs sm:text-sm font-medium hidden sm:inline-flex"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5 text-zinc-400" />
              Export Deck
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-9 w-9 text-zinc-400 hover:text-zinc-100"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Secondary Navigation Tabs Row */}
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-2 border-t border-zinc-800/80 py-2.5 overflow-x-auto">
          {navTabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2.5 px-4 py-2 rounded-lg text-sm sm:text-base font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-zinc-800/90 text-white font-semibold shadow-sm border border-zinc-700/60'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-zinc-100' : 'text-zinc-400'}`} />
                {tab.name}
              </Link>
            );
          })}
        </div>
      </header>

      {/* Export Deck Modal */}
      {showExportModal && (
        <ExportModal
          report={report}
          profile={profile}
          performance={performance}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Analyze Handle Modal */}
      <AnalyzeHandleModal
        isOpen={showHandleModal}
        onClose={() => setShowHandleModal(false)}
      />
    </>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardProvider>
      <div className="min-h-screen flex flex-col bg-[#09090b] text-zinc-100">
        <DashboardNavbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </DashboardProvider>
  );
}
