import { scoreJob } from './llama.js';
import { getJobsWithoutScore, updateJob } from '../db/services.js';

/**
 * Score all unscored jobs in the database
 */
export async function scoreAllUnscoredJobs() {
  console.log('🎯 Starting job scoring...');

  const jobs = getJobsWithoutScore();

  if (jobs.length === 0) {
    console.log('✅ No jobs to score');
    return { scored: 0, errors: 0 };
  }

  console.log(`   Found ${jobs.length} jobs to score`);

  let scored = 0;
  let errors = 0;

  for (const job of jobs) {
    try {
      console.log(`   Scoring: ${job.title} at ${job.company}...`);

      const result = await scoreJob(job);

      updateJob(job.id, {
        score: result.score,
        ai_reason: result.reason,
        keywords: JSON.stringify(result.keywords)
      });

      scored++;
      console.log(`   ✓ Score: ${result.score}/10 - ${result.reason}`);

      // Small delay to avoid overwhelming Ollama
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`   ✗ Error scoring job ${job.id}:`, error.message);
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
