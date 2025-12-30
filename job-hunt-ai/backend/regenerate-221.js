#!/usr/bin/env node
import { initializeDatabase } from './src/db/database.js';
import { getJobById } from './src/db/services.js';
import { generateMaterialsForJob } from './src/services/generator.js';

initializeDatabase();

const job = getJobById(221);
if (!job) {
  console.error('Job 221 not found');
  process.exit(1);
}

console.log(`Generating materials for: ${job.title} at ${job.company}`);

try {
  await generateMaterialsForJob(job);
  console.log('✅ Materials generated successfully');
  process.exit(0);
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
