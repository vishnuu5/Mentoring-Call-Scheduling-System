

const CALL_TYPE_KEYWORDS = {
  'Resume Revamp': {
    keywords: ['big tech', 'tech company', 'senior developer', 'experienced'],
    negativeKeywords: []
  },
  'Job Market Guidance': {
    keywords: ['good communication', 'communication', 'guidance'],
    negativeKeywords: []
  },
  'Mock Interview - Tech': {
    keywords: ['same domain', 'domain expert', 'technical'],
    negativeKeywords: []
  },
  'Mock Interview - Behavioral': {
    keywords: ['good communication', 'communication'],
    negativeKeywords: []
  },
  'Career Guidance': {
    keywords: ['experience', 'mentor', 'guidance'],
    negativeKeywords: []
  }
};

export const calculateRelevanceScore = (mentorData, userData, callType) => {
  let score = 0;
  const maxScore = 100;

  const mentorTags = (mentorData.tags || []).map(t => t.toLowerCase());
  const mentorDesc = (mentorData.description || '').toLowerCase();
  const userTags = (userData.tags || []).map(t => t.toLowerCase());
  const userDesc = (userData.description || '').toLowerCase();

  const callTypeConfig = CALL_TYPE_KEYWORDS[callType] || { keywords: [], negativeKeywords: [] };
  callTypeConfig.keywords.forEach(keyword => {
    if (mentorTags.some(tag => tag.includes(keyword.toLowerCase()))) {
      score += 25;
    }
    if (mentorDesc.includes(keyword.toLowerCase())) {
      score += 15;
    }
  });
  callTypeConfig.negativeKeywords.forEach(keyword => {
    if (mentorTags.some(tag => tag.includes(keyword.toLowerCase()))) {
      score -= 10;
    }
  });

  if (callType === 'Resume Revamp') {
    if (mentorTags.includes('senior developer') || mentorTags.includes('big tech')) {
      score += 20;
    }
  } else if (callType === 'Mock Interview - Tech') {
    const userDomain = userDesc.split(/\s+/)[0];
    if (mentorDesc.toLowerCase().includes(userDomain.toLowerCase())) {
      score += 30;
    }
  }

  return Math.min(score, maxScore);
};

export const rankMentors = (mentors, userData, callType) => {
  const ranked = mentors.map(mentor => ({
    ...mentor,
    relevanceScore: calculateRelevanceScore(mentor, userData, callType)
  }));

  return ranked.sort((a, b) => b.relevanceScore - a.relevanceScore);
};

export const getTopRecommendations = (mentors, userData, callType, limit = 5) => {
  const ranked = rankMentors(mentors, userData, callType);
  return ranked.slice(0, limit);
};
