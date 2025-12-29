# Installation Instructions

## Method 1: Automatic Setup (Recommended)

From the root `job-hunt-ai` directory:

```bash
# Install all dependencies (backend + frontend)
npm run setup
```

This will:
1. Install backend dependencies
2. Install frontend dependencies
3. Confirm setup is complete

## Method 2: Manual Setup

### Backend
```bash
cd job-hunt-ai/backend
npm install
```

### Frontend
```bash
cd job-hunt-ai/frontend
npm install
```

## Ollama Setup

**Required for AI features to work!**

### 1. Install Ollama

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

**Windows:**
Use WSL2 and follow Linux instructions, or download from https://ollama.ai

### 2. Pull Llama 3.2 Model

```bash
ollama pull llama3.2
```

This downloads ~2GB and only needs to be done once.

### 3. Verify Installation

```bash
ollama list
```

You should see `llama3.2` in the list.

## Running the Application

### Option A: Run Everything Separately (Recommended for Development)

**Terminal 1 - Ollama:**
```bash
ollama serve
```

**Terminal 2 - Backend:**
```bash
cd job-hunt-ai/backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd job-hunt-ai/frontend
npm run dev
```

### Option B: Run Backend and Frontend Together (Requires concurrently)

First install concurrently:
```bash
cd job-hunt-ai
npm install
```

Then run both:
```bash
# In one terminal
ollama serve

# In another terminal
npm run dev
```

## First-Time Data Setup

After everything is running, load initial data:

```bash
# In a new terminal
cd job-hunt-ai/backend

# 1. Scrape jobs (30-60 seconds)
npm run scrape

# 2. Score jobs with AI (3-5 minutes)
npm run score

# 3. Generate materials for high-scoring jobs (1-2 minutes)
npm run generate
```

Or use the root package.json:
```bash
cd job-hunt-ai
npm run scrape
npm run score
npm run generate
```

## Verify Installation

1. **Backend**: Open http://localhost:3001
   - Should see JSON with API info

2. **Frontend**: Open http://localhost:3000
   - Should see the dashboard

3. **Ollama**: Run `curl http://localhost:11434/api/tags`
   - Should return list of models

4. **Database**: Check `backend/data/jobs.db` exists
   - Created automatically on first run

## Troubleshooting Installation

### npm install fails

**Error: "Cannot find module 'better-sqlite3'"**
```bash
# On macOS, you may need:
xcode-select --install

# On Linux:
sudo apt-get install build-essential python3
```

**Error: "gyp ERR!"**
```bash
# Install build tools
# macOS:
xcode-select --install

# Linux:
sudo apt-get install build-essential
```

### Ollama installation fails

**macOS:**
```bash
# Try manual download from https://ollama.ai
# Or use brew:
brew tap ollama/tap
brew install ollama
```

**Linux:**
```bash
# Check system requirements
# Requires: Linux, 8GB RAM, x86_64/ARM64

# Try manual install:
curl -L https://ollama.ai/download/ollama-linux-amd64 -o ollama
chmod +x ollama
sudo mv ollama /usr/local/bin/
```

### Port conflicts

**Backend (3001):**
```bash
# Find and kill process
lsof -ti:3001 | xargs kill -9

# Or use different port
PORT=3002 npm run dev
```

**Frontend (3000):**
```bash
# Vite will auto-increment if 3000 is taken
# Or specify in vite.config.js
```

**Ollama (11434):**
```bash
# Kill existing Ollama
pkill ollama

# Start fresh
ollama serve
```

### Dependencies not installing

**Clear npm cache:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

**Use different registry:**
```bash
npm install --registry=https://registry.npmjs.org/
```

## System Requirements

### Minimum
- **OS**: macOS 10.15+, Ubuntu 20.04+, Windows 10+ (with WSL2)
- **RAM**: 8GB (for Llama 3.2)
- **Storage**: 5GB free space
- **CPU**: x86_64 or ARM64
- **Node.js**: 18.0.0 or higher

### Recommended
- **RAM**: 16GB
- **Storage**: 10GB+ free space
- **CPU**: Multi-core processor
- **Internet**: For initial setup and job scraping

## Environment Variables (Optional)

Create `backend/.env`:
```bash
PORT=3001
DATABASE_PATH=./data/jobs.db
OLLAMA_API_URL=http://localhost:11434
NODE_ENV=development
```

Create `frontend/.env`:
```bash
VITE_API_URL=http://localhost:3001
```

## Post-Installation

After installation is complete:

1. ✅ Read [QUICKSTART.md](QUICKSTART.md) for usage
2. ✅ Customize your profile in `backend/src/services/llama.js`
3. ✅ Update search queries in `backend/src/services/scraper.js`
4. ✅ Run initial scrape and scoring
5. ✅ Start swiping jobs!

## Uninstall

To remove everything:

```bash
# Remove dependencies
rm -rf node_modules
rm -rf backend/node_modules
rm -rf frontend/node_modules

# Remove database
rm -rf backend/data

# Remove build files
rm -rf frontend/dist

# Uninstall Ollama
# macOS:
brew uninstall ollama

# Linux:
sudo rm /usr/local/bin/ollama
```

## Getting Help

- 📖 See [README.md](README.md) for features
- 🚀 See [QUICKSTART.md](QUICKSTART.md) for quick start
- 🔧 See [SETUP.md](SETUP.md) for detailed setup
- 📡 See [API.md](API.md) for API reference

---

**Installation complete? Great! See [QUICKSTART.md](QUICKSTART.md) for next steps.**
