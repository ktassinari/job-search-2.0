import axios from 'axios';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import { createJob } from '../db/services.js';

const rssParser = new Parser();

// Blacklisted companies
const BLACKLIST = ['tesla', 'dataannotation', 'data annotation'];

// Tracking parameters to remove from URLs
const TRACKING_PARAMS = [
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'ref', 'source', 'track', 'fbclid', 'gclid', 'msclkid',
  'referer', 'referrer', 'origin', 'campaign'
];

/**
 * Normalize URL by removing tracking parameters and standardizing format
 */
function normalizeUrl(url) {
  try {
    const urlObj = new URL(url);

    // Remove www.
    urlObj.hostname = urlObj.hostname.replace(/^www\./, '');

    // Remove tracking parameters
    TRACKING_PARAMS.forEach(param => {
      urlObj.searchParams.delete(param);
    });

    // Remove trailing slash
    let normalized = urlObj.toString().toLowerCase();
    if (normalized.endsWith('/')) {
      normalized = normalized.slice(0, -1);
    }

    return normalized;
  } catch (error) {
    return url.toLowerCase();
  }
}

/**
 * Check if job should be filtered out
 */
function shouldFilterJob(job) {
  // Check blacklist
  const companyLower = (job.company || '').toLowerCase();
  if (BLACKLIST.some(blocked => companyLower.includes(blocked))) {
    return true;
  }

  // Check for missing critical data
  if (!job.title || !job.company || !job.url) {
    return true;
  }

  // Check for unpaid/volunteer (basic check)
  const titleLower = job.title.toLowerCase();
  const descLower = (job.description || '').toLowerCase();

  if (titleLower.includes('unpaid') || titleLower.includes('volunteer')) {
    return true;
  }

  if (descLower.includes('unpaid internship') || descLower.includes('volunteer position')) {
    return true;
  }

  return false;
}

/**
 * Detect if job is remote
 */
function isRemote(location, description) {
  const locationLower = (location || '').toLowerCase();
  const descLower = (description || '').toLowerCase();

  return locationLower.includes('remote') ||
         descLower.includes('remote') ||
         descLower.includes('work from home');
}

/**
 * Scrape LinkedIn jobs via public guest API
 */
async function scrapeLinkedIn(searchQuery) {
  console.log(`🔍 Scraping LinkedIn: ${searchQuery}`);
  const jobs = [];

  try {
    // Fetch multiple pages to get more results
    for (let page = 0; page < 2; page++) {
      const start = page * 25; // LinkedIn shows ~25 jobs per page
      const url = `https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?keywords=${encodeURIComponent(searchQuery)}&location=United%20States&f_TPR=r86400&start=${start}`;

      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);

      let pageJobs = 0;
      $('.job-search-card').each((i, elem) => {
        const title = $(elem).find('.base-search-card__title').text().trim();
        const company = $(elem).find('.base-search-card__subtitle').text().trim();
        const location = $(elem).find('.job-search-card__location').text().trim();
        const url = $(elem).find('.base-card__full-link').attr('href');

        if (title && company && url) {
          const titleLower = title.toLowerCase();

          // Filter for relevant UX/design roles ONLY
          const isRelevant = (
            titleLower.includes('ux designer') ||
            titleLower.includes('ux researcher') ||
            titleLower.includes('user experience') ||
            titleLower.includes('product designer') ||
            titleLower.includes('interaction designer') ||
            titleLower.includes('experience designer') ||
            titleLower.includes('ui/ux') ||
            titleLower.includes('ui ux') ||
            titleLower.includes('themed entertainment') ||
            titleLower.includes('theme park') ||
            titleLower.includes('concept designer') ||
            titleLower.includes('immersive')
          );

          // Exclude non-UX roles
          const isExcluded = titleLower.includes('graphic designer') ||
                            titleLower.includes('web designer') ||
                            titleLower.includes('visual designer') ||
                            titleLower.includes('motion designer') ||
                            titleLower.includes('content designer') ||
                            titleLower.includes('brand designer') ||
                            titleLower.includes('marketing') ||
                            titleLower.includes('social media') ||
                            titleLower.includes('engineer') ||
                            titleLower.includes('developer') ||
                            titleLower.includes('software');

          if (isRelevant && !isExcluded) {
            const job = {
              title,
              company,
              location: location || 'Not specified',
              url,
              normalized_url: normalizeUrl(url),
              description: $(elem).text().trim().substring(0, 500),
              remote: isRemote(title, location),
              salary_range: null,
              source: 'LinkedIn'
            };

            if (!shouldFilterJob(job)) {
              jobs.push(job);
              pageJobs++;
            }
          }
        }
      });

      // If no jobs found on this page, stop paginating
      if (pageJobs === 0) break;

      // Rate limiting between pages
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`✅ Found ${jobs.length} jobs from LinkedIn for "${searchQuery}"`);
    return jobs;
  } catch (error) {
    console.error(`Error scraping LinkedIn for "${searchQuery}":`, error.message);
    return [];
  }
}

/**
 * Scrape Remotive API (free, no auth required)
 */
async function scrapeRemotive() {
  try {
    console.log('🔍 Fetching jobs from Remotive API...');

    const response = await axios.get('https://remotive.com/api/remote-jobs?category=design', {
      timeout: 10000
    });

    const jobs = [];

    if (response.data && response.data.jobs) {
      for (const item of response.data.jobs) {
        // Filter for UX/design/themed entertainment jobs ONLY
        const titleLower = item.title.toLowerCase();
        const descLower = (item.description || '').toLowerCase();

        const isRelevant = (
          titleLower.includes('ux designer') ||
          titleLower.includes('ux researcher') ||
          titleLower.includes('user experience') ||
          titleLower.includes('product designer') ||
          titleLower.includes('interaction designer') ||
          titleLower.includes('experience designer') ||
          titleLower.includes('ui/ux') ||
          titleLower.includes('ui ux') ||
          titleLower.includes('themed entertainment') ||
          titleLower.includes('theme park') ||
          titleLower.includes('concept designer') ||
          titleLower.includes('immersive') ||
          titleLower.includes('experiential design') ||
          descLower.includes('theme park') ||
          descLower.includes('themed entertainment')
        );

        const isExcluded = titleLower.includes('engineer') ||
                          titleLower.includes('developer') ||
                          titleLower.includes('software') ||
                          titleLower.includes('backend') ||
                          titleLower.includes('frontend') ||
                          titleLower.includes('marketing') ||
                          titleLower.includes('sales');

        if (isRelevant && !isExcluded) {
          const job = {
            title: item.title,
            company: item.company_name,
            url: item.url,
            normalized_url: normalizeUrl(item.url),
            description: item.description ? item.description.substring(0, 2000) : 'No description',
            location: item.candidate_required_location || 'Remote',
            remote: true,
            salary_range: item.salary || null,
            source: 'Remotive'
          };

          if (!shouldFilterJob(job)) {
            jobs.push(job);
          }
        }
      }
    }

    console.log(`✅ Found ${jobs.length} relevant jobs from Remotive`);
    return jobs;
  } catch (error) {
    console.error('Error fetching Remotive jobs:', error.message);
    return [];
  }
}

/**
 * Scrape We Work Remotely (RSS feed)
 */
async function scrapeWeWorkRemotely() {
  try {
    console.log('🔍 Fetching jobs from We Work Remotely RSS...');

    const RSS_URL = 'https://weworkremotely.com/categories/remote-design-jobs.rss';
    const feed = await rssParser.parseURL(RSS_URL);
    const jobs = [];

    for (const item of feed.items) {
      const title = item.title || '';
      const titleLower = title.toLowerCase();

      // Filter for UX/design/themed entertainment jobs ONLY
      const isRelevant = (
        titleLower.includes('ux designer') ||
        titleLower.includes('ux researcher') ||
        titleLower.includes('user experience') ||
        titleLower.includes('product designer') ||
        titleLower.includes('interaction designer') ||
        titleLower.includes('experience designer') ||
        titleLower.includes('ui/ux') ||
        titleLower.includes('ui ux') ||
        titleLower.includes('themed entertainment') ||
        titleLower.includes('theme park') ||
        titleLower.includes('concept designer') ||
        titleLower.includes('immersive') ||
        titleLower.includes('experiential design')
      );

      const isExcluded = titleLower.includes('engineer') ||
                        titleLower.includes('developer') ||
                        titleLower.includes('software') ||
                        titleLower.includes('backend') ||
                        titleLower.includes('frontend') ||
                        titleLower.includes('marketing') ||
                        titleLower.includes('sales');

      if (isRelevant && !isExcluded) {
        const job = {
          title: title,
          company: item.creator || 'Unknown',
          url: item.link,
          normalized_url: normalizeUrl(item.link),
          description: item.contentSnippet || item.content || 'No description',
          location: 'Remote',
          remote: true,
          salary_range: null,
          source: 'WeWorkRemotely'
        };

        if (!shouldFilterJob(job)) {
          jobs.push(job);
        }
      }
    }

    console.log(`✅ Found ${jobs.length} relevant jobs from We Work Remotely`);
    return jobs;
  } catch (error) {
    console.error('Error scraping We Work Remotely:', error.message);
    return [];
  }
}

/**
 * Scrape RemoteOK (API endpoint)
 */
async function scrapeRemoteOK() {
  try {
    console.log('🔍 Fetching jobs from RemoteOK...');

    const response = await axios.get('https://remoteok.com/api', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; JobHuntAI/1.0)'
      },
      timeout: 10000
    });

    const jobs = [];

    if (response.data && Array.isArray(response.data)) {
      // First item is metadata, skip it
      const jobsData = response.data.slice(1);

      for (const item of jobsData) {
        const titleLower = (item.position || '').toLowerCase();
        const descLower = (item.description || '').toLowerCase();
        const tags = (item.tags || []).join(' ').toLowerCase();

        // Filter for UX/design/themed entertainment jobs ONLY
        // Must explicitly match target roles - avoid broad matches
        const isRelevant = (
          // UX roles
          titleLower.includes('ux designer') ||
          titleLower.includes('ux researcher') ||
          titleLower.includes('user experience') ||
          titleLower.includes('product designer') ||
          titleLower.includes('interaction designer') ||
          titleLower.includes('experience designer') ||
          titleLower.includes('ui/ux') ||
          titleLower.includes('ui ux') ||
          // Themed entertainment roles
          titleLower.includes('themed entertainment') ||
          titleLower.includes('theme park') ||
          titleLower.includes('concept designer') ||
          titleLower.includes('immersive') ||
          titleLower.includes('experiential design') ||
          // Explicit UX tags
          (tags.includes('ux') && !tags.includes('backend') && !tags.includes('devops'))
        );

        // Exclude non-UX roles explicitly
        const isExcluded = titleLower.includes('engineer') ||
                          titleLower.includes('developer') ||
                          titleLower.includes('software') ||
                          titleLower.includes('backend') ||
                          titleLower.includes('frontend') ||
                          titleLower.includes('full stack') ||
                          titleLower.includes('devops') ||
                          titleLower.includes('data ') ||
                          titleLower.includes('analyst') ||
                          titleLower.includes('marketing') ||
                          titleLower.includes('sales') ||
                          titleLower.includes('graphic designer') ||
                          titleLower.includes('web designer');

        if (isRelevant && !isExcluded && item.position && item.company) {
          const job = {
            title: item.position,
            company: item.company,
            url: item.url || `https://remoteok.com/remote-jobs/${item.slug}`,
            normalized_url: normalizeUrl(item.url || `https://remoteok.com/remote-jobs/${item.slug}`),
            description: item.description || 'No description',
            location: item.location || 'Remote',
            remote: true,
            salary_range: item.salary_min && item.salary_max ? `$${item.salary_min} - $${item.salary_max}` : null,
            source: 'RemoteOK'
          };

          if (!shouldFilterJob(job)) {
            jobs.push(job);
          }
        }
      }
    }

    console.log(`✅ Found ${jobs.length} relevant jobs from RemoteOK`);
    return jobs;
  } catch (error) {
    console.error('Error fetching RemoteOK jobs:', error.message);
    return [];
  }
}

/**
 * Scrape Indeed via RSS
 */
async function scrapeIndeedRSS(searchQuery, location = 'Remote') {
  try {
    console.log(`🔍 Scraping Indeed RSS: ${searchQuery} in ${location}`);
    const jobs = [];

    const url = `https://www.indeed.com/rss?q=${encodeURIComponent(searchQuery)}&l=${encodeURIComponent(location)}`;
    const feed = await rssParser.parseURL(url);

    for (const item of feed.items) {
      // Extract company and location from title (Indeed format: "Title - Company - Location")
      const titleParts = item.title.split(' - ');
      const title = titleParts[0] || item.title;
      const company = titleParts[1] || 'Unknown';
      const jobLocation = titleParts[2] || location || 'Not specified';

      const job = {
        title: title.trim(),
        company: company.trim(),
        location: jobLocation.trim(),
        url: item.link,
        normalized_url: normalizeUrl(item.link),
        description: item.contentSnippet || item.description || 'No description',
        remote: isRemote(title, jobLocation),
        salary_range: null,
        source: 'Indeed'
      };

      if (!shouldFilterJob(job)) {
        jobs.push(job);
      }
    }

    console.log(`✅ Found ${jobs.length} jobs from Indeed RSS for "${searchQuery}"`);
    return jobs;
  } catch (error) {
    console.error(`Error scraping Indeed RSS for "${searchQuery}":`, error.message);
    return [];
  }
}

/**
 * Scrape EntertainmentCareers.net RSS feed
 */
async function scrapeEntertainmentCareers() {
  try {
    const RSS_URL = 'https://www.entertainmentcareers.net/rss/all/';

    const feed = await rssParser.parseURL(RSS_URL);
    const jobs = [];

    for (const item of feed.items) {
      // Parse the RSS item
      const $ = cheerio.load(item.content || item.description || '');

      const job = {
        title: item.title,
        company: item.creator || 'Unknown',
        url: item.link,
        normalized_url: normalizeUrl(item.link),
        description: $.text().substring(0, 2000),
        location: extractLocation(item.title, $.text()),
        remote: isRemote(item.title, $.text()),
        salary_range: null,
        source: 'EntertainmentCareers'
      };

      if (!shouldFilterJob(job)) {
        jobs.push(job);
      }
    }

    console.log(`✅ Scraped ${jobs.length} jobs from EntertainmentCareers.net`);
    return jobs;
  } catch (error) {
    console.error('Error scraping EntertainmentCareers:', error.message);
    return [];
  }
}

/**
 * Extract location from text
 */
function extractLocation(title, description) {
  // Common location patterns
  const locationPatterns = [
    /(?:Orlando|Kissimmee|Tampa|Miami|Los Angeles|Anaheim|Glendale),?\s*(?:FL|CA)?/gi,
    /\b(?:Florida|California)\b/gi
  ];

  for (const pattern of locationPatterns) {
    const match = title.match(pattern) || description.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return 'Remote';
}

/**
 * Main scraping function
 */
export async function scrapeAllJobs() {
  console.log('🔍 Starting job scraping...');

  const searchQueries = [
    'UX Designer Orlando',
    'Product Designer',
    'UX Researcher',
    'Experience Designer',
    'Interaction Designer',
    'Concept Designer theme park',
    'Themed Entertainment Designer'
  ];

  const allJobs = [];

  // Scrape LinkedIn (most comprehensive source)
  for (const query of searchQueries) {
    const linkedInJobs = await scrapeLinkedIn(query);
    allJobs.push(...linkedInJobs);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Scrape Indeed RSS
  const indeedSearches = [
    { q: 'UX designer', l: 'Remote' },
    { q: 'Experience designer', l: 'Orlando, FL' },
    { q: 'Product designer', l: 'Remote' },
    { q: 'Themed entertainment', l: '' },
  ];

  for (const search of indeedSearches) {
    const indeedJobs = await scrapeIndeedRSS(search.q, search.l);
    allJobs.push(...indeedJobs);
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Scrape from free job board APIs and RSS feeds
  const remotiveJobs = await scrapeRemotive();
  allJobs.push(...remotiveJobs);

  await new Promise(resolve => setTimeout(resolve, 500));

  const remoteOKJobs = await scrapeRemoteOK();
  allJobs.push(...remoteOKJobs);

  await new Promise(resolve => setTimeout(resolve, 500));

  const weworkRemotelyJobs = await scrapeWeWorkRemotely();
  allJobs.push(...weworkRemotelyJobs);

  await new Promise(resolve => setTimeout(resolve, 500));

  // Try EntertainmentCareers RSS (may be down)
  const entertainmentJobs = await scrapeEntertainmentCareers();
  allJobs.push(...entertainmentJobs);

  // Save jobs to database
  let savedCount = 0;
  let duplicateCount = 0;

  for (const job of allJobs) {
    const jobId = createJob(job);
    if (jobId) {
      savedCount++;
    } else {
      duplicateCount++;
    }
  }

  console.log(`✅ Scraping complete!`);
  console.log(`   Saved: ${savedCount} new jobs`);
  console.log(`   Skipped: ${duplicateCount} duplicates`);

  return {
    total: allJobs.length,
    saved: savedCount,
    duplicates: duplicateCount
  };
}

/**
 * Advanced scraping with Puppeteer (for future implementation)
 *
 * To implement real LinkedIn/Indeed scraping:
 * 1. Install: npm install puppeteer
 * 2. Use headless browser to navigate and extract data
 * 3. Handle authentication for LinkedIn
 * 4. Rotate user agents and add delays to avoid detection
 * 5. Consider using proxies for large-scale scraping
 */
export async function scrapeWithBrowser() {
  console.log('⚠️  Browser-based scraping not implemented yet.');
  console.log('   Install puppeteer and implement authenticated scraping for production use.');
  return [];
}
