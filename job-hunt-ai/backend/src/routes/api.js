import express from 'express';
import * as dbService from '../db/services.js';
import { scrapeAllJobs } from '../services/scraper.js';
import { scoreAllUnscoredJobs } from '../services/scorer.js';
import { generateAllMaterials } from '../services/generator.js';
import { checkOllamaStatus } from '../services/llama.js';

const router = express.Router();

// ============ SCRAPER ENDPOINTS ============

// POST /api/scrape - Trigger job scraping
router.post('/scrape', async (req, res) => {
  try {
    const result = await scrapeAllJobs();

    res.json({
      success: true,
      data: result,
      message: `Scraped ${result.saved} new jobs`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/scrape/score - Score all unscored jobs
router.post('/scrape/score', async (req, res) => {
  try {
    const result = await scoreAllUnscoredJobs();

    res.json({
      success: true,
      data: result,
      message: `Scored ${result.scored} jobs`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/scrape/generate - Generate materials for high-scoring jobs
router.post('/scrape/generate', async (req, res) => {
  try {
    const minScore = req.body.minScore || 7;
    const result = await generateAllMaterials(minScore);

    res.json({
      success: true,
      data: result,
      message: `Generated materials for ${result.generated} jobs`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ MATERIALS ENDPOINTS ============

// GET /api/materials/job/:jobId - Get materials for a job
router.get('/materials/job/:jobId', (req, res) => {
  try {
    const materials = dbService.getMaterialsByJobId(req.params.jobId);

    // Organize by type
    const organized = {
      resume: materials.find(m => m.type === 'Resume'),
      coverLetter: materials.find(m => m.type === 'Cover Letter')
    };

    res.json({
      success: true,
      data: organized
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ APPLICATIONS ENDPOINTS ============

// GET /api/applications - Get all applications
router.get('/applications', (req, res) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;

    const applications = dbService.getAllApplications(filters);

    res.json({
      success: true,
      data: applications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/applications/followups - Get follow-ups due today
router.get('/applications/followups', (req, res) => {
  try {
    const followUps = dbService.getFollowUpsDue();

    res.json({
      success: true,
      data: followUps
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/applications/apply/:jobId - Create application and generate materials
router.post('/applications/apply/:jobId', async (req, res) => {
  try {
    const jobId = parseInt(req.params.jobId);

    // Check if application already exists
    const existing = dbService.getApplicationByJobId(jobId);
    if (existing) {
      return res.json({
        success: true,
        data: existing,
        message: 'Application already exists'
      });
    }

    // Create application
    const applicationId = dbService.createApplication({
      job_id: jobId,
      status: 'preparing',
      notes: 'Created from swipe interface'
    });

    // Generate materials in background (don't wait)
    const job = dbService.getJobById(jobId);
    const { generateMaterialsForJob } = await import('../services/generator.js');
    generateMaterialsForJob(job)
      .then(() => {
        console.log(`✅ Materials generated for job ${jobId}`);
      })
      .catch(err => {
        console.error(`❌ Error generating materials for job ${jobId}:`, err.message);
      });

    const application = dbService.getApplication(applicationId);

    res.json({
      success: true,
      data: application,
      message: 'Application created and materials generation started'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// POST /api/applications - Create new application
router.post('/applications', (req, res) => {
  try {
    const { job_id, date_applied, status, follow_up_date, notes } = req.body;

    if (!job_id) {
      return res.status(400).json({
        success: false,
        error: 'job_id is required'
      });
    }

    const id = dbService.createApplication({
      job_id,
      date_applied,
      status,
      follow_up_date,
      notes
    });

    // Update job status to 'applied'
    dbService.updateJob(job_id, { status: 'applied' });

    res.json({
      success: true,
      data: { id },
      message: 'Application created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/applications/:id - Update application
router.put('/applications/:id', (req, res) => {
  try {
    const updates = {};
    const allowedFields = ['status', 'follow_up_date', 'follow_up_done', 'notes'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    dbService.updateApplication(req.params.id, updates);

    res.json({
      success: true,
      message: 'Application updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ ANALYTICS ENDPOINTS ============

// GET /api/analytics/overview - Get analytics overview
router.get('/analytics/overview', (req, res) => {
  try {
    const analytics = dbService.getAnalytics();

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// GET /api/analytics/new-jobs - Get count of new jobs
router.get('/analytics/new-jobs', (req, res) => {
  try {
    const since = req.query.since || null;
    const count = dbService.getNewJobsCount(since);

    res.json({
      success: true,
      data: { count }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ PROFILE ENDPOINTS ============

// GET /api/profile - Get user profile
router.get('/profile', (req, res) => {
  try {
    const profile = dbService.getProfile();

    res.json({
      success: true,
      data: profile || {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/profile - Update user profile
router.put('/profile', (req, res) => {
  try {
    const updates = {};
    const allowedFields = [
      'full_name', 'email', 'phone', 'location', 'graduation_date',
      'linkedin_url', 'portfolio_url', 'github_url', 'summary',
      'skills', 'education', 'experience'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    dbService.updateProfile(updates);

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ SETTINGS ENDPOINTS ============

// GET /api/settings - Get user settings
router.get('/settings', (req, res) => {
  try {
    const settings = dbService.getSettings();

    res.json({
      success: true,
      data: settings || {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// PUT /api/settings - Update user settings
router.put('/settings', (req, res) => {
  try {
    const updates = {};
    const allowedFields = [
      'auto_generate_threshold', 'prioritize_orlando', 'claude_api_key',
      'email_notifications', 'browser_notifications', 'theme', 'company_blacklist'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    dbService.updateSettings(updates);

    res.json({
      success: true,
      message: 'Settings updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// ============ SYSTEM ENDPOINTS ============

// GET /api/health - Health check
router.get('/health', async (req, res) => {
  try {
    const ollamaStatus = await checkOllamaStatus();

    res.json({
      success: true,
      data: {
        api: 'healthy',
        database: 'connected',
        ollama: ollamaStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;
