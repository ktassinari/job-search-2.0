import { scoreJob } from './llama.js';
import { getJobsWithoutScore, getJobsToScore, updateJob } from '../db/services.js';

/**
 * Score all unscored jobs in the database
 */
export async function scoreAllUnscoredJobs(batchSize = null) {
  console.log('🎯 Starting job scoring...');

  const jobs = batchSize ? getJobsToScore(batchSize) : getJobsWithoutScore();

  if (jobs.length === 0) {
    console.log('✅ No jobs to score');
    return { scored: 0, errors: 0 };
  }

  console.log(`   Found ${jobs.length} jobs to score${batchSize ? ` (batch size: ${batchSize})` : ''}`);

  let scored = 0;
  let errors = 0;

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    try {
      console.log(`   [${i + 1}/${jobs.length}] Scoring: ${job.title} at ${job.company}...`);

      const result = await scoreJob(job);

      updateJob(job.id, {
        score: result.score,
        ai_reason: result.reason,
        keywords: JSON.stringify(result.keywords)
      });

      scored++;
      console.log(`   ✓ [${i + 1}/${jobs.length}] Score: ${result.score}/10 - ${result.reason}`);

      // Small delay to avoid overwhelming Ollama
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`   ✗ [${i + 1}/${jobs.length}] Error scoring job ${job.id}:`, error.message);
      errors++;
    }
  }

  console.log(`✅ Scoring complete! Scored: ${scored}, Errors: ${errors}`);

  return { scored, errors };
}

/**
 * Score a specific job by ID
 */
export async function scoreJobById(jobId, job) {
  try {
    const result = await scoreJob(job);

    updateJob(jobId, {
      score: result.score,
      ai_reason: result.reason,
      keywords: JSON.stringify(result.keywords)
    });

    return result;
  } catch (error) {
    console.error(`Error scoring job ${jobId}:`, error.message);
    throw error;
  }
}
