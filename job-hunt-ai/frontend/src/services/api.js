const API_BASE = '/api';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

// ============ JOBS ============

export async function getJobs(filters = {}) {
  const params = new URLSearchParams();

  if (filters.status) params.append('status', filters.status);
  if (filters.minScore) params.append('minScore', filters.minScore);
  if (filters.search) params.append('search', filters.search);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);
  if (filters.order) params.append('order', filters.order);
  if (filters.limit) params.append('limit', filters.limit);
  if (filters.offset) params.append('offset', filters.offset);

  const query = params.toString();
  return request(`/jobs${query ? `?${query}` : ''}`);
}

export async function getJob(id) {
  return request(`/jobs/${id}`);
}

export async function updateJob(id, updates) {
  return request(`/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deleteJob(id) {
  return request(`/jobs/${id}`, {
    method: 'DELETE',
  });
}

export async function scoreJob(id) {
  return request(`/jobs/${id}/score`, {
    method: 'POST',
  });
}

export async function generateJobMaterials(id) {
  return request(`/jobs/${id}/generate`, {
    method: 'POST',
  });
}

// ============ SCRAPER ============

export async function scrapeJobs() {
  return request('/scrape', {
    method: 'POST',
  });
}

export async function scoreAllJobs() {
  return request('/scrape/score', {
    method: 'POST',
  });
}

export async function generateAllMaterials(minScore = 7) {
  return request('/scrape/generate', {
    method: 'POST',
    body: JSON.stringify({ minScore }),
  });
}

// ============ MATERIALS ============

export async function getMaterials(jobId) {
  return request(`/materials/job/${jobId}`);
}

// ============ APPLICATIONS ============

export async function getApplications(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);

  const query = params.toString();
  return request(`/applications${query ? `?${query}` : ''}`);
}

export async function getFollowUps() {
  return request('/applications/followups');
}

export async function createApplication(application) {
  return request('/applications', {
    method: 'POST',
    body: JSON.stringify(application),
  });
}

export async function updateApplication(id, updates) {
  return request(`/applications/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function applyToJob(jobId) {
  return request(`/applications/apply/${jobId}`, {
    method: 'POST',
  });
}

// ============ ANALYTICS ============

export async function getAnalytics() {
  return request('/analytics/overview');
}

export async function getNewJobsCount(since) {
  const params = new URLSearchParams();
  if (since) params.append('since', since);

  const query = params.toString();
  return request(`/analytics/new-jobs${query ? `?${query}` : ''}`);
}

// ============ PROFILE ============

export async function getProfile() {
  return request('/profile');
}

export async function updateProfile(updates) {
  return request('/profile', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// ============ SETTINGS ============

export async function getSettings() {
  return request('/settings');
}

export async function updateSettings(updates) {
  return request('/settings', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

// ============ SYSTEM ============

export async function getHealth() {
  return request('/health');
}
