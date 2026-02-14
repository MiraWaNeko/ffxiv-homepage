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
  //
  // To get the character image URL:
  // 1. Visit your character's Lodestone page
  // 2. Right-click on the character portrait
  // 3. Select "Copy Image Address"
  // ==========================================================================
  characters: [
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
  ],

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
