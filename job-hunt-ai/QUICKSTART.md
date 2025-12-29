# Quick Start Guide

Get Job Hunt AI running in 5 minutes.

## Prerequisites

Install these first:
1. **Node.js 18+**: https://nodejs.org/
2. **Ollama**: https://ollama.ai/

## Installation

```bash
# 1. Pull Llama 3.2 model (one-time, ~2GB download)
ollama pull llama3.2

# 2. Install backend dependencies
cd job-hunt-ai/backend
npm install

# 3. Install frontend dependencies
cd ../frontend
npm install
```

## Running the App

Open **3 terminal windows**:

### Terminal 1: Start Ollama
```bash
ollama serve
```

### Terminal 2: Start Backend
```bash
cd job-hunt-ai/backend
npm run dev
```

### Terminal 3: Start Frontend
```bash
cd job-hunt-ai/frontend
npm run dev
```

## Load Initial Data

In a **new terminal** (while the others are running):

```bash
cd job-hunt-ai/backend

# Scrape jobs
npm run scrape

# Score them (takes 3-5 min)
npm run score

# Generate materials
npm run generate
```

## Open the App

Go to: **http://localhost:3000**

You should see:
- Dashboard with job stats
- "Start Swiping" button
- Click it and swipe through jobs!

## Daily Usage

### Option 1: Quick Start (with data already loaded)
```bash
# Terminal 1
ollama serve

# Terminal 2
cd backend && npm run dev

# Terminal 3
cd frontend && npm run dev
```

### Option 2: With New Jobs
```bash
# After starting all three terminals above, run:
cd backend
npm run scrape && npm run score && npm run generate
```

## Key Features

- **Swipe**: Tinder-style job review (← pass, → keep)
- **Materials**: View AI-generated resumes and cover letters
- **Applications**: Track jobs through the pipeline
- **Dark Mode**: Toggle in the top-right

## Troubleshooting

### "ECONNREFUSED"
→ Start Ollama: `ollama serve`

### "Port already in use"
→ Kill process: `lsof -ti:3001 | xargs kill -9`

### "No jobs found"
→ Run scraper: `cd backend && npm run scrape`

### Empty dashboard
→ Score jobs: `npm run score`

## Customization

Edit your profile in [backend/src/services/llama.js](backend/src/services/llama.js):
- Change name, location, skills
- Update target companies
- Modify scoring criteria

See [SETUP.md](SETUP.md) for detailed customization guide.

## Next Steps

1. Review jobs in Swipe interface
2. Keep the good ones (→)
3. Check Materials for tailored resumes
4. Copy and apply!
5. Track in Applications board

---

Need more help? See [README.md](README.md) or [SETUP.md](SETUP.md)
