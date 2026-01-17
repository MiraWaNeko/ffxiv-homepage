// Dynamic cache busting for data.js
const characterData = await import(`./data.js?v=${Date.now()}`).then(m => m.default);

// Define max levels for jobs that aren't 100
const MAX_LEVELS = {
  // Blue Mage
  'Blue Mage': 80,

  // Phantom Jobs
  'Phantom Berserker': 3,
  'Phantom Chemist': 4,
  'Phantom Bard': 4,
  'Phantom Mystic Knight': 4,
  'Phantom Gladiator': 4,
  'Phantom Dancer': 4,
  'Phantom Samurai': 5,
  'Phantom Time Mage': 5,
  'Phantom Geomancer': 5,
  'Phantom Oracle': 5,
  'Phantom Knight': 6,
  'Phantom Monk': 6,
  'Phantom Thief': 6,
  'Phantom Ranger': 6,
  'Phantom Cannoneer': 6,
  'Phantom Freelancer': 16,
};

// Get max level for a job (defaults to 100)
function getMaxLevel(jobName) {
  return MAX_LEVELS[jobName] || 100;
}

// Define all jobs by role
const JOB_ROLES = {
  tanks: [
    { name: 'Paladin', abbr: 'PLD' },
    { name: 'Warrior', abbr: 'WAR' },
    { name: 'Dark Knight', abbr: 'DRK' },
    { name: 'Gunbreaker', abbr: 'GNB' }
  ],
  healers: [
    { name: 'White Mage', abbr: 'WHM' },
    { name: 'Scholar', abbr: 'SCH' },
    { name: 'Astrologian', abbr: 'AST' },
    { name: 'Sage', abbr: 'SGE' }
  ],
  dps: [
    { name: 'Monk', abbr: 'MNK' },
    { name: 'Dragoon', abbr: 'DRG' },
    { name: 'Ninja', abbr: 'NIN' },
    { name: 'Samurai', abbr: 'SAM' },
    { name: 'Reaper', abbr: 'RPR' },
    { name: 'Viper', abbr: 'VPR' },
    { name: 'Bard', abbr: 'BRD' },
    { name: 'Machinist', abbr: 'MCH' },
    { name: 'Dancer', abbr: 'DNC' },
    { name: 'Black Mage', abbr: 'BLM' },
    { name: 'Summoner', abbr: 'SMN' },
    { name: 'Red Mage', abbr: 'RDM' },
    { name: 'Pictomancer', abbr: 'PCT' },
    { name: 'Blue Mage', abbr: 'BLU' }
  ],
  phantom: [
    { name: 'Phantom Knight', abbr: 'Knight' },
    { name: 'Phantom Monk', abbr: 'Monk' },
    { name: 'Phantom Thief', abbr: 'Thief' },
    { name: 'Phantom Berserker', abbr: 'Berserker' },
    { name: 'Phantom Ranger', abbr: 'Ranger' },
    { name: 'Phantom Samurai', abbr: 'Samurai' },
    { name: 'Phantom Mystic Knight', abbr: 'Mystic Knight' },
    { name: 'Phantom Time Mage', abbr: 'Time Mage' },
    { name: 'Phantom Chemist', abbr: 'Chemist' },
    { name: 'Phantom Geomancer', abbr: 'Geomancer' },
    { name: 'Phantom Bard', abbr: 'Bard' },
    { name: 'Phantom Dancer', abbr: 'Dancer' },
    { name: 'Phantom Oracle', abbr: 'Oracle' },
    { name: 'Phantom Cannoneer', abbr: 'Cannoneer' },
    { name: 'Phantom Gladiator', abbr: 'Gladiator' },
    { name: 'Phantom Freelancer', abbr: 'Freelancer' }
  ],
  crafters: [
    { name: 'Carpenter', abbr: 'CRP' },
    { name: 'Blacksmith', abbr: 'BSM' },
    { name: 'Armorer', abbr: 'ARM' },
    { name: 'Goldsmith', abbr: 'GSM' },
    { name: 'Leatherworker', abbr: 'LTW' },
    { name: 'Weaver', abbr: 'WVR' },
    { name: 'Alchemist', abbr: 'ALC' },
    { name: 'Culinarian', abbr: 'CUL' }
  ],
  gatherers: [
    { name: 'Miner', abbr: 'MIN' },
    { name: 'Botanist', abbr: 'BTN' },
    { name: 'Fisher', abbr: 'FSH' }
  ]
};

function getJobLevel(jobs, jobName) {
  const job = jobs.find(j => j.name === jobName);
  return job ? job.level : 0;
}

function renderJobBadge(jobAbbr, level, maxLevel) {
  if (level === 0) {
    // Unlocked job with no level
    return `<span class="job-badge">
      <span class="job-abbr">${jobAbbr}</span>
      <span class="job-level">-</span>
    </span>`;
  } else {
    // Job with level
    const badgeClass = level === maxLevel ? 'job-badge max-level' : 'job-badge in-progress';

    return `<span class="${badgeClass}">
      <span class="job-abbr">${jobAbbr}</span>
      <span class="job-level">${level}</span>
    </span>`;
  }
}

function renderCharacterCard(character, index) {
  const { id, name, world, image, jobs, achievements, lastUpdated } = character;
  const shouldReverse = index % 2 === 1;

  // Format last updated date and time in viewer's timezone
  const lastUpdateDate = new Date(lastUpdated);
  const formattedDate = lastUpdateDate.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });

  // Combine all jobs into one array for lookup
  const allJobs = [...jobs.combat, ...jobs.crafters, ...jobs.gatherers, ...(jobs.phantom || [])];

  let jobCategoriesHTML = '';

  // Tanks
  jobCategoriesHTML += `
    <div class="job-category">
      <div class="job-category-title">Tanks</div>
      <div class="job-list">
        ${JOB_ROLES.tanks.map(job => {
          const level = getJobLevel(allJobs, job.name);
          const maxLevel = getMaxLevel(job.name);
          return renderJobBadge(job.abbr, level, maxLevel);
        }).join('')}
      </div>
    </div>
  `;

  // Healers
  jobCategoriesHTML += `
    <div class="job-category">
      <div class="job-category-title">Healers</div>
      <div class="job-list">
        ${JOB_ROLES.healers.map(job => {
          const level = getJobLevel(allJobs, job.name);
          const maxLevel = getMaxLevel(job.name);
          return renderJobBadge(job.abbr, level, maxLevel);
        }).join('')}
      </div>
    </div>
  `;

  // DPS
  jobCategoriesHTML += `
    <div class="job-category">
      <div class="job-category-title">DPS</div>
      <div class="job-list">
        ${JOB_ROLES.dps.map(job => {
          const level = getJobLevel(allJobs, job.name);
          const maxLevel = getMaxLevel(job.name);
          return renderJobBadge(job.abbr, level, maxLevel);
        }).join('')}
      </div>
    </div>
  `;

  // Crafters
  jobCategoriesHTML += `
    <div class="job-category">
      <div class="job-category-title">Crafters</div>
      <div class="job-list">
        ${JOB_ROLES.crafters.map(job => {
          const level = getJobLevel(allJobs, job.name);
          const maxLevel = getMaxLevel(job.name);
          return renderJobBadge(job.abbr, level, maxLevel);
        }).join('')}
      </div>
    </div>
  `;

  // Gatherers
  jobCategoriesHTML += `
    <div class="job-category">
      <div class="job-category-title">Gatherers</div>
      <div class="job-list">
        ${JOB_ROLES.gatherers.map(job => {
          const level = getJobLevel(allJobs, job.name);
          const maxLevel = getMaxLevel(job.name);
          return renderJobBadge(job.abbr, level, maxLevel);
        }).join('')}
      </div>
    </div>
  `;

  // Phantom Jobs (Marionette/Eureka/Bozja)
  jobCategoriesHTML += `
    <div class="job-category">
      <div class="job-category-title">Phantom Jobs</div>
      <div class="job-list">
        ${JOB_ROLES.phantom.map(job => {
          const level = getJobLevel(allJobs, job.name);
          const maxLevel = getMaxLevel(job.name);
          return renderJobBadge(job.abbr, level, maxLevel);
        }).join('')}
      </div>
    </div>
  `;

  // Build HTML based on image position
  const imageHTML = `
    <a href="https://na.finalfantasyxiv.com/lodestone/character/${id}/" target="_blank" rel="noopener" class="character-image">
      <img src="${image}" alt="${name}">
    </a>
  `;

  // Build achievements HTML for top right corner
  let achievementsHTML = '';
  if (achievements && achievements.allScore) {
    // Format achievement update time if available
    let achievementUpdateTime = '';
    if (achievements.allDate) {
      const achievementDate = new Date(achievements.allDate);
      achievementUpdateTime = achievementDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    }

    achievementsHTML = `
      <div class="achievement-badge">
        <div class="achievement-total">${achievements.allScore.toLocaleString()}</div>
        <div class="achievement-hover">
          <div class="achievement-label">Total Points</div>
          <div class="achievement-value">${achievements.allScore.toLocaleString()}</div>
          <div class="achievement-desc">All achievement points earned</div>
          <div class="achievement-label obtainable">Obtainable Points</div>
          <div class="achievement-value obtainable">${achievements.baseScore.toLocaleString()}</div>
          <div class="achievement-desc">Points from non-time-limited achievements</div>
          ${achievementUpdateTime ? `<div class="achievement-updated">Updated: ${achievementUpdateTime}</div>` : ''}
        </div>
      </div>
    `;
  }

  const infoHTML = `
    <div class="character-info">
      <h2 class="character-name">${name}</h2>
      <p class="character-world">${world}</p>
      <div class="job-categories">
        ${jobCategoriesHTML}
      </div>
      <div class="last-updated">Last updated: ${formattedDate}</div>
    </div>
  `;

  return `
    <div class="character-card${shouldReverse ? ' reverse' : ''}">
      ${achievementsHTML}
      ${imageHTML}
      ${infoHTML}
    </div>
  `;
}

function renderAllCharacters() {
  const container = document.querySelector('.characters-grid');

  if (!container) {
    console.error('Characters grid container not found');
    return;
  }

  const html = characterData.map((char, index) => renderCharacterCard(char, index)).join('');
  container.innerHTML = html;
}

// Render when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderAllCharacters);
} else {
  renderAllCharacters();
}
