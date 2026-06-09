export const questions = [
  {
    q: "What's your ideal Friday night?",
    opts: [
      "Cozy dinner & great conversation",
      "Adventure & trying something new",
      "Movie night with snacks",
      "Exploring a new neighborhood",
    ],
  },
  {
    q: "Which quality matters most to you?",
    opts: [
      "Genuine kindness",
      "Sharp wit & humor",
      "Curious intellect",
      "Warm-hearted soul",
    ],
  },
  {
    q: "How adventurous are you?",
    opts: [
      "Very - I crave new experiences",
      "Moderately - with the right person",
      "Selectively adventurous",
      "Open to it with good company",
    ],
  },
  {
    q: "How much do you enjoy good conversations?",
    opts: [
      "It's everything",
      "Hours pass without me noticing",
      "Definitely my highlight",
      "More than almost anything",
    ],
  },
  {
    q: "If someone built an entire website just for you, you'd think...",
    opts: [
      "That's wildly impressive",
      "Okay, I'm genuinely intrigued",
      "Absolutely charming of them",
      "They must really like me",
    ],
  },
  {
    q: "Pick your favorite date activity",
    opts: [
      "Dinner at a great restaurant",
      "Walking & exploring somewhere new",
      "Museum or gallery visit",
      "Something fun or creative",
    ],
  },
  {
    q: "Favorite type of cuisine?",
    opts: [
      "Italian - pasta, always",
      "Japanese - clean & elegant",
      "Mexican - vibrant & bold",
      "I love exploring new cuisines",
    ],
  },
  {
    q: "Choose your preferred vibe",
    opts: [
      "Warm & cozy",
      "Exciting & spontaneous",
      "Elegant & refined",
      "Fun & laid-back",
    ],
  },
];

export const processingMessages = [
  "Analyzing responses...",
  "Calculating compatibility...",
  "Evaluating conversation potential...",
  "Reviewing personality metrics...",
  "Finalizing assessment...",
];

export const metrics = [
  { label: "Humor Compatibility", score: 97.3 },
  { label: "Conversation Compatibility", score: 99.1 },
  { label: "Adventure Compatibility", score: 96.8 },
  { label: "Food Compatibility", score: 98.4 },
  { label: "Overall Date Potential", score: 98.7 },
];

const scoringProfiles = [
  [
    { conversation: 6, warmth: 7, food: 4 },
    { adventure: 8, humor: 4 },
    { warmth: 6, humor: 4 },
    { adventure: 6, conversation: 4 },
  ],
  [
    { warmth: 8, conversation: 3 },
    { humor: 8, conversation: 3 },
    { conversation: 7, adventure: 3 },
    { warmth: 7, humor: 3 },
  ],
  [
    { adventure: 9, humor: 2 },
    { adventure: 6, warmth: 3 },
    { adventure: 4, conversation: 4 },
    { adventure: 5, warmth: 4 },
  ],
  [
    { conversation: 9, warmth: 3 },
    { conversation: 8, humor: 3 },
    { conversation: 7, adventure: 2 },
    { conversation: 7, warmth: 4 },
  ],
  [
    { humor: 7, warmth: 5 },
    { conversation: 5, humor: 5 },
    { warmth: 7, humor: 4 },
    { warmth: 8, conversation: 3 },
  ],
  [
    { food: 7, warmth: 3 },
    { adventure: 6, conversation: 4 },
    { conversation: 5, adventure: 4 },
    { humor: 6, adventure: 3 },
  ],
  [
    { food: 8, warmth: 3 },
    { food: 6, conversation: 4 },
    { food: 7, adventure: 4 },
    { food: 6, adventure: 6 },
  ],
  [
    { warmth: 7, food: 3 },
    { adventure: 7, humor: 3 },
    { conversation: 6, food: 4 },
    { humor: 5, warmth: 4 },
  ],
];

const metricMap = [
  { label: "Humor Compatibility", key: "humor" },
  { label: "Conversation Compatibility", key: "conversation" },
  { label: "Adventure Compatibility", key: "adventure" },
  { label: "Food Compatibility", key: "food" },
  { label: "Warmth Compatibility", key: "warmth" },
];

function clampScore(score) {
  return Math.max(92.4, Math.min(99.8, Number(score.toFixed(1))));
}

export function getAssessmentResults(answers = []) {
  const traits = {
    humor: 0,
    conversation: 0,
    adventure: 0,
    food: 0,
    warmth: 0,
  };

  answers.forEach((answer, questionIndex) => {
    const optionIndex = questions[questionIndex]?.opts.indexOf(answer) ?? -1;
    const profile = scoringProfiles[questionIndex]?.[optionIndex] || {};

    Object.entries(profile).forEach(([key, value]) => {
      traits[key] += value;
    });
  });

  const totalSignal = Object.values(traits).reduce((sum, value) => sum + value, 0) || 1;
  const resultMetrics = metricMap.map(({ label, key }, index) => {
    const share = traits[key] / totalSignal;
    const base = 94.2 + share * 22 + index * 0.21;
    return { label, score: clampScore(base) };
  });
  const overall = clampScore(resultMetrics.reduce((sum, metric) => sum + metric.score, 0) / resultMetrics.length + 0.8);
  const strongestTrait = Object.entries(traits).sort((a, b) => b[1] - a[1])[0]?.[0] || "conversation";
  const traitLabels = {
    humor: "playful chemistry",
    conversation: "conversation depth",
    adventure: "shared adventure",
    food: "food-date alignment",
    warmth: "warm romantic energy",
  };

  return {
    metrics: [...resultMetrics, { label: "Overall Date Potential", score: overall }],
    overall,
    summary: `Your answers point strongest toward ${traitLabels[strongestTrait]}, with enough overlap to justify moving directly to date planning.`,
  };
}
