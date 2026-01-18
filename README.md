# FFXIV Character Portfolio

An automatically-updating portfolio page showcasing your FFXIV characters with job levels fetched directly from the Lodestone.

## Features

- **Automatic Lodestone Sync**: Fetches character data directly from FFXIV Lodestone
- **Achievement Points Tracking**: Displays total achievement points from the Lodestone
- **Complete Job Coverage**: All combat jobs, crafters, gatherers, and Phantom Jobs
- **Phantom Jobs Support**: Full support for all 15 Island Sanctuary Phantom Jobs
- **FFXIV-themed Design**: Elegant dark fantasy aesthetic with gold accents matching the game's UI
- **Responsive Layout**: Works beautifully on desktop, tablet, and mobile devices
- **Role-based Job Display**: Shows all jobs organized by role (Tanks, Healers, DPS, Crafters, Gatherers, Phantom Jobs)
- **Visual Level Indicators**: Separated badge design with golden highlights for max-level jobs
- **Correct Max Levels**: Recognizes custom max levels (Blue Mage: 80, Phantom Jobs: 3-16)
- **Lodestone Profile Links**: Character cards link directly to the character's Lodestone profile page
- **Alternating Card Layouts**: Character cards automatically alternate layout for visual variety
- **Last Updated Timestamps**: Shows when character data was last refreshed
- **Dynamic Cache Busting**: Automatic cache invalidation ensures users see the latest updates
- **Social Media Links**: Display your FFXIV-related Twitter and Bluesky profiles

## Setup

### 1. Fork or Clone This Repository

```bash
git clone https://github.com/MiraWaNeko/ffxiv-homepage
cd ffxiv-homepage
```

### 2. Configure Your Site (config.js)

**This is the main file you need to edit!** All customization is centralized in `config.js`.

Edit `config.js` and update the following:

#### Site Information
```javascript
site: {
  title: 'Your Name - FFXIV Characters',
  header: 'FFXIV Characters',
}
```

#### Character Information
Add your FFXIV characters to the `characters` array:

```javascript
characters: [
  {
    id: 'YOUR_CHARACTER_ID',
    name: 'Character Name',
    world: 'Server Name [Data Center]',
    image: 'FULL_CHARACTER_IMAGE_URL'
  }
]
```

**Finding Your Character ID:**
- Go to your character's Lodestone page (e.g., `https://na.finalfantasyxiv.com/lodestone/character/24921505/`)
- The number in the URL is your character ID (`24921505` in this example)

**Getting the Full Character Image:**
- Visit your character's Lodestone page
- Right-click on the character portrait and select "Copy Image Address"
- Paste the full URL (it should end with `fl0.jpg?...`)

#### Lodestone Region
```javascript
lodestone: {
  region: 'na', // Options: 'na', 'eu', 'jp', 'fr', 'de'
}
```

#### Social Media Links (Optional)
```javascript
socialLinks: [
  {
    platform: 'twitter',
    url: 'https://twitter.com/your-username',
    label: 'Twitter'
  },
  {
    platform: 'bluesky',
    url: 'https://bsky.app/profile/your-handle.bsky.social',
    label: 'Bluesky'
  }
]
```

Set to `null` or `[]` if you don't want social links displayed.

#### GitHub Pages Settings
```javascript
deployment: {
  customDomain: 'your-domain.com', // Or null if not using a custom domain
}
```

**Optional: Adding a Custom Favicon:**
- Place a `favicon.svg` file in the root directory to customize your site's icon
- The file should be an SVG format for best compatibility

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Fetch Character Data

Run the Lodestone parser to fetch your character data:

```bash
pnpm run update
```

This will automatically fetch:
- All combat jobs (including base classes)
- All 8 crafting classes
- All 3 gathering classes
- All 15 Phantom Jobs with their levels
- Achievement points
- Correct level information for each job
- Current timestamp for last updated tracking

The parser automatically categorizes jobs and includes all jobs regardless of level (unleveled jobs show as level 0).

### 5. Test Locally

Open `index.html` in your browser to see the results. You may need to use a local server (e.g., `npx http-server`) for ES6 modules to work properly.

### 6. Deploy to GitHub Pages

1. Push your changes to GitHub:
   ```bash
   git add .
   git commit -m "Initial setup"
   git push origin main
   ```

2. Enable GitHub Pages:
   - Go to your repository settings
   - Navigate to "Pages"
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"

3. Enable GitHub Actions:
   - Go to the "Actions" tab in your repository
   - If prompted, enable GitHub Actions
   - The workflow will run automatically every 6 hours

4. Set up write permissions for GitHub Actions:
   - Go to Settings → Actions → General
   - Scroll to "Workflow permissions"
   - Select "Read and write permissions"
   - Click "Save"

### 7. Automatic Updates

Your character data will automatically update every 6 hours via GitHub Actions. The workflow fetches fresh data from the Lodestone and deploys the updated site to GitHub Pages.

To change the update frequency, edit the cron expression in `.github/workflows/update-characters.yml`.

## Job Badge Design

Jobs are displayed with a separated badge design:

- **Unlocked (Level 0)**: `[ JOB | - ]` - Dimmed appearance
- **In Progress**: `[ JOB | 79 ]` - Normal styling
- **Max Level**: `[ JOB | 100 ]` - Golden highlight on the level

The system recognizes custom max levels:
- **Most Jobs**: Level 100
- **Blue Mage**: Level 80
- **Phantom Jobs**: Levels 3-16 (varies by job)

## Phantom Jobs

Full support for all 15 Island Sanctuary Phantom Jobs:

- **Level 3**: Berserker
- **Level 4**: Chemist, Bard, Mystic Knight, Gladiator, Dancer
- **Level 5**: Samurai, Time Mage, Geomancer, Oracle
- **Level 6**: Knight, Monk, Thief, Ranger, Cannoneer
- **Level 16**: Freelancer

Phantom jobs are displayed without the "Phantom " prefix (e.g., "Knight" instead of "Phantom Knight").

## Customization

### Main Configuration (config.js)

Most customization is done in `config.js`:

- **Site title and header**: Edit `site.title` and `site.header`
- **Characters**: Add/remove/edit characters in the `characters` array
- **Social links**: Modify the `socialLinks` array
- **Lodestone region**: Change `lodestone.region` to your region
- **Custom domain**: Set `deployment.customDomain` for GitHub Pages

### Update Frequency

To change how often character data updates, edit the cron expression in `.github/workflows/update-characters.yml`:

```yaml
on:
  schedule:
    - cron: '0 */12 * * *'  # Change this line
```

Common cron schedule examples:
- `0 */6 * * *` - Every 6 hours (default)
- `0 */12 * * *` - Every 12 hours
- `0 0 * * *` - Once per day at midnight UTC
- `0 0,12 * * *` - Twice per day (midnight and noon UTC)

See [crontab.guru](https://crontab.guru/) for help with cron expressions.

### Styling

Edit `styles.css` to customize:
- Colors and theme
- Layout and spacing
- Card designs
- Typography
- Job badge appearance

### Max Levels

To adjust max levels for jobs, edit `render.js` and update the `MAX_LEVELS` object:

```javascript
const MAX_LEVELS = {
  'Blue Mage': 80,
  'Phantom Knight': 6,
  // Add more custom max levels here
};
```

## Files Overview

- **`config.js`** - **Main configuration file** (characters, site info, social links, deployment settings)
- `index.html` - Main HTML page structure with dynamic cache busting
- `styles.css` - FFXIV-themed styling
- `data.js` - Character data (auto-generated from Lodestone)
- `render.js` - Dynamic rendering of character cards with job role categorization, achievements, and timestamps
- `update-characters.js` - Lodestone parser that fetches character data and achievement points
- `fetch-achievements.js` - Achievement fetching and caching system
- `package.json` - Node.js dependencies
- `favicon.svg` - (Optional) Custom favicon for your site
- `.github/workflows/update-characters.yml` - GitHub Actions workflow for automatic updates

## How It Works

1. **Data Fetching**: `update-characters.js` scrapes your character's Lodestone page using Cheerio
2. **Achievement Fetching**: Extracts achievement points from the Lodestone character profile
3. **Job Parsing**:
   - Regular jobs use standard Lodestone selectors
   - Phantom Jobs use special `character__support_job` selectors
4. **Data Generation**: Creates `data.js` with structured character data including jobs, achievements, and timestamps
5. **Cache Busting**: `index.html` appends timestamps to CSS/JS file loads to ensure fresh updates
6. **Rendering**: `render.js` reads `data.js` and dynamically generates the HTML for each character
7. **Job Display**: Jobs are organized by role and displayed with appropriate styling based on level
8. **Card Layout**: Character cards automatically alternate layout (reverse class) for visual variety

## Troubleshooting

### Characters not updating

1. Check the Actions tab for any failed workflows
2. Verify your character IDs are correct in `config.js`
3. Make sure GitHub Actions has write permissions
4. Check if the Lodestone is accessible (not under maintenance)
5. Ensure `config.js` is included in the deployment (check workflow file)

### Phantom Jobs not showing

1. Ensure you've completed Island Sanctuary content to unlock Phantom Jobs
2. Run `node update-characters.js` locally to verify parsing
3. Check that the Lodestone page shows your Phantom Jobs

### Achievement points not displaying

1. Verify your character profile on Lodestone shows achievement points
2. Run `node update-characters.js` locally to test the scraper
3. Check the browser console for any JavaScript errors
4. Achievement points must be publicly visible on your Lodestone profile

### Styling issues

- Clear your browser cache
- Check browser console for JavaScript errors
- Ensure all files are properly uploaded to GitHub

### Data not displaying

- Verify `data.js` exists and has valid data
- Check browser console for module loading errors
- Ensure your web server supports ES6 modules

## License

This project is open source and available under the MIT License.

## Credits

- All character and achievement data sourced from [FFXIV Lodestone](https://na.finalfantasyxiv.com/lodestone/)
- FINAL FANTASY is a registered trademark of Square Enix Holdings Co., Ltd.

## Support

If you encounter issues or have questions, please open an issue on GitHub.
