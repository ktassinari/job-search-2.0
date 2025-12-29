# Job Hunt AI

A complete local job search automation system that scrapes jobs, scores them with local AI (Llama 3.2), generates tailored application materials, and provides a beautiful Tinder-style swipe interface for job triage.

**Everything runs locally with no external API dependencies.**

## Features

- **Automated Job Scraping**: Pulls jobs from multiple sources
- **AI-Powered Scoring**: Uses Llama 3.2 (via Ollama) to score jobs 0-10 based on fit
- **Auto-Generated Materials**: Creates tailored resumes and cover letters for high-scoring jobs
- **Tinder-Style Swipe Interface**: Review jobs with smooth swipe gestures
- **Application Tracking**: Kanban board to track applications through the pipeline
- **Dark Mode**: Beautiful light and dark themes
- **Fully Local**: No cloud dependencies, complete privacy

## Tech Stack

- **Backend**: Node.js + Express + SQLite
- **Frontend**: React 18 + Vite + Tailwind CSS
- **AI**: Llama 3.2 via Ollama (runs locally)
- **Database**: SQLite (file-based, no server needed)

## Prerequisites

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **Ollama** - Required for AI features
   ```bash
   # Install Ollama - visit https://ollama.ai
   # macOS: brew install ollama
   # Then pull Llama 3.2
   ollama pull llama3.2
   ```

## Quick Start

### 1. Install Dependencies

```bash
# Backend
cd job-hunt-ai/backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Start Ollama (in a separate terminal)

```bash
ollama serve
```

### 3. Start the Backend

```bash
cd backend
npm run dev
```

The API will start on [http://localhost:3001](http://localhost:3001)

### 4. Start the Frontend

```bash
cd frontend
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000)

## First-Time Setup

1. **Run the scraper** to get initial jobs:
   ```bash
   cd backend
   npm run scrape
   ```

2. **Score the jobs** with AI:
   ```bash
   npm run score
   ```

3. **Generate materials** for high-scoring jobs:
   ```bash
   npm run generate
   ```

4. **Open the app** and start swiping!

## Daily Workflow

### Morning Routine
1. Open [http://localhost:3000](http://localhost:3000)
2. Dashboard shows "X new jobs"
3. Click **"Start Swiping"**
4. Swipe through jobs (← Pass, → Keep)
5. View generated materials
6. Apply on company websites
7. Mark as "Applied" to track

### Automation
Set up nightly automation:
```bash
cd backend
npm run schedule
```

This runs at 2 AM daily:
- Scrapes new jobs
- Scores them with AI
- Generates materials for 7+ scores

## Available Commands

### Backend

```bash
npm run dev        # Start development server
npm start          # Start production server
npm run scrape     # Scrape jobs now
npm run score      # Score unscored jobs
npm run generate   # Generate materials for high-scoring jobs
npm run schedule   # Start nightly automation scheduler
```

### Frontend

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## API Endpoints

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `PUT /api/jobs/:id` - Update job
- `POST /api/jobs/:id/score` - Score a specific job
- `POST /api/jobs/:id/generate` - Generate materials for a job

### Scraper
- `POST /api/scrape` - Trigger job scraping
- `POST /api/scrape/score` - Score all unscored jobs
- `POST /api/scrape/generate` - Generate materials for high-scoring jobs

### Materials
- `GET /api/materials/job/:jobId` - Get materials for a job

### Applications
- `GET /api/applications` - Get all applications
- `POST /api/applications` - Create new application
- `PUT /api/applications/:id` - Update application
- `GET /api/applications/followups` - Get follow-ups due today

### Analytics
- `GET /api/analytics/overview` - Get dashboard analytics
- `GET /api/analytics/new-jobs` - Get count of new jobs

### System
- `GET /api/health` - Health check (includes Ollama status)

## Database Schema

### jobs
- Basic info: title, company, url, description, location
- AI data: score, ai_reason, keywords
- Status tracking: status, created_at, updated_at

### materials
- Generated resume and cover letter per job
- Suggested portfolio projects

### applications
- Application tracking
- Follow-up reminders
- Interview notes

## Configuration

### User Profile (for AI)
Edit [backend/src/services/llama.js](backend/src/services/llama.js) to update:
- Name, location, education
- Skills and experience
- Target companies and roles
- Portfolio projects

### Scraping Sources
Edit [backend/src/services/scraper.js](backend/src/services/scraper.js):
- Add/remove job boards
- Update search queries
- Adjust blacklist

### Scoring Criteria
Edit scoring prompts in [backend/src/services/llama.js](backend/src/services/llama.js):
- Adjust score ranges
- Modify boosts
- Change keywords

## Project Structure

```
job-hunt-ai/
├── backend/
│   ├── src/
│   │   ├── db/
│   │   │   ├── database.js       # SQLite setup
│   │   │   └── services.js       # CRUD operations
│   │   ├── services/
│   │   │   ├── scraper.js        # Job scraping
│   │   │   ├── llama.js          # Ollama/Llama integration
│   │   │   ├── scorer.js         # Job scoring
│   │   │   └── generator.js      # Materials generation
│   │   ├── routes/
│   │   │   ├── jobs.js           # Job endpoints
│   │   │   └── api.js            # Other endpoints
│   │   ├── scripts/
│   │   │   ├── scrape.js         # Scrape script
│   │   │   ├── score.js          # Score script
│   │   │   └── generate.js       # Generate script
│   │   ├── server.js             # Express server
│   │   └── scheduler.js          # Nightly automation
│   └── data/
│       └── jobs.db               # SQLite database (auto-created)
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx     # Main dashboard
│   │   │   ├── Swipe.jsx         # Tinder-style swipe
│   │   │   ├── JobsList.jsx      # Jobs table view
│   │   │   ├── Materials.jsx     # Resume/cover letter view
│   │   │   └── Applications.jsx  # Kanban pipeline
│   │   ├── components/
│   │   │   ├── Button.jsx        # Button component
│   │   │   ├── Card.jsx          # Card component
│   │   │   ├── Badge.jsx         # Badge component
│   │   │   └── Loading.jsx       # Loading spinner
│   │   ├── services/
│   │   │   └── api.js            # API client
│   │   ├── App.jsx               # Main app + routing
│   │   ├── main.jsx              # Entry point
│   │   └── index.css             # Tailwind styles
│   └── index.html
└── README.md
```

## Troubleshooting

### Ollama Not Running
```bash
# Start Ollama
ollama serve

# Verify it's running
curl http://localhost:11434/api/tags
```

### No Jobs Appearing
```bash
# Manually run scraper
cd backend
npm run scrape

# Check database
sqlite3 data/jobs.db "SELECT COUNT(*) FROM jobs;"
```

### Scores Not Generating
```bash
# Manually score jobs
npm run score

# Check Ollama is running
npm run health
```

### Materials Not Generating
```bash
# Manually generate materials
npm run generate

# Only generates for jobs with score >= 7
```

## Customization

### Adding New Job Sources
1. Edit [backend/src/services/scraper.js](backend/src/services/scraper.js)
2. Add new scraping function
3. Call it in `scrapeAllJobs()`

### Changing AI Model
Edit [backend/src/services/llama.js](backend/src/services/llama.js):
```javascript
const MODEL = 'llama3.2'; // Change to your preferred model
```

### Adjusting Score Threshold
Edit materials generation threshold:
```javascript
// In scheduler.js, scraper endpoints, etc.
generateAllMaterials(7); // Change 7 to your threshold
```

## Privacy & Security

- **100% Local**: All data stays on your machine
- **No Cloud APIs**: No external API calls for AI
- **No Tracking**: No analytics or telemetry
- **SQLite Database**: File-based, easy to backup
- **Open Source**: Inspect all code

## Performance

- **Scraping**: ~30-60 seconds for 250-300 jobs
- **Scoring**: ~3-5 minutes for 150 jobs (local Llama)
- **Materials**: ~30 seconds per job
- **Total Nightly**: ~15-20 minutes

## Future Enhancements

Potential additions:
- [ ] Real LinkedIn/Indeed scraping with Puppeteer
- [ ] Email notifications for new high-scoring jobs
- [ ] Chrome extension for one-click applications
- [ ] Resume parsing to auto-populate profile
- [ ] Interview prep questions generator
- [ ] Salary negotiation assistant
- [ ] Application success analytics

## License

MIT License - Use freely for personal job searching!

## Support

- **Issues**: Create an issue if you encounter problems
- **Questions**: Check the troubleshooting section first
- **Customization**: The code is well-commented for easy modification

---

**Built with ❤️ for Kat's themed entertainment job search**

Good luck landing your dream job at Disney, Universal, or AOA! 🎢✨
