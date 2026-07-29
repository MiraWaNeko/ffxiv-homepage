// ============================================================================
// FFXIV Homepage Configuration
// ============================================================================
// This is the main configuration file for your FFXIV character homepage.
// When forking this repository, this is the primary file you need to customize.
//
// Copy this file to config.js and fill in your own values.
// ============================================================================

const CONFIG = {
  // ==========================================================================
  // SITE INFORMATION
  // ==========================================================================
  site: {
    // The title shown in the browser tab
    title: 'Your Name - FFXIV Characters',

    // The main header displayed on the page
    header: 'FFXIV Characters',
  },

  // ==========================================================================
  // CHARACTER INFORMATION
  // ==========================================================================
  // Add your FFXIV characters here. You can find character IDs in the Lodestone URL.
  // Example: https://na.finalfantasyxiv.com/lodestone/character/24921505/
  //          The character ID is: 24921505
  // ==========================================================================
  characters: ['24921505'], // Add more character IDs as needed

  // ==========================================================================
  // LODESTONE SETTINGS
  // ==========================================================================
  lodestone: {
    // The Lodestone region for your characters
    // Options: 'na' (North America), 'eu' (Europe), 'jp' (Japan), 'fr' (France), 'de' (Germany)
    region: 'na',
  },

  // ==========================================================================
  // SOCIAL MEDIA LINKS
  // ==========================================================================
  // Add your social media links here. Set to null or empty array if you don't want social links.
  // Supported platforms: twitter, bluesky, youtube, twitch, tiktok
  // ==========================================================================
  socialLinks: [
    // {
    //   platform: 'twitter',
    //   url: 'https://twitter.com/your-username',
    //   label: 'Twitter'
    // },
    // {
    //   platform: 'bluesky',
    //   url: 'https://bsky.app/profile/your-handle',
    //   label: 'Bluesky'
    // },
    // {
    //   platform: 'youtube',
    //   url: 'https://youtube.com/@your-channel',
    //   label: 'YouTube'
    // },
    // {
    //   platform: 'twitch',
    //   url: 'https://twitch.tv/your-username',
    //   label: 'Twitch'
    // },
    // {
    //   platform: 'tiktok',
    //   url: 'https://tiktok.com/@your-username',
    //   label: 'TikTok'
    // }
  ],

  // ==========================================================================
  // DISPLAY SETTINGS
  // ==========================================================================
  display: {
    // Hide the "Occult Crescent" section for characters with no Knowledge
    // Level and no Phantom Job progress, instead of showing it empty.
    hideEmptyOccultCrescent: true,

    // Show the "Main Scenario Quest" progress bar for characters
    showMSQProgress: true,

    // Show the "Mapping the Realm" progress bar for characters
    showExplorationProgress: true,

    // Show the "Relic Weapon" progress bar for characters
    showRelicProgress: true,

    // Hide the "Relic Weapon" section for weapons that have no progress, instead of showing it empty.
    hideEmptyRelics: true,

    // Show "Disciples of War and Magic" and "Disciples of the Hand and Land"
    // Only works for combat jobs if combineTanksHealersDPS is true.
    useDisciplesTitles: true,

    // Show Tanks, Healers, and DPS as one combined "Combat Jobs" section
    // (split by dividers) instead of three separate categories.
    combineTanksHealersDPS: true,

    // Show Crafters and Gatherers as one combined "Crafters & Gatherers"
    // section (split by a divider) instead of two separate categories.
    combineCraftersAndGatherers: true,

    // Hide jobs that are not unlocked for the character, instead of showing them empty.
    hideNotUnlockedJobs: true,
  },

  // ==========================================================================
  // GITHUB PAGES SETTINGS
  // ==========================================================================
  deployment: {
    // Custom domain for GitHub Pages (set to null if not using a custom domain)
    // This will be used to create the CNAME file during deployment
    customDomain: null,
  },
};

// Export for ES6 modules
export default CONFIG;
