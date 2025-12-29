# Getting Started Checklist

Follow this step-by-step guide to get Job Hunt AI up and running.

## Pre-Flight Checklist

- [ ] macOS, Linux, or Windows with WSL installed
- [ ] At least 8GB RAM available
- [ ] At least 5GB free disk space
- [ ] Stable internet connection (for initial setup)

## Installation Steps

### Step 1: Install Node.js
- [ ] Go to https://nodejs.org/
- [ ] Download Node.js 18 or higher
- [ ] Install it
- [ ] Verify: `node --version` shows v18+

### Step 2: Install Ollama
- [ ] Go to https://ollama.ai/
- [ ] Download Ollama for your OS
- [ ] Install it
- [ ] Verify: `ollama --version` works

### Step 3: Download Llama Model
```bash
ollama pull llama3.2
```
- [ ] Wait for ~2GB download to complete
- [ ] Verify: `ollama list` shows llama3.2

### Step 4: Install Dependencies
```bash
cd job-hunt-ai
npm run setup
```
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] No error messages

## First Run

### Step 1: Start Ollama
```bash
# Terminal 1
ollama serve
```
- [ ] Ollama running on localhost:11434
- [ ] No errors shown

### Step 2: Start Backend
```bash
# Terminal 2
cd job-hunt-ai/backend
npm run dev
```
- [ ] Server running on localhost:3001
- [ ] "Database initialized" message shown
- [ ] No errors

### Step 3: Start Frontend
```bash
# Terminal 3
cd job-hunt-ai/frontend
npm run dev
```
- [ ] Vite running on localhost:3000
- [ ] Browser opens automatically
- [ ] Dashboard visible

### Step 4: Load Initial Data
```bash
# Terminal 4
cd job-hunt-ai/backend
npm run scrape
```
- [ ] Jobs scraped successfully
- [ ] Count shown (e.g., "Saved: 180 new jobs")

```bash
npm run score
```
- [ ] Jobs scored (this takes 3-5 minutes)
- [ ] Scores shown (e.g., "Scored: 150 jobs")

```bash
npm run generate
```
- [ ] Materials generated
- [ ] Count shown (e.g., "Generated: 25 jobs")

## Verification Checklist

### Backend Health
- [ ] Visit http://localhost:3001
- [ ] See API information JSON
- [ ] Visit http://localhost:3001/api/health
- [ ] See "ollama: running: true"

### Frontend Health
- [ ] Visit http://localhost:3000
- [ ] See dashboard with stats
- [ ] Stats show job counts > 0
- [ ] No JavaScript errors in console

### Database Health
- [ ] File exists: `backend/data/jobs.db`
- [ ] File size > 0 bytes
- [ ] No error messages about database

### AI Health
- [ ] Run: `curl http://localhost:11434/api/tags`
- [ ] See llama3.2 in model list
- [ ] No connection errors

## Feature Testing

### Test Swipe Interface
- [ ] Click "Swipe Jobs" on dashboard
- [ ] See job card with title, company, score
- [ ] Swipe left (pass) works
- [ ] Swipe right (keep) works
- [ ] Progress bar updates

### Test Materials View
- [ ] Click "Materials" in navigation
- [ ] See list of high-scoring jobs
- [ ] Click a job
- [ ] See resume and cover letter tabs
- [ ] "Copy to Clipboard" button works
- [ ] "Download as TXT" button works

### Test Jobs List
- [ ] Click "Jobs" in navigation
- [ ] See table of all jobs
- [ ] Search bar works
- [ ] Filters work
- [ ] Sorting works
- [ ] Click job to see details

### Test Applications
- [ ] Click "Applications" in navigation
- [ ] See Kanban board
- [ ] Drag card between columns works
- [ ] Status updates

### Test Dark Mode
- [ ] Click moon/sun icon in top-right
- [ ] Theme switches
- [ ] All pages look good in both modes
- [ ] Preference saved on refresh

## Customization Checklist

### Update Your Profile
- [ ] Open `backend/src/services/llama.js`
- [ ] Find "CANDIDATE:" section (line ~40)
- [ ] Update name, location, email
- [ ] Update education and skills
- [ ] Update key projects
- [ ] Save file
- [ ] Restart backend

### Update Job Search
- [ ] Open `backend/src/services/scraper.js`
- [ ] Find searchQueries array (line ~120)
- [ ] Update with your search terms
- [ ] Update BLACKLIST if needed
- [ ] Save file
- [ ] Run: `npm run scrape`

### Update Scoring Criteria
- [ ] Open `backend/src/services/llama.js`
- [ ] Find scoring prompt (line ~40)
- [ ] Adjust score ranges
- [ ] Modify boosts
- [ ] Save file
- [ ] Test: `npm run score`

## Daily Workflow Checklist

### Morning Routine
- [ ] Start Ollama: `ollama serve`
- [ ] Start backend: `cd backend && npm run dev`
- [ ] Start frontend: `cd frontend && npm run dev`
- [ ] Optional: Scrape new jobs: `npm run scrape && npm run score`
- [ ] Open http://localhost:3000
- [ ] Review new jobs in Swipe interface

### Applying to Jobs
- [ ] Swipe through jobs
- [ ] Keep good ones (→)
- [ ] Go to Materials view
- [ ] Copy resume for selected job
- [ ] Copy cover letter
- [ ] Apply on company website
- [ ] Go to Jobs list
- [ ] Click job → "Mark Applied"
- [ ] Application tracked in Pipeline

### End of Day
- [ ] Optional: Set up scheduler for automation
- [ ] Run: `npm run schedule` (runs at 2 AM nightly)
- [ ] Or: Set up system cron job

## Troubleshooting Checklist

### Backend Won't Start
- [ ] Check port 3001 isn't in use: `lsof -ti:3001`
- [ ] Kill if needed: `lsof -ti:3001 | xargs kill -9`
- [ ] Check Node version: `node --version`
- [ ] Reinstall: `cd backend && rm -rf node_modules && npm install`

### Frontend Won't Start
- [ ] Check port 3000 isn't in use
- [ ] Check Node version
- [ ] Reinstall: `cd frontend && rm -rf node_modules && npm install`
- [ ] Clear Vite cache: `rm -rf frontend/.vite`

### Ollama Won't Start
- [ ] Check if already running: `ps aux | grep ollama`
- [ ] Kill if stuck: `pkill ollama`
- [ ] Reinstall if needed
- [ ] Check system requirements (8GB RAM)

### No Jobs Appearing
- [ ] Run scraper: `npm run scrape`
- [ ] Check database: `ls -lh backend/data/jobs.db`
- [ ] Check logs for errors
- [ ] Try sample jobs in scraper.js

### Scores Not Generating
- [ ] Check Ollama running: `curl http://localhost:11434/api/tags`
- [ ] Check model installed: `ollama list`
- [ ] Run manually: `npm run score`
- [ ] Check logs for errors

### Materials Not Generating
- [ ] Check jobs have scores >= 7
- [ ] Check Ollama running
- [ ] Run manually: `npm run generate`
- [ ] Check logs for errors

## Optimization Checklist

### For Better Performance
- [ ] Use smaller Llama model: `ollama pull llama3.2:1b`
- [ ] Reduce concurrent scraping
- [ ] Add pagination to frontend
- [ ] Index more database fields

### For Better Results
- [ ] Customize scoring prompts more
- [ ] Add more job sources
- [ ] Refine search queries
- [ ] Update blacklist regularly

### For Better UX
- [ ] Customize colors in tailwind.config.js
- [ ] Add more keyboard shortcuts
- [ ] Add toast notifications
- [ ] Add email notifications

## Backup Checklist

### What to Backup
- [ ] Database: `backend/data/jobs.db`
- [ ] Config: `backend/src/services/llama.js`
- [ ] Config: `backend/src/services/scraper.js`
- [ ] Optional: `backend/data/` directory

### How to Backup
```bash
# Manual backup
cp backend/data/jobs.db ~/backups/jobs-$(date +%Y%m%d).db

# Automated backup (add to cron)
0 0 * * * cp /path/to/backend/data/jobs.db ~/backups/jobs-$(date +\%Y\%m\%d).db
```

## Next Steps

- [ ] Read [README.md](README.md) for full feature list
- [ ] Read [SETUP.md](SETUP.md) for detailed customization
- [ ] Read [API.md](API.md) for API reference
- [ ] Join the job hunt and land that dream role! 🎢

---

**All checkboxes checked? You're ready to go! Happy job hunting! 🚀**
