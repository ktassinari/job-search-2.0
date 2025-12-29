import { initializeDatabase } from '../db/database.js';
import { scrapeAllJobs } from '../services/scraper.js';

initializeDatabase();

console.log('🔍 Running scraper...\n');

scrapeAllJobs()
  .then(result => {
    console.log('\n✅ Scraping complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Scraping failed:', error.message);
    process.exit(1);
  });
