// Relic weapon and tool definitions with achievement IDs
// Each relic series has a set of achievement IDs that indicate completion

export const RELIC_WEAPONS = {
  arr: {
    name: 'Zodiac Weapons',
    expansion: 'A Realm Reborn',
    abbr: 'Zodiac',
    stages: [
      { name: 'Zodiac Zeta', ids: [1081] },
      { name: 'Zodiac', ids: [1054] },
      { name: 'Nexus', ids: [1028] },
      { name: 'Novus', ids: [926] },
      { name: 'Animus', ids: [925] }
    ]
  },
  hw: {
    name: 'Anima Weapons',
    expansion: 'Heavensward',
    abbr: 'Anima',
    stages: [
      { name: 'Lux', ids: Array.from({ length: 13 }, (_, i) => 1708 + i) },
      { name: 'Complete', ids: Array.from({ length: 13 }, (_, i) => 1695 + i) },
      { name: 'Sharpened', ids: Array.from({ length: 13 }, (_, i) => 1667 + i) },
      { name: 'Reconditioned', ids: Array.from({ length: 13 }, (_, i) => 1605 + i) },
      { name: 'Hyperconductive', ids: Array.from({ length: 13 }, (_, i) => 1499 + i) },
      { name: 'Anima', ids: Array.from({ length: 13 }, (_, i) => 1406 + i) },
    ]
  },
  sb: {
    name: 'Eureka Weapons',
    expansion: 'Stormblood',
    abbr: 'Eureka',
    stages: [
      { name: 'Eureka', ids: Array.from({ length: 15 }, (_, i) => 2212 + i) },
      { name: 'Pyros', ids: Array.from({ length: 15 }, (_, i) => 2143 + i) },
      { name: 'Elemental', ids: Array.from({ length: 15 }, (_, i) => 2082 + i) },
      { name: 'Anemos', ids: Array.from({ length: 15 }, (_, i) => 2030 + i) }
    ]
  },
  shb: {
    name: 'Resistance Weapons',
    expansion: 'Shadowbringers',
    abbr: 'Resistance',
    stages: [
      { name: 'Blade\'s', ids: Array.from({ length: 17 }, (_, i) => 2857 + i) },
      { name: 'Law\'s Order', ids: Array.from({ length: 17 }, (_, i) => 2768 + i) },
      { name: 'Recollection', ids: Array.from({ length: 17 }, (_, i) => 2694 + i) },
      { name: 'Resistance', ids: Array.from({ length: 17 }, (_, i) => 2569 + i) }
    ]
  },
  ew: {
    name: 'Manderville Weapons',
    expansion: 'Endwalker',
    abbr: 'Manderville',
    stages: [
      { name: 'Mandervillous', ids: Array.from({ length: 19 }, (_, i) => 3380 + i) },
      { name: 'Majestic Manderville', ids: Array.from({ length: 19 }, (_, i) => 3285 + i) },
      { name: 'Amazing Manderville', ids: Array.from({ length: 19 }, (_, i) => 3224 + i) },
      { name: 'Manderville', ids: Array.from({ length: 19 }, (_, i) => 3128 + i) }
    ]
  },
  dt: {
    name: 'Phantom Weapons',
    expansion: 'Dawntrail',
    abbr: 'Phantom',
    stages: [
      { name: 'Obscurum', ids: Array.from({ length: 21 }, (_, i) => 3842 + i) },
      { name: 'Umbrae', ids: Array.from({ length: 21 }, (_, i) => 3752 + i) },
      { name: 'Penumbrae', ids: Array.from({ length: 21 }, (_, i) => 3638 + i) }
    ]
  }
};

export const RELIC_TOOLS = {
  lucis: {
    name: 'Lucis Tools',
    expansion: 'A Realm Reborn',
    abbr: 'Lucis',
    achievementIds: [1078, 1079],
    crafters: 1078,
    gatherers: 1079
  },
  skysteel: {
    name: 'Skysteel Tools',
    expansion: 'Shadowbringers',
    abbr: 'Skysteel',
    stages: [
      { name: 'Skybuilder', ids: Array.from({ length: 11 }, (_, i) => 2787 + i) },
      { name: 'Skysung', ids: Array.from({ length: 11 }, (_, i) => 2659 + i) }
    ]
  },
  splendorous: {
    name: 'Splendorous Tools',
    expansion: 'Endwalker',
    abbr: 'Splendorous',
    stages: [
      { name: 'Lodestar', ids: Array.from({ length: 11 }, (_, i) => 3362 + i) },
      { name: 'Brilliant', ids: Array.from({ length: 11 }, (_, i) => 3305 + i) },
      { name: 'Crystalline', ids: Array.from({ length: 11 }, (_, i) => 3193 + i) },
    ]
  },
  cosmic: {
    name: 'Cosmic Tools',
    expansion: 'Dawntrail',
    abbr: 'Cosmic',
    stages: [
      { name: 'Hyper', ids: Array.from({ length: 11 }, (_, i) => 3877 + i) },
      { name: 'Stellar', ids: Array.from({ length: 11 }, (_, i) => 3792 + i) },
      { name: 'Cosmic', ids: Array.from({ length: 11 }, (_, i) => 3691 + i) }
    ]
  }
};

// Helper function to get all achievement IDs for a relic series
function getAllAchievementIds(relicSeries) {
  // If achievementIds is explicitly defined and not empty, use it
  if (relicSeries.achievementIds && relicSeries.achievementIds.length > 0) {
    return relicSeries.achievementIds;
  }

  // Otherwise, extract from stages
  if (relicSeries.stages && relicSeries.stages.length > 0) {
    return relicSeries.stages.flatMap(stage => stage.ids || []);
  }

  return [];
}

// Helper function to check if a character has completed a relic series
export function checkRelicCompletion(characterAchievements, relicSeries) {
  const allIds = getAllAchievementIds(relicSeries);

  if (!characterAchievements || characterAchievements.length === 0) {
    return { completed: 0, total: allIds.length, percentage: 0 };
  }

  const completed = allIds.filter(id =>
    characterAchievements.includes(id)
  ).length;

  const total = allIds.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return { completed, total, percentage };
}

// Helper function to get the highest completed stage for a relic series
export function getHighestStage(characterAchievements, relicSeries) {
  if (!characterAchievements || !relicSeries.stages) {
    return null;
  }

  for (const stage of relicSeries.stages) {
    const hasAnyAchievement = stage.ids.some(id => characterAchievements.includes(id));
    if (hasAnyAchievement) {
      return stage.name;
    }
  }

  return null;
}
