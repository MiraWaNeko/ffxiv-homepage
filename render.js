// Dynamic cache busting for data.js
const characterData = await import(`./data.js?v=${Date.now()}`).then(m => m.default);

// Import configuration
import CONFIG from './config.js';

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
    <a href="https://${CONFIG.lodestone.region}.finalfantasyxiv.com/lodestone/character/${id}/" target="_blank" rel="noopener" class="character-image">
      <img src="${image}" alt="${name}">
    </a>
  `;

  // Build achievements HTML for top right corner
  let achievementsHTML = '';
  if (achievements && achievements.allScore) {
    const baseScoreHTML = achievements.baseScore
      ? `
          <div class="achievement-label obtainable">Obtainable Points</div>
          <div class="achievement-value obtainable">${achievements.baseScore.toLocaleString()}</div>
          <div class="achievement-desc">Points from non-time-limited achievements</div>
        `
      : '';

    achievementsHTML = `
      <div class="achievement-badge">
        <div class="achievement-total">${achievements.allScore.toLocaleString()}</div>
        <div class="achievement-hover">
          <div class="achievement-label">Total Points</div>
          <div class="achievement-value">${achievements.allScore.toLocaleString()}</div>
          <div class="achievement-desc">All achievement points earned</div>
          ${baseScoreHTML}
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

function renderSocialLinks() {
  const section = document.getElementById('social-links-section');

  if (!section) {
    console.error('Social links section not found');
    return;
  }

  // If no social links configured, hide the section
  if (!CONFIG.socialLinks || CONFIG.socialLinks.length === 0) {
    section.style.display = 'none';
    return;
  }

  // SVG icons for different platforms
  const icons = {
    twitter: `<svg viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>`,
    bluesky: `<svg viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 0 1-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8Z"/>
    </svg>`
  };

  // Generate links HTML
  const linksHTML = CONFIG.socialLinks.map(link => {
    const icon = icons[link.platform] || '';
    return `
      <a href="${link.url}" target="_blank" rel="noopener noreferrer" class="social-link ${link.platform}">
        ${icon}
        ${link.label}
      </a>
    `;
  }).join('');

  section.innerHTML = `
    <h2>Find Me Online</h2>
    <div class="links">
      ${linksHTML}
    </div>
  `;
}

// Render when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    renderAllCharacters();
    renderSocialLinks();
  });
} else {
  renderAllCharacters();
  renderSocialLinks();
}
