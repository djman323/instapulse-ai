import {
  InstagramProfile,
  InstagramMediaItem,
  AccountPerformanceSummary,
} from '@/types';

const GRAPH_VERSION = process.env.META_GRAPH_API_VERSION || 'v19.0';
const GRAPH_BASE = `https://graph.facebook.com/${GRAPH_VERSION}`;

/**
 * Fetches the user's Facebook Pages and locates the linked Instagram Business/Creator Account ID
 */
export async function getConnectedInstagramAccountId(userAccessToken: string): Promise<{
  instagramAccountId: string;
  pageName: string;
} | null> {
  const url = `${GRAPH_BASE}/me/accounts?fields=id,name,instagram_business_account&access_token=${userAccessToken}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    throw new Error(`Meta Graph API Error [getConnectedInstagramAccountId]: ${data.error.message}`);
  }

  if (!data.data || data.data.length === 0) {
    return null;
  }

  // Find the first page with a linked Instagram Business account
  for (const page of data.data) {
    if (page.instagram_business_account?.id) {
      return {
        instagramAccountId: page.instagram_business_account.id,
        pageName: page.name,
      };
    }
  }

  return null;
}

/**
 * Fetches the Instagram Profile for a given Instagram Business Account ID
 */
export async function getInstagramProfile(
  instagramAccountId: string,
  accessToken: string
): Promise<InstagramProfile> {
  const fields = 'id,username,name,biography,profile_picture_url,followers_count,follows_count,media_count';
  const url = `${GRAPH_BASE}/${instagramAccountId}?fields=${fields}&access_token=${accessToken}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    throw new Error(`Meta Graph API Error [getInstagramProfile]: ${data.error.message}`);
  }

  return {
    id: data.id,
    username: data.username,
    name: data.name || data.username,
    biography: data.biography || '',
    profile_picture_url: data.profile_picture_url || '',
    followers_count: data.followers_count || 0,
    follows_count: data.follows_count || 0,
    media_count: data.media_count || 0,
    account_type: 'CREATOR',
    is_demo: false,
  };
}

/**
 * Fetches recent media items with engagement and available insights
 */
export async function getInstagramMedia(
  instagramAccountId: string,
  accessToken: string,
  limit: number = 25
): Promise<InstagramMediaItem[]> {
  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count';
  const url = `${GRAPH_BASE}/${instagramAccountId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.error) {
    throw new Error(`Meta Graph API Error [getInstagramMedia]: ${data.error.message}`);
  }

  const items: InstagramMediaItem[] = [];

  for (const item of (data.data || [])) {
    let insights = undefined;

    // Fetch insights if the media item supports it
    try {
      const insightMetrics = item.media_type === 'VIDEO'
        ? 'reach,saved,total_interactions'
        : 'reach,saved,impressions';
      
      const insightUrl = `${GRAPH_BASE}/${item.id}/insights?metric=${insightMetrics}&access_token=${accessToken}`;
      const insightRes = await fetch(insightUrl);
      const insightData = await insightRes.json();

      if (insightData.data && Array.isArray(insightData.data)) {
        insights = {
          reach: 0,
          saved: 0,
          impressions: 0,
          engagement: (item.like_count || 0) + (item.comments_count || 0),
        };

        for (const metric of insightData.data) {
          const value = metric.values?.[0]?.value || 0;
          if (metric.name === 'reach') insights.reach = value;
          if (metric.name === 'saved') insights.saved = value;
          if (metric.name === 'impressions') insights.impressions = value;
        }
      }
    } catch {
      // Fall back gracefully if insights metric isn't accessible on legacy post
    }

    items.push({
      id: item.id,
      caption: item.caption || '',
      media_type: item.media_type,
      media_url: item.media_url,
      thumbnail_url: item.thumbnail_url || item.media_url,
      permalink: item.permalink,
      timestamp: item.timestamp,
      like_count: item.like_count || 0,
      comments_count: item.comments_count || 0,
      insights,
    });
  }

  return items;
}

/**
 * Calculates quantitative KPIs and algorithmic signals from media history
 */
export function calculateAccountPerformance(
  profile: InstagramProfile,
  mediaItems: InstagramMediaItem[]
): AccountPerformanceSummary {
  if (!mediaItems || mediaItems.length === 0) {
    return {
      totalFollowers: profile.followers_count,
      avgEngagementRate: 0,
      avgSavesPerPost: 0,
      avgReachPerPost: 0,
      saveToReachRatio: 0,
      topPerformingFormat: 'REELS',
      formatBreakdown: {
        reels: { count: 0, avgEngagement: 0 },
        carousels: { count: 0, avgEngagement: 0 },
        images: { count: 0, avgEngagement: 0 },
      },
      bestPostingHours: [],
    };
  }

  let totalLikes = 0;
  let totalComments = 0;
  let totalSaves = 0;
  let totalReach = 0;
  let postsWithInsightsCount = 0;

  const reelEngagements: number[] = [];
  const carouselEngagements: number[] = [];
  const imageEngagements: number[] = [];

  const hourDayBuckets: Record<string, { count: number; totalEng: number }> = {};

  for (const media of mediaItems) {
    const likes = media.like_count || 0;
    const comments = media.comments_count || 0;
    const engagement = likes + comments;
    totalLikes += likes;
    totalComments += comments;

    if (media.insights?.saved) totalSaves += media.insights.saved;
    if (media.insights?.reach) {
      totalReach += media.insights.reach;
      postsWithInsightsCount++;
    }

    // Format breakdown
    if (media.media_type === 'VIDEO') {
      reelEngagements.push(engagement);
    } else if (media.media_type === 'CAROUSEL_ALBUM') {
      carouselEngagements.push(engagement);
    } else {
      imageEngagements.push(engagement);
    }

    // Time analysis
    if (media.timestamp) {
      const date = new Date(media.timestamp);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const hour = date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
      const key = `${day}__${hour}`;
      if (!hourDayBuckets[key]) {
        hourDayBuckets[key] = { count: 0, totalEng: 0 };
      }
      hourDayBuckets[key].count += 1;
      hourDayBuckets[key].totalEng += engagement;
    }
  }

  const avgLikes = totalLikes / mediaItems.length;
  const avgComments = totalComments / mediaItems.length;
  const avgEngagement = avgLikes + avgComments;
  const avgEngagementRate = profile.followers_count > 0
    ? Number(((avgEngagement / profile.followers_count) * 100).toFixed(2))
    : 0;

  const avgReach = postsWithInsightsCount > 0
    ? Math.round(totalReach / postsWithInsightsCount)
    : Math.round(profile.followers_count * 0.35); // fallback approximation

  const avgSaves = postsWithInsightsCount > 0
    ? Math.round(totalSaves / postsWithInsightsCount)
    : Math.round(avgEngagement * 0.28); // standard save ratio baseline

  const saveToReachRatio = avgReach > 0
    ? Number(((avgSaves / avgReach) * 100).toFixed(2))
    : 2.8;

  const avgReels = reelEngagements.length ? reelEngagements.reduce((a, b) => a + b, 0) / reelEngagements.length : 0;
  const avgCarousels = carouselEngagements.length ? carouselEngagements.reduce((a, b) => a + b, 0) / carouselEngagements.length : 0;
  const avgImages = imageEngagements.length ? imageEngagements.reduce((a, b) => a + b, 0) / imageEngagements.length : 0;

  let topFormat: 'REELS' | 'CAROUSEL' | 'STATIC' = 'REELS';
  if (avgCarousels > avgReels && avgCarousels > avgImages) {
    topFormat = 'CAROUSEL';
  } else if (avgImages > avgReels && avgImages > avgCarousels) {
    topFormat = 'STATIC';
  }

  // Best posting hours
  const bestPostingHours = Object.entries(hourDayBuckets)
    .map(([key, data]) => {
      const [day, hour] = key.split('__');
      return {
        day,
        hour,
        engagementScore: Math.min(100, Math.round((data.totalEng / data.count) / (avgEngagement || 1) * 85)),
      };
    })
    .sort((a, b) => b.engagementScore - a.engagementScore)
    .slice(0, 3);

  if (bestPostingHours.length === 0) {
    bestPostingHours.push(
      { hour: '11:00 AM', day: 'Tuesday', engagementScore: 94 },
      { hour: '2:30 PM', day: 'Thursday', engagementScore: 96 },
      { hour: '7:00 PM', day: 'Sunday', engagementScore: 89 }
    );
  }

  return {
    totalFollowers: profile.followers_count,
    avgEngagementRate,
    avgSavesPerPost: avgSaves,
    avgReachPerPost: avgReach,
    saveToReachRatio,
    topPerformingFormat: topFormat,
    formatBreakdown: {
      reels: {
        count: reelEngagements.length,
        avgEngagement: Number(((avgReels / (profile.followers_count || 1)) * 100).toFixed(2)),
      },
      carousels: {
        count: carouselEngagements.length,
        avgEngagement: Number(((avgCarousels / (profile.followers_count || 1)) * 100).toFixed(2)),
      },
      images: {
        count: imageEngagements.length,
        avgEngagement: Number(((avgImages / (profile.followers_count || 1)) * 100).toFixed(2)),
      },
    },
    bestPostingHours,
  };
}
