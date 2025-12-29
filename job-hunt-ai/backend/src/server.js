import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';
import { initializeDatabase } from './db/database.js';
import jobsRouter from './routes/jobs.js';
import apiRouter from './routes/api.js';
import contactsRouter from './routes/contacts.js';
import referralsRouter from './routes/referrals.js';
import templatesRouter from './routes/templates.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Create data directory if it doesn't exist
const dataDir = join(__dirname, '../data');
try {
  mkdirSync(dataDir, { recursive: true });
} catch (error) {
  // Directory already exists
}

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/jobs', jobsRouter);
app.use('/api/contacts', contactsRouter);
app.use('/api/referrals', referralsRouter);
app.use('/api/templates', templatesRouter);
app.use('/api', apiRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Job Hunt AI API',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      jobs: '/api/jobs',
      contacts: '/api/contacts',
      scrape: '/api/scrape',
      materials: '/api/materials/job/:jobId',
      applications: '/api/applications',
      analytics: '/api/analytics/overview',
      health: '/api/health'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('╔════════════════════════════════════════╗');
  console.log('║      Job Hunt AI - Backend API        ║');
  console.log('╚════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log('');
  console.log('Available endpoints:');
  console.log(`   GET  http://localhost:${PORT}/api/jobs`);
  console.log(`   POST http://localhost:${PORT}/api/scrape`);
  console.log(`   GET  http://localhost:${PORT}/api/analytics/overview`);
  console.log(`   GET  http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('📝 Run commands:');
  console.log('   npm run scrape    - Scrape new jobs');
  console.log('   npm run score     - Score unscored jobs');
  console.log('   npm run generate  - Generate materials');
  console.log('');
});

export default app;
