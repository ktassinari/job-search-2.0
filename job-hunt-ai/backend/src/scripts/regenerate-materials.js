#!/usr/bin/env node
import { initializeDatabase } from '../db/database.js';
import { getJobById } from '../db/services.js';
import { generateMaterialsForJob } from '../services/generator.js';

// Initialize database
initializeDatabase();

// Job IDs from existing applications
const jobIds = [210, 212, 213];

async function regenerateMaterials() {
  console.log('🔄 Regenerating materials for existing applications...\n');

  for (const jobId of jobIds) {
    try {
      const job = getJobById(jobId);

      if (!job) {
        console.log(`❌ Job ${jobId} not found`);
        continue;
      }

      console.log(`📝 Generating materials for job ${jobId}: ${job.title} at ${job.company}`);

      await generateMaterialsForJob(job);

      console.log(`✅ Materials generated successfully for job ${jobId}\n`);

      // Small delay to avoid overwhelming Ollama
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Error generating materials for job ${jobId}:`, error.message);
    }
  }

  console.log('✅ Regeneration complete!');
  process.exit(0);
}

regenerateMaterials().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
