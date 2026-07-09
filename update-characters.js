import { writeFileSync, readFileSync, existsSync } from 'fs';
import { setTimeout as setTimeoutAsync } from 'timers/promises';

import * as cheerio from 'cheerio';
import fetch from 'node-fetch';

import CONFIG from './config.js';
import { fetchNewAchievements, loadCache } from './fetch-achievements.js';
import { RELIC_WEAPONS, RELIC_TOOLS, checkRelicStageCompletion, getHighestStage, getBiggestStage } from './relic-definitions.js';

const CHARACTERS = CONFIG.characters;

async function fetchCharacterData(characterId, existingData = null) {
  const url = `https://${CONFIG.lodestone.region}.finalfantasyxiv.com/lodestone/character/${characterId}/`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`[CHARACTER] HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Extract character name, world, and image
    const name = $('.frame__chara__name').text().trim();
    const world = $('.frame__chara__world').text().trim();
    let image = $('.js__image_popup').attr('href').trim();

    if (image) {
      // Remove query parameters from image URL to get a cleaner link
      image = image.split('?')[0];
    }

    const characterData = {
      id: characterId,
      name,
      world,
      image
    };

    if (existingData) {
      if (name !== existingData.name || world !== existingData.world) {
        console.log(`[CHARACTER] Name or world changed: ${existingData.name} (${existingData.world}) -> ${name} (${world})`);
      }
    } else {
      console.log(`[CHARACTER] New character detected: ${characterData.name} (${characterData.world})`);
    }

    return {
      ...characterData,
      jobs: await fetchCharacterJobs(characterData),
      achievements: await fetchAchievementData(characterData)
    };
  } catch (error) {
    console.error(`[CHARACTER] Error fetching character ${existingData ? `${existingData.name} (${existingData.world})` : characterId}:`, error);
    return null;
  }
}

async function fetchCharacterJobs(characterData) {
  const url = `https://${CONFIG.lodestone.region}.finalfantasyxiv.com/lodestone/character/${characterData.id}/class_job/`;

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`[JOBS] HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const jobs = {
      combat: [],
      crafters: [],
      gatherers: [],
      phantom: []
    };

    // Map to track which jobs we've seen (to avoid duplicates)
    const seenJobs = new Set();

    // Parse regular job elements (combat, crafters, gatherers)
    $('li[class*="character__job"], ul[class*="character__job"] li, .character-block__box li').each((i, elem) => {
      const $elem = $(elem);

      // Try multiple ways to get job name
      let jobName = $elem.find('.character__job__name').text().trim();
      if (!jobName) {
        jobName = $elem.find('[class*="name"]').first().text().trim();
      }
      if (!jobName) {
        // Try getting all text and parsing it
        const allText = $elem.text().trim();
        // Try to extract job name from text
        const lines = allText.split('\n').map(l => l.trim()).filter(l => l);
        if (lines.length > 0) {
          jobName = lines[0];
        }
      }

      // Get level - try multiple selectors
      let level = 0;
      let levelText = $elem.find('.character__job__level, [class*="level"]').text().trim();

      if (!levelText) {
        // Try to find level in all text
        const allText = $elem.text();
        const match = allText.match(/(\d+)/);
        if (match) {
          level = parseInt(match[1]);
        }
      } else {
        // Extract numeric value from level text
        const match = levelText.match(/\d+/);
        if (match) {
          level = parseInt(match[0]);
        }
      }

      // Include ALL jobs, even level 0 (unleveled jobs)
      if (jobName && jobName.length > 1) {
        // Skip if we've already added this job
        if (seenJobs.has(jobName)) {
          return;
        }
        seenJobs.add(jobName);

        const jobLower = jobName.toLowerCase();

        // Categorize job by type
        if (['carpenter', 'blacksmith', 'armorer', 'goldsmith', 'leatherworker', 'weaver', 'alchemist', 'culinarian'].includes(jobLower)) {
          jobs.crafters.push({ name: jobName, level, abbr: getJobAbbr(jobName) });
        } else if (['miner', 'botanist', 'fisher'].includes(jobLower)) {
          jobs.gatherers.push({ name: jobName, level, abbr: getJobAbbr(jobName) });
        } else {
          jobs.combat.push({ name: jobName, level, abbr: getJobAbbr(jobName) });
        }
      }
    });

    // Parse Phantom Jobs separately (they have a different HTML structure)
    $('.character__support_job__name').each((i, elem) => {
      const $elem = $(elem);
      const jobName = $elem.text().trim();

      // Get the level from the next sibling element
      const $levelElem = $elem.next('.character__support_job__level');
      let level = 0;

      if ($levelElem.length > 0) {
        const levelText = $levelElem.text().trim();
        // Parse "Lv. X" format
        const match = levelText.match(/Lv\.\s*(\d+)/i);
        if (match) {
          level = parseInt(match[1]);
        }
      }

      // Add phantom job if we found a valid name
      if (jobName && jobName.length > 1 && jobName.toLowerCase().startsWith('phantom')) {
        if (!seenJobs.has(jobName)) {
          seenJobs.add(jobName);
          jobs.phantom.push({ name: jobName, level, abbr: getJobAbbr(jobName) });
        }
      }
    });

    console.log(`[JOBS] Found ${jobs.combat.length} combat, ${jobs.crafters.length} crafter, ${jobs.gatherers.length} gatherer, ${jobs.phantom.length} phantom jobs`);

    // Sort by level descending
    jobs.combat.sort((a, b) => b.level - a.level);
    jobs.crafters.sort((a, b) => b.level - a.level);
    jobs.gatherers.sort((a, b) => b.level - a.level);
    jobs.phantom.sort((a, b) => b.level - a.level);

    return jobs;
  } catch (error) {
    console.error(`[JOBS] Error fetching jobs for character ${characterData.name} (${characterData.world}):`, error);
    return null;
  }
}

function getJobAbbr(jobName) {
  // For Phantom Jobs, just remove the "Phantom " prefix
  if (jobName.startsWith('Phantom ')) {
    return jobName.replace('Phantom ', '');
  }

  const abbrs = {
    // Tanks
    'Paladin': 'PLD',
    'Warrior': 'WAR',
    'Dark Knight': 'DRK',
    'Gunbreaker': 'GNB',
    'Gladiator': 'GLA',
    'Marauder': 'MRD',

    // Healers
    'White Mage': 'WHM',
    'Scholar': 'SCH',
    'Astrologian': 'AST',
    'Sage': 'SGE',
    'Conjurer': 'CNJ',

    // Melee DPS
    'Monk': 'MNK',
    'Dragoon': 'DRG',
    'Ninja': 'NIN',
    'Samurai': 'SAM',
    'Reaper': 'RPR',
    'Viper': 'VPR',
    'Pugilist': 'PGL',
    'Lancer': 'LNC',
    'Rogue': 'ROG',
    'Beastmaster': 'BST',

    // Ranged Physical DPS
    'Bard': 'BRD',
    'Machinist': 'MCH',
    'Dancer': 'DNC',
    'Archer': 'ARC',

    // Ranged Magical DPS
    'Black Mage': 'BLM',
    'Summoner': 'SMN',
    'Red Mage': 'RDM',
    'Pictomancer': 'PCT',
    'Blue Mage': 'BLU',
    'Thaumaturge': 'THM',
    'Arcanist': 'ACN',

    // Crafters
    'Carpenter': 'CRP',
    'Blacksmith': 'BSM',
    'Armorer': 'ARM',
    'Goldsmith': 'GSM',
    'Leatherworker': 'LTW',
    'Weaver': 'WVR',
    'Alchemist': 'ALC',
    'Culinarian': 'CUL',

    // Gatherers
    'Miner': 'MIN',
    'Botanist': 'BTN',
    'Fisher': 'FSH'
  };

  return abbrs[jobName] || jobName.substring(0, 3).toUpperCase();
}

// Map base classes to their jobs for consolidation
function getJobEquivalent(className) {
  const classToJob = {
    'Gladiator': 'Paladin',
    'Marauder': 'Warrior',
    'Pugilist': 'Monk',
    'Lancer': 'Dragoon',
    'Rogue': 'Ninja',
    'Archer': 'Bard',
    'Thaumaturge': 'Black Mage',
    'Arcanist': 'Summoner', // Note: Arcanist can also become Scholar
    'Conjurer': 'White Mage'
  };

  return classToJob[className] || className;
}

function analyzeRelicProgress(characterAchievements) {
  const relics = {
    weapons: {},
    tools: {}
  };

  // Analyze weapon relics
  for (const [key, relic] of Object.entries(RELIC_WEAPONS)) {
    const highestStage = getHighestStage(characterAchievements, relic);
    let hasProgress = false;
    const stages = (relic.stages || []).map((stage, index) => {
      const stageCompletion = checkRelicStageCompletion(characterAchievements, relic, index);
      if (stageCompletion.completed > 0) {
        hasProgress = true;
      }
      return {
        index,
        name: stage.name,
        completed: stageCompletion.completed,
        total: stageCompletion.total,
        percentage: stageCompletion.percentage
      };
    });
    const biggestStage = getBiggestStage(characterAchievements, relic);
    const completion = checkRelicStageCompletion(characterAchievements, relic, stages.find((stage) => stage.name === biggestStage)?.index || 0);

    relics.weapons[key] = {
      name: relic.name,
      abbr: relic.abbr,
      expansion: relic.expansion,
      completed: completion.completed,
      total: completion.total,
      percentage: completion.percentage,
      highestStage: highestStage,
      stages: stages,
      inProgress: hasProgress,
      isComplete: completion.percentage === 100
    };
  }

  // Analyze tool relics
  for (const [key, relic] of Object.entries(RELIC_TOOLS)) {
    const highestStage = getHighestStage(characterAchievements, relic);
    let hasProgress = false;
    const stages = (relic.stages || []).map((stage, index) => {
      const stageCompletion = checkRelicStageCompletion(characterAchievements, relic, index);
      if (stageCompletion.completed > 0) {
        hasProgress = true;
      }
      return {
        index,
        name: stage.name,
        completed: stageCompletion.completed,
        total: stageCompletion.total,
        percentage: stageCompletion.percentage
      };
    });
    const biggestStage = getBiggestStage(characterAchievements, relic);
    const completion = checkRelicStageCompletion(characterAchievements, relic, stages.find((stage) => stage.name === biggestStage)?.index || 0);

    relics.tools[key] = {
      name: relic.name,
      abbr: relic.abbr,
      expansion: relic.expansion,
      completed: completion.completed,
      total: completion.total,
      percentage: completion.percentage,
      stages: stages,
      highestStage: highestStage,
      inProgress: hasProgress,
      isComplete: completion.percentage === 100
    };
  }

  return relics;
}

async function fetchAchievementData(characterData) {
  try {
    const result = await fetchNewAchievements(characterData.id, CONFIG.lodestone.region);

    if (result && result.total > 0) {
      console.log(`[ACHIEVEMENTS] ✓ Achievement points fetched: ${result.totalPoints} (${result.total} achievements)`);

      // Load full achievement cache to analyze relics
      const cache = loadCache();
      const charKey = `${characterData.id}-${CONFIG.lodestone.region}`;
      const characterAchievements = cache[charKey]?.achievements || [];

      // Analyze relic progress
      const relics = analyzeRelicProgress(characterAchievements);

      // Achievement IDs are stored in achievements-cache.json
      // We store scores and relic progress in data.js
      return {
        allScore: result.totalPoints,
        baseScore: result.baseScore,
        relics: relics,
        firstEarnedAt: result.firstEarnedAt,
        latestEarnedAt: result.latestEarnedAt
      };
    }

    console.log(`[ACHIEVEMENTS] No achievement data found`);
    return null;
  } catch (error) {
    console.error(`[ACHIEVEMENTS] Error fetching achievements:`, error);
    return null;
  }
}

function loadExistingData() {
  if (existsSync('data.js')) {
    try {
      const fileContent = readFileSync('data.js', 'utf-8');
      // Extract the JSON from the file
      const match = fileContent.match(/const characterData = (\[[\s\S]*?\]);/);
      if (match) {
        return JSON.parse(match[1]);
      }
    } catch (error) {
      console.log('Could not parse existing data.js, will treat as new data');
    }
  }
  return [];
}

function hasDataChanged(oldChar, newChar) {
  // Compare everything except lastUpdated
  const oldData = { ...oldChar };
  const newData = { ...newChar };
  delete oldData.lastUpdated;
  delete newData.lastUpdated;

  return JSON.stringify(oldData) !== JSON.stringify(newData);
}

function recalculateAchievements(characterId) {
  const cache = loadCache();
  const charKey = `${characterId}-${CONFIG.lodestone.region}`;
  const charCache = cache[charKey];

  if (!charCache?.achievements?.length) {
    return null;
  }

  const relics = analyzeRelicProgress(charCache.achievements);

  const achievementDates = charCache.achievementDates || {};
  const earnedDates = charCache.achievements.map(id => achievementDates[id]).filter(Boolean);
  const firstEarnedAt = earnedDates.length ? earnedDates.reduce((a, b) => (a < b ? a : b)) : null;
  const latestEarnedAt = earnedDates.length ? earnedDates.reduce((a, b) => (a > b ? a : b)) : null;

  return {
    allScore: charCache.totalPoints || 0,
    baseScore: charCache.baseScore || 0,
    relics: relics,
    firstEarnedAt,
    latestEarnedAt
  };
}

async function updateAllCharacters() {
  const localOnly = process.argv.includes('--local');
  const existingData = loadExistingData();
  const updatedCharacters = [];

  if (localOnly) {
    console.log('Running in local mode — recalculating from cached data...');

    for (const char of CHARACTERS) {
      const existingChar = existingData.find(c => c.id === char.id);
      if (!existingChar) {
        console.log(`No existing data for ${char.name}, skipping (run without --local first)`);
        continue;
      }

      console.log(`Recalculating achievements for ${char.name}...`);
      const achievements = recalculateAchievements(char.id);

      const newCharData = {
        ...existingChar,
        achievements: achievements || existingChar.achievements
      };

      if (hasDataChanged(existingChar, newCharData)) {
        newCharData.lastUpdated = new Date().toISOString();
        console.log(`Data changed for ${char.name}, updating timestamp`);
      } else {
        console.log(`No changes detected for ${char.name}, keeping existing timestamp`);
      }

      updatedCharacters.push(newCharData);
    }
  } else {
    console.log('Fetching character data from Lodestone...');
    console.log('');

    for (const charId of CHARACTERS) {
      // Find existing character data by ID
      const existingCharData = existingData.find(c => c.id === charId);

      if (existingCharData) {
        console.log(`==== Fetching data for ${existingCharData.name} (${existingCharData.world}) ====`);
      } else {
        console.log(`==== Fetching data for new character ID ${charId} ====`);
      }

      const characterData = await fetchCharacterData(charId, existingCharData);
      if (characterData) {
        const jobs = characterData.jobs;
        const achievements = characterData.achievements;

        const newCharData = {
          id: charId,
          name: characterData.name,
          world: characterData.world,
          image: characterData.image,
          jobs,
          achievements
        };

        // Only update timestamp if data has changed
        if (existingCharData && !hasDataChanged(existingCharData, newCharData)) {
          newCharData.lastUpdated = existingCharData.lastUpdated;
          console.log(`No changes detected for ${characterData.name}, keeping existing timestamp`);
        } else {
          newCharData.lastUpdated = new Date().toISOString();
          console.log(`Data changed for ${characterData.name}, updating timestamp`);
        }

        updatedCharacters.push(newCharData);
      }

      console.log('');

      // Add delay to be respectful to the server
      await setTimeoutAsync(2000);
    }
  }

  const output = `// Auto-generated by update-characters.js

const characterData = ${JSON.stringify(updatedCharacters, null, 2)};

export default characterData;
`;

  writeFileSync('data.js', output);
  console.log('Character data updated successfully!');
}

updateAllCharacters().catch(console.error);
