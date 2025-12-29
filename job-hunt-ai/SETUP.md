# Setup Guide - Job Hunt AI

Complete step-by-step guide to get Job Hunt AI running on your machine.

## Prerequisites Checklist

- [ ] macOS, Linux, or Windows with WSL
- [ ] Node.js 18 or higher
- [ ] 8GB+ RAM (for running Llama 3.2)
- [ ] 5GB+ free disk space

## Step 1: Install Node.js

### macOS
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

### Linux
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Or use nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
```

### Windows
Download from [nodejs.org](https://nodejs.org/) or use WSL.

Verify installation:
```bash
node --version  # Should be v18 or higher
npm --version
```

## Step 2: Install Ollama

Ollama runs Llama 3.2 locally on your machine.

### macOS
```bash
# Option 1: Homebrew
brew install ollama

# Option 2: Download from website
# Visit https://ollama.ai and download the installer
```

### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Windows
Use WSL2 and follow Linux instructions, or download from [ollama.ai](https://ollama.ai).

Verify installation:
```bash
ollama --version
```

## Step 3: Pull Llama 3.2 Model

This downloads the AI model (about 2GB):

```bash
ollama pull llama3.2
```

Wait for download to complete. This is a one-time setup.

## Step 4: Clone/Download Project

If you received this as a zip:
```bash
cd ~/Documents
unzip job-hunt-ai.zip
cd job-hunt-ai
```

If from git:
```bash
git clone <repository-url>
cd job-hunt-ai
```

## Step 5: Install Backend Dependencies

```bash
cd backend
npm install
```

This installs:
- Express (web server)
- better-sqlite3 (database)
- cheerio (web scraping)
- axios (HTTP requests)
- node-cron (scheduling)
- And more...

## Step 6: Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

This installs:
- React 18
- Vite (build tool)
- Tailwind CSS
- Framer Motion (animations)
- React Router
- And more...

## Step 7: Test Backend

```bash
cd ../backend
npm run dev
```

You should see:
```
╔════════════════════════════════════════╗
║      Job Hunt AI - Backend API        ║
╚════════════════════════════════════════╝

🚀 Server running on http://localhost:3001
✅ Database initialized successfully
```

**Leave this running** and open a new terminal.

## Step 8: Start Ollama (New Terminal)

```bash
ollama serve
```

You should see Ollama running. **Leave this running** too.

## Step 9: Test Frontend (New Terminal)

```bash
cd job-hunt-ai/frontend
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:3000/
  ➜  press h to show help
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 10: Load Initial Data

In a **new terminal**:

```bash
cd job-hunt-ai/backend

# 1. Scrape some jobs
npm run scrape

# 2. Score them with AI (this takes a few minutes)
npm run score

# 3. Generate materials for high-scoring jobs
npm run generate
```

## Step 11: Verify Everything Works

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see the dashboard with job stats
3. Click "Swipe Jobs" to review jobs
4. Try swiping left (pass) or right (keep)
5. Check "Materials" to see generated resumes/cover letters

## Running Terminals Summary

You need **3 terminals running**:

1. **Backend**: `cd backend && npm run dev`
2. **Ollama**: `ollama serve`
3. **Frontend**: `cd frontend && npm run dev`

## Optional: Set Up Nightly Automation

To run scraping/scoring automatically every night at 2 AM:

```bash
cd backend
npm run schedule
```

This will:
- Run immediately (for testing)
- Then run every night at 2 AM
- Keep it running in the background

Or use cron (macOS/Linux):
```bash
# Edit crontab
crontab -e

# Add this line (adjust path):
0 2 * * * cd /path/to/job-hunt-ai/backend && npm run scrape && npm run score && npm run generate
```

## Customizing for Your Job Search

### Update Your Profile

Edit `backend/src/services/llama.js`:

```javascript
// Line ~40 - Update the scoring prompt
CANDIDATE:
Kat Tassinari | Kissimmee, FL | kat.tassinari@scad.edu
// ^ Change to your info

// Line ~110 - Update materials prompt
CANDIDATE:
Kat Tassinari | Kissimmee, FL | kat.tassinari@scad.edu
// ^ Change to your info
```

### Update Search Queries

Edit `backend/src/services/scraper.js`:

```javascript
// Line ~120 - Update search queries
const searchQueries = [
  'ux designer orlando',          // Your searches
  'experience designer theme park',
  // Add your own...
];
```

### Update Blacklist

Edit `backend/src/services/scraper.js`:

```javascript
// Line ~6 - Companies to filter out
const BLACKLIST = ['tesla', 'dataannotation'];
// Add companies you want to avoid
```

## Troubleshooting Setup

### "Cannot find module" errors
```bash
# Make sure you ran npm install in BOTH directories
cd backend && npm install
cd ../frontend && npm install
```

### "ECONNREFUSED" when scoring
```bash
# Ollama isn't running
ollama serve
```

### "Port 3001 already in use"
```bash
# Kill the process using the port
lsof -ti:3001 | xargs kill -9

# Or use a different port
PORT=3002 npm run dev
```

### Ollama "model not found"
```bash
# Pull the model
ollama pull llama3.2

# Verify it's there
ollama list
```

### Database errors
```bash
# Delete and recreate
rm backend/data/jobs.db
# Restart backend (it will auto-create)
```

### Blank dashboard
```bash
# You need to scrape jobs first
cd backend
npm run scrape
npm run score
```

## Performance Tips

### Faster Scoring
- Use a smaller model: `ollama pull llama3.2:1b`
- Edit `llama.js` to use `llama3.2:1b` instead

### Faster Scraping
- Reduce limit in scraper
- Focus on one source at a time

### Less Memory Usage
- Close other applications
- Use smaller Llama model
- Reduce concurrent processing

## Security Checklist

- [ ] Database is local (backend/data/jobs.db)
- [ ] No API keys needed
- [ ] Ollama runs locally
- [ ] No external network calls for AI
- [ ] Can run fully offline (except scraping)

## Daily Usage

### Morning Routine
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Ollama
ollama serve

# Terminal 3: Frontend
cd frontend && npm run dev

# Terminal 4: (Optional) Scrape new jobs
cd backend && npm run scrape && npm run score
```

### Just Checking Jobs
If you already have data:
```bash
# Start all three:
cd backend && npm run dev    # Terminal 1
ollama serve                  # Terminal 2
cd frontend && npm run dev    # Terminal 3
```

## Next Steps

1. ✅ Everything running? Great!
2. 📝 Customize your profile in the code
3. 🔍 Run your first scrape
4. 🎯 Score jobs with AI
5. 📄 Review generated materials
6. 💼 Start applying!

## Getting Help

- Check README.md for features and usage
- Review code comments for customization
- Database issues? Delete `backend/data/jobs.db` and restart
- AI issues? Verify Ollama with `ollama list`

## Environment Variables (Optional)

Create `backend/.env`:
```bash
PORT=3001
DATABASE_PATH=./data/jobs.db
OLLAMA_API=http://localhost:11434
```

Create `frontend/.env`:
```bash
VITE_API_URL=http://localhost:3001
```

---

**Setup complete! Happy job hunting! 🎉**
