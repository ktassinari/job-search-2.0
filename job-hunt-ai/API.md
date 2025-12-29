# API Documentation

Complete reference for all Job Hunt AI API endpoints.

**Base URL**: `http://localhost:3001/api`

## Jobs Endpoints

### Get All Jobs
```http
GET /api/jobs
```

**Query Parameters:**
- `status` (string): Filter by status (reviewing, materials_ready, applied, etc.)
- `minScore` (number): Minimum score (0-10)
- `search` (string): Search in title, company, description
- `sortBy` (string): Sort field (created_at, score, company)
- `order` (string): ASC or DESC
- `limit` (number): Results per page (default: 50)
- `offset` (number): Pagination offset

**Example:**
```bash
curl "http://localhost:3001/api/jobs?minScore=7&status=reviewing&limit=10"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "UX Designer",
      "company": "Disney",
      "url": "https://...",
      "description": "...",
      "location": "Orlando, FL",
      "remote": false,
      "salary_range": "$70k-90k",
      "source": "Direct",
      "score": 9,
      "ai_reason": "Perfect fit for themed entertainment",
      "keywords": ["UX", "Design", "Theme Parks"],
      "status": "reviewing",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

### Get Single Job
```http
GET /api/jobs/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "UX Designer",
    ...
  }
}
```

### Update Job
```http
PUT /api/jobs/:id
```

**Body:**
```json
{
  "status": "applied",
  "score": 8,
  "ai_reason": "Updated reason"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Job updated successfully"
}
```

### Delete/Archive Job
```http
DELETE /api/jobs/:id
```

Updates status to "archived" (soft delete).

**Response:**
```json
{
  "success": true,
  "message": "Job archived successfully"
}
```

### Score Specific Job
```http
POST /api/jobs/:id/score
```

Runs AI scoring on a specific job.

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 8,
    "reason": "Strong UX role at good company",
    "keywords": ["UX", "Research", "Design"]
  }
}
```

### Generate Materials for Job
```http
POST /api/jobs/:id/generate
```

Generates tailored resume and cover letter.

**Response:**
```json
{
  "success": true,
  "data": {
    "resume": "Full resume text...",
    "coverLetter": "Full cover letter text...",
    "projects": "Snow: The Fairest, Circe's Menagerie"
  }
}
```

## Scraper Endpoints

### Trigger Job Scraping
```http
POST /api/scrape
```

Scrapes jobs from all sources.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 250,
    "saved": 180,
    "duplicates": 70
  },
  "message": "Scraped 180 new jobs"
}
```

### Score All Unscored Jobs
```http
POST /api/scrape/score
```

Runs AI scoring on all jobs without scores.

**Response:**
```json
{
  "success": true,
  "data": {
    "scored": 150,
    "errors": 2
  },
  "message": "Scored 150 jobs"
}
```

### Generate All Materials
```http
POST /api/scrape/generate
```

**Body (optional):**
```json
{
  "minScore": 7
}
```

Generates materials for all high-scoring jobs.

**Response:**
```json
{
  "success": true,
  "data": {
    "generated": 25,
    "errors": 1
  },
  "message": "Generated materials for 25 jobs"
}
```

## Materials Endpoints

### Get Materials for Job
```http
GET /api/materials/job/:jobId
```

**Response:**
```json
{
  "success": true,
  "data": {
    "resume": {
      "id": 1,
      "job_id": 123,
      "type": "Resume",
      "content": "Full resume text...",
      "projects": "Snow: The Fairest, Circe's Menagerie",
      "created_at": "2025-01-15T10:30:00Z"
    },
    "coverLetter": {
      "id": 2,
      "job_id": 123,
      "type": "Cover Letter",
      "content": "Full cover letter text...",
      "projects": "...",
      "created_at": "2025-01-15T10:30:00Z"
    }
  }
}
```

## Applications Endpoints

### Get All Applications
```http
GET /api/applications
```

**Query Parameters:**
- `status` (string): Filter by status

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "job_id": 123,
      "title": "UX Designer",
      "company": "Disney",
      "location": "Orlando, FL",
      "date_applied": "2025-01-15",
      "status": "submitted",
      "follow_up_date": "2025-01-22",
      "follow_up_done": false,
      "notes": "Applied via careers page",
      "created_at": "2025-01-15T10:30:00Z"
    }
  ]
}
```

### Get Follow-ups Due
```http
GET /api/applications/followups
```

Returns applications with follow-ups due today or earlier.

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

### Create Application
```http
POST /api/applications
```

**Body:**
```json
{
  "job_id": 123,
  "date_applied": "2025-01-15",
  "status": "submitted",
  "follow_up_date": "2025-01-22",
  "notes": "Applied via LinkedIn"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 5
  },
  "message": "Application created successfully"
}
```

### Update Application
```http
PUT /api/applications/:id
```

**Body:**
```json
{
  "status": "interview",
  "follow_up_done": true,
  "notes": "Phone screen scheduled for Friday"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application updated successfully"
}
```

## Analytics Endpoints

### Get Overview
```http
GET /api/analytics/overview
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalJobs": 450,
    "highScoringJobs": 75,
    "totalApplications": 25,
    "interviews": 5,
    "offers": 1,
    "rejected": 3,
    "responseRate": "32.0",
    "jobsBySource": [
      { "source": "Direct", "count": 250 },
      { "source": "EntertainmentCareers", "count": 150 },
      { "source": "LinkedIn", "count": 50 }
    ],
    "recentActivity": [
      {
        "type": "job",
        "name": "UX Designer",
        "company": "Disney",
        "date": "2025-01-15T10:30:00Z"
      }
    ]
  }
}
```

### Get New Jobs Count
```http
GET /api/analytics/new-jobs
```

**Query Parameters:**
- `since` (ISO date string): Count jobs since this date

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 12
  }
}
```

## System Endpoints

### Health Check
```http
GET /api/health
```

Checks API and Ollama status.

**Response:**
```json
{
  "success": true,
  "data": {
    "api": "healthy",
    "database": "connected",
    "ollama": {
      "running": true,
      "models": [
        {
          "name": "llama3.2",
          "size": "2.0GB"
        }
      ]
    }
  }
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**
- `200`: Success
- `400`: Bad request (missing required fields)
- `404`: Resource not found
- `500`: Server error

## Rate Limiting

No rate limiting currently implemented - all requests are processed.

## Authentication

No authentication required - this is a local-only application.

## CORS

CORS is enabled for all origins in development.

## Examples with curl

### Scrape and process jobs
```bash
# Scrape
curl -X POST http://localhost:3001/api/scrape

# Score
curl -X POST http://localhost:3001/api/scrape/score

# Generate materials
curl -X POST http://localhost:3001/api/scrape/generate \
  -H "Content-Type: application/json" \
  -d '{"minScore": 7}'
```

### Get high-scoring jobs
```bash
curl "http://localhost:3001/api/jobs?minScore=8&sortBy=score&order=DESC"
```

### Update job status
```bash
curl -X PUT http://localhost:3001/api/jobs/123 \
  -H "Content-Type: application/json" \
  -d '{"status": "applied"}'
```

### Create application
```bash
curl -X POST http://localhost:3001/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "job_id": 123,
    "date_applied": "2025-01-15",
    "status": "submitted",
    "notes": "Applied via company website"
  }'
```

## Frontend Integration

The frontend uses these endpoints via the API client in `frontend/src/services/api.js`.

Example usage:
```javascript
import { getJobs, updateJob } from './services/api';

// Get high-scoring jobs
const response = await getJobs({ minScore: 7 });
const jobs = response.data;

// Update job
await updateJob(jobId, { status: 'applied' });
```

---

**Need help?** Check [README.md](README.md) for more context.
