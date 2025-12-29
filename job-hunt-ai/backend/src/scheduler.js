import cron from 'node-cron';
import { initializeDatabase } from './db/database.js';
import { scrapeAllJobs } from './services/scraper.js';
import { scoreAllUnscoredJobs } from './services/scorer.js';
import { generateAllMaterials } from './services/generator.js';

// Initialize database
initializeDatabase();

console.log('');
console.log('╔════════════════════════════════════════╗');
console.log('║    Job Hunt AI - Automation Scheduler  ║');
console.log('╚════════════════════════════════════════╝');
console.log('');

/**
 * Nightly automation job
 */
async function runNightlyJob() {
  console.log('');
  console.log('🌙 Starting nightly automation job...');
  console.log(`   Time: ${new Date().toLocaleString()}`);
  console.log('');

  try {
    // Step 1: Scrape jobs
    console.log('Step 1/3: Scraping jobs...');
    const scrapeResult = await scrapeAllJobs();
    console.log(`✓ Scraped ${scrapeResult.saved} new jobs`);

    // Step 2: Score new jobs
    console.log('');
    console.log('Step 2/3: Scoring jobs...');
    const scoreResult = await scoreAllUnscoredJobs();
    console.log(`✓ Scored ${scoreResult.scored} jobs`);

    // Step 3: Generate materials for high-scoring jobs
    console.log('');
    console.log('Step 3/3: Generating materials...');
    const generateResult = await generateAllMaterials(7);
    console.log(`✓ Generated materials for ${generateResult.generated} jobs`);

    // Summary
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Nightly job complete!');
    console.log(`   New jobs: ${scrapeResult.saved}`);
    console.log(`   Jobs scored: ${scoreResult.scored}`);
    console.log(`   Materials generated: ${generateResult.generated}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
  } catch (error) {
    console.error('');
    console.error('❌ Nightly job failed:', error.message);
    console.error('');
  }
}

// Schedule job for 2 AM every day
// Cron format: minute hour day month day-of-week
cron.schedule('0 2 * * *', async () => {
  await runNightlyJob();
});

console.log('⏰ Scheduled nightly job for 2:00 AM');
console.log('');
console.log('Running test job now...');
console.log('');

// Run immediately on startup for testing
runNightlyJob();

// Keep the process running
process.on('SIGINT', () => {
  console.log('');
  console.log('👋 Shutting down scheduler...');
  process.exit(0);
});
