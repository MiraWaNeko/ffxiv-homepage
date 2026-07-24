// Patch numbers for the Main Scenario Quest and Raid-clear achievements tracked
// by analyzeAchievementSetProgress() in update-characters.js / fc-update.js.
// Researched via FFXIVCollect's achievement API, cross-verified against
// ffxiv.consolegameswiki.com achievement pages and (for one discrepancy)
// Square Enix's own patch press release.

// Compares patch strings like "2.4" vs "2.55" vs "3.01" in real release order
// (each dot-separated part compared numerically, not lexicographically).
function comparePatchVersions(a, b) {
  const partsA = a.split('.').map(Number);
  const partsB = b.split('.').map(Number);
  for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
    const diff = (partsA[i] || 0) - (partsB[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

// Groups an achievement-id -> patch map into chronologically-sorted
// { patch, ids } buckets, e.g. for building a per-patch progress bar.
export function groupAchievementsByPatch(achievementPatchMap) {
  const groups = new Map();

  for (const [id, patch] of Object.entries(achievementPatchMap)) {
    if (!groups.has(patch)) groups.set(patch, []);
    groups.get(patch).push(parseInt(id, 10));
  }

  return [...groups.entries()]
    .sort(([a], [b]) => comparePatchVersions(a, b))
    .map(([patch, ids]) => ({ patch, ids }));
}

// Expansion name/abbreviation by patch major version number, for grouping
// the per-patch MSQ bar into expansion sections.
export const MSQ_EXPANSIONS = {
  2: { name: 'A Realm Reborn', abbr: 'ARR' },
  3: { name: 'Heavensward', abbr: 'HW' },
  4: { name: 'Stormblood', abbr: 'SB' },
  5: { name: 'Shadowbringers', abbr: 'ShB' },
  6: { name: 'Endwalker', abbr: 'EW' },
  7: { name: 'Dawntrail', abbr: 'DT' }
};

// Achievement groups where only ONE member is ever obtainable on a given
// character, permanently — e.g. the starting-city intro quest, which locks
// in at character creation. Without this, a character's total would be
// inflated by achievements they can never earn, leaving that patch stuck
// below 100% forever.
export const MSQ_EXCLUSIVE_GROUPS = [
  [310, 311, 312] // Leaving Limsa Lominsa / Gone from Gridania / Out of Ul'dah
];

// Once a character has earned one member of an exclusive group, the other
// members are permanently unobtainable — returns the set of ids to drop
// from that character's total.
export function getSuppressedMSQIds(characterAchievements) {
  const earned = new Set(characterAchievements.map(id => parseInt(id, 10)));
  const suppressed = new Set();

  for (const group of MSQ_EXCLUSIVE_GROUPS) {
    const earnedMember = group.find(id => earned.has(id));
    if (earnedMember !== undefined) {
      for (const id of group) {
        if (id !== earnedMember) suppressed.add(id);
      }
    }
  }

  return suppressed;
}

export const MSQ_ACHIEVEMENT_PATCHES = {
  310: '2.0',
  311: '2.0',
  312: '2.0',
  783: '2.0',
  784: '2.0',
  785: '2.0',
  786: '2.0',
  787: '2.0',
  788: '2.0',
  898: '2.2',
  899: '2.2',
  1001: '2.3',
  1029: '2.4',
  1129: '2.55',
  1133: '3.0',
  1134: '3.0',
  1135: '3.0',
  1136: '3.0',
  1137: '3.0',
  1138: '3.0',
  1139: '3.0',
  1387: '3.1',
  1493: '3.2',
  1594: '3.3',
  1630: '3.4',
  1690: '3.5',
  1691: '3.56',
  1787: '4.0',
  1788: '4.0',
  1789: '4.0',
  1790: '4.0',
  1791: '4.0',
  1792: '4.0',
  1793: '4.0',
  1794: '4.0',
  1990: '4.1',
  2013: '4.2',
  2098: '4.3',
  2124: '4.4',
  2160: '4.5',
  2233: '4.56',
  2293: '5.0',
  2294: '5.0',
  2295: '5.0',
  2296: '5.0',
  2297: '5.0',
  2298: '5.0',
  2424: '5.1',
  2587: '5.2',
  2642: '5.3',
  2714: '5.4',
  2850: '5.5',
  2851: '5.55',
  2952: '6.0',
  2953: '6.0',
  2954: '6.0',
  2955: '6.0',
  2956: '6.0',
  2957: '6.0',
  2958: '6.0',
  3075: '6.1',
  3105: '6.2',
  3157: '6.3',
  3244: '6.4',
  3413: '6.5',
  3414: '6.55',
  3491: '7.0',
  3492: '7.0',
  3493: '7.0',
  3494: '7.0',
  3495: '7.0',
  3496: '7.0',
  3607: '7.1',
  3633: '7.2',
  3773: '7.3',
  3863: '7.4',
  3942: '7.5'
};

export const RAID_ACHIEVEMENT_PATCHES = {
  747: '2.0',
  883: '2.1',
  887: '2.2',
  995: '2.3',
  997: '2.3',
  998: '2.3',
  999: '2.3',
  1000: '2.3',
  1040: '2.4',
  1068: '2.5',
  1228: '3.01',
  1231: '3.05',
  1399: '3.1',
  1476: '3.2',
  1479: '3.2',
  1574: '3.3',
  1639: '3.4',
  1642: '3.4',
  1689: '3.5',
  1895: '4.01',
  1898: '4.05',
  1992: '4.1',
  1993: '4.11',
  2024: '4.2',
  2027: '4.2',
  2106: '4.3',
  2107: '4.31',
  2118: '4.4',
  2121: '4.4',
  2164: '4.5',
  2409: '5.01',
  2412: '5.05',
  2443: '5.1',
  2444: '5.11',
  2591: '5.2',
  2594: '5.2',
  2622: '5.3',
  2719: '5.4',
  2722: '5.4',
  2847: '5.5',
  3035: '6.01',
  3038: '6.05',
  3073: '6.1',
  3074: '6.11',
  3108: '6.2',
  3111: '6.2',
  3161: '6.3',
  3162: '6.31',
  3248: '6.4',
  3251: '6.4',
  3403: '6.5',
  3572: '7.01',
  3575: '7.05',
  3606: '7.1',
  3616: '7.15',
  3617: '7.11',
  3627: '7.2',
  3630: '7.2',
  3806: '7.3',
  3865: '7.4',
  3868: '7.4',
  3980: '7.5',
  4069: '7.51'
};
