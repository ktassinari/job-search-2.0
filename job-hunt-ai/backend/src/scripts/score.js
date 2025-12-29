import { initializeDatabase } from '../db/database.js';
import { scoreAllUnscoredJobs } from '../services/scorer.js';

initializeDatabase();

console.log('🎯 Running scorer...\n');

scoreAllUnscoredJobs()
  .then(result => {
    console.log('\n✅ Scoring complete!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Scoring failed:', error.message);
    process.exit(1);
  });
