'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  InstagramProfile,
  AccountPerformanceSummary,
  InstagramMediaItem,
  AIContentStrategyReport,
  ViralContentConcept,
} from '@/types';
import { DEMO_CREATORS } from '@/lib/meta/mockData';
import { generateSynthesizedStrategy } from '@/lib/ai/synthesizer';

const initialCreator = DEMO_CREATORS['tech-ai'];
const initialReport = generateSynthesizedStrategy(
  initialCreator.profile,
  initialCreator.performance,
  initialCreator.media
);

interface DashboardContextType {
  profile: InstagramProfile;
  performance: AccountPerformanceSummary;
  media: InstagramMediaItem[];
  report: AIContentStrategyReport;
  isDemo: boolean;
  generatingStrategy: boolean;
  activePersona: string;
  refreshStrategy: () => Promise<void>;
  switchPersona: (persona: string) => Promise<void>;
  analyzeHandle: (username: string) => Promise<boolean>;
  addCustomConcept: (concept: ViralContentConcept) => void;
}

const DashboardContext = createContext<DashboardContextType | null>(null);

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<InstagramProfile>(initialCreator.profile);
  const [performance, setPerformance] = useState<AccountPerformanceSummary>(initialCreator.performance);
  const [media, setMedia] = useState<InstagramMediaItem[]>(initialCreator.media);
  const [report, setReport] = useState<AIContentStrategyReport>(initialReport);
  const [isDemo, setIsDemo] = useState(true);
  const [activePersona, setActivePersona] = useState('tech-ai');
  const [generatingStrategy, setGeneratingStrategy] = useState(false);

  useEffect(() => {
    // Initial fetch to sync with active session if user logged in via OAuth
    syncData();
  }, []);

  const syncData = async (persona?: string) => {
    try {
      const url = persona ? `/api/instagram/media?persona=${persona}` : '/api/instagram/media';
      const res = await fetch(url);
      const data = await res.json();

      if (data.profile) setProfile(data.profile);
      if (data.performance) setPerformance(data.performance);
      if (data.media) setMedia(data.media);
      if (typeof data.isDemo === 'boolean') setIsDemo(data.isDemo);

      if (data.report) {
        setReport(data.report);
      }
      if (data.isDemo === false) {
        setActivePersona('custom');
      }
    } catch (err) {
      console.error('Error syncing dashboard data:', err);
    }
  };

  const switchPersona = async (persona: string) => {
    setActivePersona(persona);
    if (DEMO_CREATORS[persona]) {
      const demo = DEMO_CREATORS[persona];
      setProfile(demo.profile);
      setPerformance(demo.performance);
      setMedia(demo.media);
      setIsDemo(true);
      const rep = generateSynthesizedStrategy(demo.profile, demo.performance, demo.media);
      setReport(rep);
    }
    await syncData(persona);
  };

  const refreshStrategy = async () => {
    setGeneratingStrategy(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, performance, media }),
      });
      const data = await res.json();
      if (data.report) {
        setReport(data.report);
      }
    } catch (err) {
      console.error('Error refreshing strategy:', err);
    } finally {
      setGeneratingStrategy(false);
    }
  };

  const analyzeHandle = async (username: string): Promise<boolean> => {
    setGeneratingStrategy(true);
    try {
      const res = await fetch('/api/instagram/handle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
      });
      const data = await res.json();
      if (data.success) {
        if (data.profile) setProfile(data.profile);
        if (data.performance) setPerformance(data.performance);
        if (data.media) setMedia(data.media);
        if (data.report) setReport(data.report);
        setIsDemo(false);
        setActivePersona('custom');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to analyze handle:', err);
      return false;
    } finally {
      setGeneratingStrategy(false);
    }
  };

  const addCustomConcept = (concept: ViralContentConcept) => {
    setReport((prev) => ({
      ...prev,
      viralRecommendations: [concept, ...prev.viralRecommendations],
    }));
  };

  return (
    <DashboardContext.Provider
      value={{
        profile,
        performance,
        media,
        report,
        isDemo,
        generatingStrategy,
        activePersona,
        refreshStrategy,
        switchPersona,
        analyzeHandle,
        addCustomConcept,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
