import express from 'express';
import * as jobService from '../db/services.js';
import { scoreJobById } from '../services/scorer.js';
import { generateMaterialsForJob } from '../services/generator.js';

const router = express.Router();

// GET /api/jobs - Get all jobs with filters
router.get('/', (req, res) => {
  try {
    const filters = {
      status: req.query.status,
      minScore: req.query.minScore ? parseInt(req.query.minScore) : undefined,
      search: req.query.search,
      sortBy: req.query.sortBy || 'created_at',
      order: req.query.order || 'DESC',
      limit: req.query.limit ? parseInt(req.query.limit) : 50,
      offset: req.query.offset ? parseInt(req.query.offset) : 0
    };

    const jobs = jobService.getAllJobs(filters);

    // Parse keywords JSON for each job
    const jobsWithKeywords = jobs.map(job => ({
      ...job,
      keywords: job.keywords ? JSON.parse(job.keywords) : []
    }));

    res.json({
      success: true,
      data: jobsWithKeywords,
      count: jobsWithKeywords.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/jobs/:id - Get single job
router.get('/:id', (req, res) => {
  try {
    const job = jobService.getJobById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Parse keywords
    if (job.keywords) {
      job.keywords = JSON.parse(job.keywords);
    }

    res.json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/jobs/:id - Update job
router.put('/:id', (req, res) => {
  try {
    const { status, score, ai_reason, keywords } = req.body;

    const updates = {};
    if (status) updates.status = status;
    if (score !== undefined) updates.score = score;
    if (ai_reason) updates.ai_reason = ai_reason;
    if (keywords) updates.keywords = JSON.stringify(keywords);

    jobService.updateJob(req.params.id, updates);

    res.json({
      success: true,
      message: 'Job updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// DELETE /api/jobs/:id - Delete/archive job
router.delete('/:id', (req, res) => {
  try {
    // Instead of deleting, we'll update status to 'archived'
    jobService.updateJob(req.params.id, { status: 'archived' });

    res.json({
      success: true,
      message: 'Job archived successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/jobs/:id/score - Score a specific job
router.post('/:id/score', async (req, res) => {
  try {
    const job = jobService.getJobById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    const result = await scoreJobById(req.params.id, job);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/jobs/:id/generate - Generate materials for a specific job
router.post('/:id/generate', async (req, res) => {
  try {
    const job = jobService.getJobById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    const materials = await generateMaterialsForJob(job);

    res.json({
      success: true,
      data: materials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
