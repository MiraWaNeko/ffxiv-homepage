import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { writeFileSync, readFileSync, existsSync } from 'fs';

// Cache file for achievement IDs
const CACHE_FILE = 'achievements-cache.json';
const TIME_LIMITED_FILE = 'time-limited-achievements.json';
const ACHIEVEMENT_DB_FILE = 'achievements.json';

// Load achievement database
let achievementDatabase = null;
function loadAchievementDatabase() {
  if (!achievementDatabase && existsSync(ACHIEVEMENT_DB_FILE)) {
    achievementDatabase = JSON.parse(readFileSync(ACHIEVEMENT_DB_FILE, 'utf-8'));
  }
  return achievementDatabase || {};
}

// Get achievement points from database
function getAchievementPoints(achievementId) {
  const db = loadAchievementDatabase();
  return db[achievementId]?.points || 0;
}

// Load existing cache
function loadCache() {
  if (existsSync(CACHE_FILE)) {
    try {
      return JSON.parse(readFileSync(CACHE_FILE, 'utf-8'));
    } catch (error) {
      console.log('Could not parse cache, starting fresh');
    }
  }
  return {};
}

// Load time-limited achievements
function loadTimeLimitedAchievements() {
  if (existsSync(TIME_LIMITED_FILE)) {
    try {
      const data = JSON.parse(readFileSync(TIME_LIMITED_FILE, 'utf-8'));
      const allIds = new Set();

      // Collect all time-limited IDs from all categories
      if (data.timeLimited && data.timeLimited.categories) {
        for (const category of Object.values(data.timeLimited.categories)) {
          if (category.ids && Array.isArray(category.ids)) {
            category.ids.forEach(id => allIds.add(id));
          }
        }
      }

      return allIds;
    } catch (error) {
      console.warn('Could not parse time-limited achievements file, assuming none');
    }
  }
  return new Set();
}

// Save cache
function saveCache(cache) {
  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

// Calculate base score (excluding time-limited achievements)
function calculateBaseScore(achievementIds) {
  const timeLimited = loadTimeLimitedAchievements();
  let baseScore = 0;
  let excludedCount = 0;

  for (const id of achievementIds) {
    const achievementId = parseInt(id, 10);
    const points = getAchievementPoints(achievementId);

    if (!timeLimited.has(achievementId)) {
      baseScore += points;
    } else {
      excludedCount++;
    }
  }

  return {
    baseScore,
    excludedCount
  };
}

// No longer need to fetch achievement points from Lodestone
// We now use the local achievement database

// Fetch achievement IDs from a single page
async function fetchAchievementPage(characterId, page, region = 'na') {
  const url = `https://${region}.finalfantasyxiv.com/lodestone/character/${characterId}/achievement/?page=${page}`;

  console.log(`Fetching page ${page}...`);

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  const achievementIds = [];

  $('a.entry__achievement').each((i, elem) => {
    const href = $(elem).attr('href');
    if (href) {
      // Extract ID from href like: /lodestone/character/24921505/achievement/detail/3764/
      const match = href.match(/\/achievement\/detail\/(\d+)\//);
      if (match) {
        achievementIds.push(parseInt(match[1], 10));
      }
    }
  });

  return achievementIds;
}

// Fetch all new achievements for a character
async function fetchNewAchievements(characterId, region = 'na') {
  const cache = loadCache();
  const charKey = `${characterId}-${region}`;

  if (!cache[charKey]) {
    cache[charKey] = {
      achievements: [], // Array of achievement IDs
      lastUpdated: null
    };
  }

  const existingAchievements = cache[charKey].achievements || [];
  const existingIds = new Set(existingAchievements);
  const newAchievements = [];
  let page = 1;
  let foundExisting = false;

  console.log(`Fetching achievements for character ${characterId} (${region})...`);
  console.log(`Currently have ${existingIds.size} cached achievements`);

  // Keep fetching pages until we find an achievement we've already seen
  while (!foundExisting) {
    try {
      const pageIds = await fetchAchievementPage(characterId, page, region);

      if (pageIds.length === 0) {
        // No more achievements
        console.log('No more achievements found');
        break;
      }

      for (const id of pageIds) {
        if (existingIds.has(id)) {
          foundExisting = true;
          console.log(`Found existing achievement ${id}, stopping fetch`);
          break;
        } else {
          newAchievements.push(id);
          existingIds.add(id);
        }
      }

      page++;

      // Add delay to be respectful to the server
      await new Promise(resolve => setTimeout(resolve, 1500));

    } catch (error) {
      console.error(`Error fetching page ${page}:`, error.message);
      break;
    }
  }

  console.log(`Found ${newAchievements.length} new achievements`);

  // Add new achievements to the list
  const allAchievements = [...existingAchievements, ...newAchievements];

  // Calculate scores using the achievement database
  const totalPoints = allAchievements.reduce((sum, id) => sum + getAchievementPoints(id), 0);
  const { baseScore, excludedCount } = calculateBaseScore(allAchievements);

  // Update cache
  cache[charKey].achievements = allAchievements;
  cache[charKey].lastUpdated = new Date().toISOString();
  saveCache(cache);

  return {
    total: allAchievements.length,
    newCount: newAchievements.length,
    newAchievements: newAchievements,
    totalPoints,
    baseScore,
    timeLimitedCount: excludedCount
  };
}

export { fetchNewAchievements, loadCache, calculateBaseScore };