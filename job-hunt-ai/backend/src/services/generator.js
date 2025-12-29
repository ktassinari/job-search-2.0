import { generateMaterials } from './llama.js';
import { getHighScoringJobsWithoutMaterials, createMaterial, updateJob } from '../db/services.js';

/**
 * Generate materials for all high-scoring jobs without materials
 */
export async function generateAllMaterials(minScore = 7) {
  console.log('📝 Starting materials generation...');

  const jobs = getHighScoringJobsWithoutMaterials(minScore);

  if (jobs.length === 0) {
    console.log('✅ No jobs need materials');
    return { generated: 0, errors: 0 };
  }

  console.log(`   Found ${jobs.length} high-scoring jobs without materials`);

  let generated = 0;
  let errors = 0;

  for (const job of jobs) {
    try {
      console.log(`   Generating materials for: ${job.title} at ${job.company}...`);

      const materials = await generateMaterials(job);

      // Save resume
      createMaterial({
        job_id: job.id,
        type: 'Resume',
        content: materials.resume,
        projects: materials.projects
      });

      // Save cover letter
      createMaterial({
        job_id: job.id,
        type: 'Cover Letter',
        content: materials.coverLetter,
        projects: materials.projects
      });

      // Update job status
      updateJob(job.id, {
        status: 'materials_ready'
      });

      generated++;
      console.log(`   ✓ Materials generated successfully`);

      // Delay to avoid overwhelming Ollama
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`   ✗ Error generating materials for job ${job.id}:`, error.message);
      errors++;
    }
  }

  console.log(`✅ Materials generation complete! Generated: ${generated}, Errors: ${errors}`);

  return { generated, errors };
}

/**
 * Generate materials for a specific job
 */
export async function generateMaterialsForJob(job) {
  try {
    console.log(`Generating materials for: ${job.title} at ${job.company}...`);

    const materials = await generateMaterials(job);

    // Save resume
    createMaterial({
      job_id: job.id,
      type: 'Resume',
      content: materials.resume,
      projects: materials.projects
    });

    // Save cover letter
    createMaterial({
      job_id: job.id,
      type: 'Cover Letter',
      content: materials.coverLetter,
      projects: materials.projects
    });

    // Update job status
    updateJob(job.id, {
      status: 'materials_ready'
    });

    return materials;
  } catch (error) {
    console.error(`Error generating materials for job ${job.id}:`, error.message);
    throw error;
  }
}
