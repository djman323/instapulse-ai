import { InstagramProfile, InstagramMediaItem, AccountPerformanceSummary } from '@/types';

export function buildStrategyPrompt(
  profile: InstagramProfile,
  performance: AccountPerformanceSummary,
  recentMedia: InstagramMediaItem[]
): string {
  const mediaSummary = recentMedia.slice(0, 10).map((m, idx) => {
    return `[Post #${idx + 1}]
- Type: ${m.media_type}
- Likes: ${m.like_count}, Comments: ${m.comments_count}, Saves: ${m.insights?.saved || 'N/A'}, Reach: ${m.insights?.reach || 'N/A'}
- Caption Excerpt: "${(m.caption || '').slice(0, 200).replace(/\n/g, ' ')}"
`;
  }).join('\n');

  return `You are an elite Instagram Algorithm Engineer and Viral Content Strategist for top 0.1% creators and media brands.

Analyze this creator's Instagram account metrics and recent content catalog to deliver a comprehensive, actionable, and mathematically backed content strategy report.

=== CREATOR PROFILE ===
- Handle: @${profile.username}
- Name: ${profile.name}
- Bio: "${profile.biography || ''}"
- Followers: ${profile.followers_count.toLocaleString()}
- Total Posts: ${profile.media_count}

=== QUANTITATIVE PERFORMANCE ===
- Average Engagement Rate: ${performance.avgEngagementRate}%
- Average Saves Per Post: ${performance.avgSavesPerPost}
- Average Reach Per Post: ${performance.avgReachPerPost}
- Save-to-Reach Ratio: ${performance.saveToReachRatio}%
- Top Performing Format: ${performance.topPerformingFormat}
- Format Breakdown:
  * Reels: ${performance.formatBreakdown.reels.count} posts, avg eng ${performance.formatBreakdown.reels.avgEngagement}%
  * Carousels: ${performance.formatBreakdown.carousels.count} posts, avg eng ${performance.formatBreakdown.carousels.avgEngagement}%
  * Static Images: ${performance.formatBreakdown.images.count} posts, avg eng ${performance.formatBreakdown.images.avgEngagement}%

=== RECENT POSTS SAMPLE ===
${mediaSummary}

=== INSTRUCTIONS ===
Deliver your analysis strictly in JSON format conforming to this exact TypeScript structure:

{
  "detectedNiche": {
    "primaryCategory": "string",
    "subNiche": "string",
    "targetAudiencePersona": "string",
    "contentTone": "string",
    "nicheSaturationScore": number (1-100)
  },
  "performanceAudit": {
    "strengths": [
      {
        "title": "string",
        "description": "string",
        "metricProof": "string"
      }
    ],
    "gapsToFix": [
      {
        "title": "string",
        "description": "string",
        "fixAction": "string"
      }
    ]
  },
  "viralRecommendations": [
    {
      "id": "concept_1",
      "title": "string",
      "hook": "string (the punchy 3-second hook: visual + text + spoken)",
      "format": "REEL_SHORT" | "REEL_LONG" | "CAROUSEL_EDUCATIONAL" | "POV_STORY" | "BEFORE_AFTER",
      "formatDisplay": "string (e.g. 7-Second Looping Reel / 6-Slide Carousel)",
      "whyTrending": "string (algorithmic driver: why this is surging in their category right now)",
      "targetCategory": "string",
      "scriptOutline": [
        {
          "phase": "HOOK" | "PROBLEM" | "VALUE_DELIVERY" | "CALL_TO_ACTION",
          "timing": "string (e.g. 0:00 - 0:03)",
          "visualAction": "string",
          "narrationOrText": "string"
        }
      ],
      "captionTemplate": "string (complete ready-to-use caption with comment bait and CTA)",
      "recommendedAudioStyle": "string",
      "predictedImpact": {
        "viralScore": number (80-99),
        "expectedSaves": "HIGH" | "EXTREME" | "VIRAL",
        "reachMultiplier": "string (e.g. 2.8x - 4.5x average)"
      },
      "recommendedTags": ["#tag1", "#tag2", "#tag3", "#tag4", "#tag5"]
    }
  ],
  "hashtagClusters": [
    {
      "category": "HIGH_REACH_BROAD",
      "label": "Broad Reach (500k+ posts)",
      "description": "Massive discovery anchors to feed the Explore feed algorithm",
      "tags": [
        { "tag": "#example", "estimatedVolume": "1.2M posts" }
      ]
    },
    {
      "category": "NICHE_TARGETED",
      "label": "Niche Targeted (50k - 500k posts)",
      "description": "High engagement core category tags where ranking top 9 is attainable",
      "tags": [
        { "tag": "#example", "estimatedVolume": "180k posts" }
      ]
    },
    {
      "category": "HIGH_INTENT_COMMUNITY",
      "label": "Community & Search SEO (< 50k posts)",
      "description": "High save-rate community tags searched by high-intent followers",
      "tags": [
        { "tag": "#example", "estimatedVolume": "35k posts" }
      ]
    }
  ],
  "optimalPostingSchedule": {
    "primeDay": "string",
    "primeTimeWindow": "string",
    "frequencyPerWeek": "string",
    "explanation": "string"
  },
  "algorithmDirectives": [
    "string (bullet 1)",
    "string (bullet 2)",
    "string (bullet 3)",
    "string (bullet 4)"
  ]
}

Ensure viral recommendations are hyper-specific to their niche, fresh, and not generic. Provide 4 to 5 distinct viral concepts. Output pure JSON without markdown wrappers if possible, or standard \`\`\`json markdown blocks.`;
}
