# Figma Design Implementation Plan

Based on the Figma designs shared, here's the implementation plan to update the app.

## Design System Updates

### Colors (✅ DONE)
- Primary: `#7C7CFF` (purple/indigo)
- Background: `#0B0E13` (very dark navy)
- Surface: `#1A1F2E` (dark navy)
- Card: `#1E2433` (lighter dark)
- Border: `#2A3142` (subtle border)
- Success: `#10B981` (green for 9+ scores)
- Warning: `#F59E0B` (orange for warnings)
- Error: `#EF4444` (red for rejections)
- Info: `#3B82F6` (blue for 8+ scores)

### Typography
- Font: Inter
- Display (32px/Bold): Page titles
- Heading 1 (24px/Semibold): Section headers
- Heading 2 (20px/Semibold): Card headers
- Body (16px/Regular): Main text
- Small (14px/Regular): Secondary text

### Components to Update

#### 1. Dashboard ("Welcome back, Kat!")
**Current**: Generic stats layout
**Figma Design**:
- Large welcome message with waving hand emoji
- Purple gradient "New Jobs Waiting" card with "Start Swiping" button
- 4 stat cards in grid:
  - Jobs Scraped (247, +12%)
  - High-Scoring Jobs (34, +8%)
  - Applications Sent (18, +15%)
  - Interviews (3, +50%)
- Each stat shows icon, number, and % change vs last week
- Follow-ups Due section with company avatars and dates
- Recent Activity feed at bottom

**Status**: ✅ New component created (DashboardNew.jsx)

#### 2. Jobs List ("Jobs")
**Figma Design**:
- Search bar with "Search by title or company..."
- Filters button and view toggle (list/grid)
- Table with columns:
  - JOB TITLE
  - COMPANY (with avatar/icon)
  - LOCATION (with "Remote" badge)
  - SCORE (colored badge: green 9+, blue 8+)
  - STATUS (colored badge)
- Pagination at bottom
- Dark card background for table
- Company avatars with first letter

**Status**: Needs update

#### 3. Application Materials
**Figma Design**:
- Left sidebar: "Select Job" list
  - Job cards with score badges
  - Status badges (Reviewing, Materials Ready, Applied)
- Right panel: Selected job details
  - Company avatar with first letter
  - Job title and company
  - Score badge and status badge
  - "Generate Materials" button
  - Resume/Cover Letter tabs
  - Action buttons: Copy to Clipboard, Download PDF, Download DOCX, Edit
- Resume preview in dark card

**Status**: Needs update

#### 4. Review Jobs (Swipe)
**Figma Design**:
- "Review Jobs" header with "Job 1 of 3" counter
- Three action buttons at top:
  - Red X (Reject)
  - Blue Star (Bookmark)
  - Green Heart (Accept)
- Progress bar below buttons
- Job card:
  - Score badge (green circle, e.g., 9.5)
  - Tier badge (yellow, e.g., "Tier 1")
  - Company avatar
  - Job title in large text
  - Company name
  - Location and Remote badge
  - Salary range
  - Skill tags (UI/UX, Product Design, Streaming)
  - Job description
  - "AI Analysis" section at bottom with purple background
- Skip and Quit buttons in top right

**Status**: Needs major update

#### 5. Pipeline (Kanban)
**Figma Design**:
- "Application Pipeline" title
- "Track your applications through every stage"
- Kanban columns:
  - Preparing (2 items)
  - Submitted (1 item)
  - Under Review (1 item)
  - Interview (1 item)
  - Offer (0 items)
  - Rejected (0 items)
- Job cards show:
  - Job title
  - Company name
  - Days since applied
  - Follow-up indicator
- Pipeline Summary below showing counts

**Status**: Needs update

#### 6. Analytics (NEW PAGE)
**Figma Design**:
- "Analytics" title with "Export Data" button
- Time period tabs: Last 7 days, Last 30 days, All time
- 4 stat cards:
  - Applications Sent (18, +28%)
  - Response Rate (39%, +28%)
  - Interview Rate (17%, +28%)
  - Avg. Time to Response (8 days, ↓2%)
- Application Status progress bars
- Applications Over Time bar chart
- Top Companies table with progress bars

**Status**: Needs to be created

#### 7. Settings (NEW PAGE)
**Figma Design**:
- Profile section:
  - Full Name input
  - Email input
  - Location input
  - Graduation Date
  - Resume Info textarea
- Job Search Preferences:
  - Auto-generate materials threshold (slider, default 8.5)
  - "Prioritize Orlando, FL positions" toggle
- API Configuration:
  - Claude API Key input (masked)
- Company Blacklist:
  - List of blacklisted companies with X to remove
  - "Add company name..." input
- Notifications:
  - Email notifications toggle
  - Browser notifications toggle
- Appearance:
  - Theme selector (Light, Dark, Auto)

**Status**: Needs to be created

#### 8. Navigation
**Figma Design**:
- Top navigation bar with icons:
  - Home (house icon)
  - Favorites (heart)
  - Briefcase
  - Attachments (paperclip)
  - Shuffle/Random
  - Analytics (chart)
  - Settings (gear)
- Current page highlighted in purple
- Dark background matching surface color

**Status**: Needs update

## Implementation Priority

### Phase 1: Core Updates (High Priority)
1. ✅ Update color palette (DONE)
2. Update Dashboard with new design
3. Update Swipe interface
4. Update navigation bar

### Phase 2: Feature Screens
5. Update Jobs List
6. Update Materials page
7. Update Pipeline/Applications

### Phase 3: New Features
8. Create Analytics page
9. Create Settings page
10. Add missing interactions

## Design System Components Needed

### Score Badges
- 9.0-10.0: Green circle background (`bg-success`)
- 8.0-8.9: Blue circle background (`bg-info`)
- 7.0-7.9: Yellow circle background (`bg-warning`)
- Below 7.0: Gray

### Status Badges
- Reviewing: Blue
- Materials Ready: Purple
- Applied: Orange
- Interview: Green
- Offer: Bright green
- Rejected: Red

### Company Avatars
- Circular with first letter
- Different colors per company
- Size variants: sm (32px), md (48px), lg (64px)

### Buttons
- Primary: Purple background, white text
- Secondary: Dark background with border
- Danger: Red background
- Sizes: sm, md, lg

### Cards
- Background: `#1E2433`
- Border: `#2A3142`
- Border radius: 16px (2xl)
- Padding: 24px (p-6)
- Hover: Slight shadow lift

## File Changes Needed

```
frontend/src/
├── pages/
│   ├── Dashboard.jsx (replace with DashboardNew.jsx)
│   ├── Swipe.jsx (major redesign)
│   ├── JobsList.jsx (update layout)
│   ├── Materials.jsx (update layout)
│   ├── Applications.jsx (update to match pipeline)
│   ├── Analytics.jsx (NEW - create from scratch)
│   └── Settings.jsx (NEW - create from scratch)
├── components/
│   ├── ScoreBadge.jsx (NEW)
│   ├── CompanyAvatar.jsx (NEW)
│   ├── StatusBadge.jsx (NEW)
│   └── StatsCard.jsx (NEW)
└── App.jsx (update navigation)
```

## Next Steps

1. Rename DashboardNew.jsx to Dashboard.jsx
2. Create new component files
3. Update each page systematically
4. Test all interactions
5. Verify color consistency
6. Check responsive design

## Notes

- All designs use dark mode by default
- Purple (#7C7CFF) is the primary brand color
- Icons from lucide-react match the Figma designs
- Maintain smooth animations on interactions
- Keep accessibility in mind (contrast ratios, focus states)
