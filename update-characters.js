import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { writeFileSync } from 'fs';

const CHARACTERS = [
  {
    id: '24921505',
    name: 'Mira Wa\'neko',
    world: 'Diabolos [Crystal]',
    image: 'https://img2.finalfantasyxiv.com/f/7c13a0269a6d7953946aff5be6ecff69_7b33d33ae3ecb996f778a5f67a6a0af6fl0.jpg?1768586024'
  },
  {
    id: '24387385',
    name: 'Mira Wa\'neko',
    world: 'Zodiark [Light]',
    image: 'https://img2.finalfantasyxiv.com/f/e5de5126497a6bf816908d12fdb2e908_c274370774c6bc3483cc8740805f41bcfl0.jpg?1768583610'
  }
];

async function fetchCharacterJobs(characterId) {
  const url = `https://na.finalfantasyxiv.com/lodestone/character/${characterId}/class_job/`;

  try {
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

    console.log(`Found ${jobs.combat.length} combat, ${jobs.crafters.length} crafter, ${jobs.gatherers.length} gatherer, ${jobs.phantom.length} phantom jobs for character ${characterId}`);

    // Sort by level descending
    jobs.combat.sort((a, b) => b.level - a.level);
    jobs.crafters.sort((a, b) => b.level - a.level);
    jobs.gatherers.sort((a, b) => b.level - a.level);
    jobs.phantom.sort((a, b) => b.level - a.level);

    return jobs;
  } catch (error) {
    console.error(`Error fetching character ${characterId}:`, error);
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

async function fetchAchievementPoints(characterId) {
  const url = `https://lalachievements.com/api/charcache/${characterId}`;

  try {
    console.log(`Fetching achievement data for character ${characterId}...`);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.scores && Array.isArray(data.scores)) {
      const achievementScore = data.scores.find(score => score.type === 'achievements');

      if (achievementScore) {
        return {
          allScore: achievementScore.allScore || 0,
          baseScore: achievementScore.baseScore || 0,
          allDate: achievementScore.allDate || null,
          baseDate: achievementScore.baseDate || null
        };
      }
    }

    console.log(`No achievement data found for character ${characterId}`);
    return null;
  } catch (error) {
    console.error(`Error fetching achievements for character ${characterId}:`, error);
    return null;
  }
}

async function updateAllCharacters() {
  console.log('Fetching character data from Lodestone...');

  const updatedCharacters = [];

  for (const char of CHARACTERS) {
    console.log(`Fetching data for ${char.name} (${char.world})...`);
    const jobs = await fetchCharacterJobs(char.id);
    const achievements = await fetchAchievementPoints(char.id);

    if (jobs) {
      updatedCharacters.push({
        ...char,
        jobs,
        achievements,
        lastUpdated: new Date().toISOString()
      });
    }

    // Add delay to be respectful to the server
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  const output = `// Auto-generated by update-characters.js
// Last updated: ${new Date().toISOString()}

const characterData = ${JSON.stringify(updatedCharacters, null, 2)};

export default characterData;
`;

  writeFileSync('data.js', output);
  console.log('Character data updated successfully!');
}

updateAllCharacters().catch(console.error);
