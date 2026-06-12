// ============================================================================
// FFXIV Homepage Configuration
// ============================================================================
// This is the main configuration file for your FFXIV character homepage.
// When forking this repository, this is the primary file you need to customize.
// ============================================================================

const CONFIG = {
  // ==========================================================================
  // SITE INFORMATION
  // ==========================================================================
  site: {
    // The title shown in the browser tab
    title: 'Mira wa Neko - FFXIV Characters',

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
  characters: ['24921505', '24387385'], // Add more character IDs as needed

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
    {
      platform: 'twitter',
      url: 'https://twitter.com/mirawaneko_ffxiv',
      label: 'Twitter'
    },
    {
      platform: 'bluesky',
      url: 'https://bsky.app/profile/ffxiv.mirawaneko.net',
      label: 'Bluesky'
    }
    // Examples of other supported platforms:
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
  // GITHUB PAGES SETTINGS
  // ==========================================================================
  deployment: {
    // Custom domain for GitHub Pages (set to null if not using a custom domain)
    // This will be used to create the CNAME file during deployment
    customDomain: 'ffxiv.mirawaneko.net',
  },
};

// Export for ES6 modules
export default CONFIG;
