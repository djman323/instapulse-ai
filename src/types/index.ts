// ============================================================================
// InstaPulse AI - Core Data Contracts & TypeScript Interfaces
// ============================================================================

export type MediaType = 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';

export interface InstagramMediaInsight {
  reach?: number;
  impressions?: number;
  saved?: number;
  shares?: number;
  engagement?: number;
  video_views?: number;
}

export interface InstagramMediaItem {
  id: string;
  caption?: string;
  media_type: MediaType;
  media_url?: string;
  thumbnail_url?: string;
  permalink: string;
  timestamp: string;
  like_count: number;
  comments_count: number;
  insights?: InstagramMediaInsight;
}

export interface InstagramProfile {
  id: string;
  username: string;
  name: string;
  biography?: string;
  profile_picture_url?: string;
  followers_count: number;
  follows_count: number;
  media_count: number;
  account_type?: 'BUSINESS' | 'CREATOR' | 'DEMO';
  is_demo?: boolean;
}

export interface AccountPerformanceSummary {
  totalFollowers: number;
  avgEngagementRate: number; // e.g. 4.82%
  avgSavesPerPost: number;
  avgReachPerPost: number;
  saveToReachRatio: number; // key IG algorithmic signal
  topPerformingFormat: 'REELS' | 'CAROUSEL' | 'STATIC';
  formatBreakdown: {
    reels: { count: number; avgEngagement: number };
    carousels: { count: number; avgEngagement: number };
    images: { count: number; avgEngagement: number };
  };
  bestPostingHours: { hour: string; day: string; engagementScore: number }[];
}

export interface ViralContentConcept {
  id: string;
  title: string;
  hook: string; // The opening 3-second hook (visual + text + speech)
  format: 'REEL_SHORT' | 'REEL_LONG' | 'CAROUSEL_EDUCATIONAL' | 'POV_STORY' | 'BEFORE_AFTER';
  formatDisplay: string;
  whyTrending: string; // Algorithmic driver / trend psychology
  targetCategory: string; // e.g. "Tech / Productivity", "Fitness / Biohacking"
  scriptOutline: {
    phase: 'HOOK' | 'PROBLEM' | 'VALUE_DELIVERY' | 'CALL_TO_ACTION';
    timing: string; // e.g. "0:00 - 0:03"
    visualAction: string;
    narrationOrText: string;
  }[];
  captionTemplate: string;
  recommendedAudioStyle: string; // e.g. "Fast-tempo Lo-Fi Synth" or "Trending Whispered Voiceover"
  predictedImpact: {
    viralScore: number; // 0 - 100
    expectedSaves: 'HIGH' | 'EXTREME' | 'VIRAL';
    reachMultiplier: string; // e.g. "3.2x vs your average"
  };
  recommendedTags: string[];
}

export interface HashtagTier {
  category: 'HIGH_REACH_BROAD' | 'NICHE_TARGETED' | 'HIGH_INTENT_COMMUNITY';
  label: string;
  description: string;
  tags: { tag: string; estimatedVolume: string }[];
}

export interface AlgorithmicStrengthWeakness {
  strengths: {
    title: string;
    description: string;
    metricProof: string;
  }[];
  gapsToFix: {
    title: string;
    description: string;
    fixAction: string;
  }[];
}

export interface AIContentStrategyReport {
  generatedAt: string;
  creatorHandle: string;
  detectedNiche: {
    primaryCategory: string;
    subNiche: string;
    targetAudiencePersona: string;
    contentTone: string;
    nicheSaturationScore: number; // 0-100 (high saturation means unique hook is crucial)
  };
  performanceAudit: AlgorithmicStrengthWeakness;
  viralRecommendations: ViralContentConcept[];
  hashtagClusters: HashtagTier[];
  optimalPostingSchedule: {
    primeDay: string;
    primeTimeWindow: string;
    frequencyPerWeek: string;
    explanation: string;
  };
  algorithmDirectives: string[]; // 4 bullet point high-impact rules to 10x distribution
}

export interface AuthSession {
  sessionId?: string;
  user: InstagramProfile;
  accessToken?: string;
  isDemo: boolean;
  expiresAt: number;
  media?: InstagramMediaItem[];
  performance?: AccountPerformanceSummary;
  report?: AIContentStrategyReport;
}
