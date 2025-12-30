import db from './database.js';

// ============ JOBS CRUD ============

export function getAllJobs(filters = {}) {
  const {
    status,
    minScore,
    search,
    sortBy = 'created_at',
    order = 'DESC',
    limit = 50,
    offset = 0
  } = filters;

  let query = 'SELECT * FROM jobs WHERE 1=1';
  const params = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }

  if (minScore !== undefined) {
    query += ' AND score >= ?';
    params.push(minScore);
  }

  if (search) {
    query += ' AND (title LIKE ? OR company LIKE ? OR description LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ` ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  return db.prepare(query).all(...params);
}

export function getJobById(id) {
  return db.prepare('SELECT * FROM jobs WHERE id = ?').get(id);
}

export function createJob(job) {
  const {
    title,
    company,
    url,
    normalized_url,
    description,
    location,
    remote,
    salary_range,
    source
  } = job;

  const stmt = db.prepare(`
    INSERT INTO jobs (title, company, url, normalized_url, description, location, remote, salary_range, source)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = stmt.run(
      title,
      company,
      url,
      normalized_url,
      description,
      location,
      remote ? 1 : 0,
      salary_range,
      source
    );
    return result.lastInsertRowid;
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      console.log(`Duplicate job skipped: ${url}`);
      return null;
    }
    throw error;
  }
}

export function updateJob(id, updates) {
  const fields = [];
  const values = [];

  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  if (fields.length === 0) return;

  values.push(new Date().toISOString());
  values.push(id);

  const query = `UPDATE jobs SET ${fields.join(', ')}, updated_at = ? WHERE id = ?`;
  db.prepare(query).run(...values);
}

export function deleteJob(id) {
  db.prepare('DELETE FROM jobs WHERE id = ?').run(id);
}

export function getJobsWithoutScore() {
  return db.prepare('SELECT * FROM jobs WHERE score = 0 OR score IS NULL').all();
}

export function getJobsToScore(limit = null) {
  // Get jobs ordered by creation date (oldest first)
  // This allows re-scoring of all jobs, not just unscored ones
  let query = 'SELECT * FROM jobs ORDER BY created_at ASC';
  if (limit) {
    query += ` LIMIT ${limit}`;
  }
  return db.prepare(query).all();
}

export function getHighScoringJobsWithoutMaterials(minScore = 7) {
  return db.prepare(`
    SELECT j.* FROM jobs j
    LEFT JOIN materials m ON j.id = m.job_id
    WHERE j.score >= ? AND m.id IS NULL
    GROUP BY j.id
  `).all(minScore);
}

// ============ MATERIALS CRUD ============

export function getMaterialsByJobId(jobId) {
  return db.prepare('SELECT * FROM materials WHERE job_id = ?').all(jobId);
}

export function createMaterial(material) {
  const { job_id, type, content, projects } = material;

  const stmt = db.prepare(`
    INSERT INTO materials (job_id, type, content, projects)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(job_id, type, content, projects);
  return result.lastInsertRowid;
}

export function deleteMaterialsByJobId(jobId) {
  db.prepare('DELETE FROM materials WHERE job_id = ?').run(jobId);
}

// ============ APPLICATIONS CRUD ============

export function getAllApplications(filters = {}) {
  const { status } = filters;

  let query = `
    SELECT a.*, j.title, j.company, j.location
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    query += ' AND a.status = ?';
    params.push(status);
  }

  query += ' ORDER BY a.created_at DESC';

  return db.prepare(query).all(...params);
}

export function getApplicationById(id) {
  return db.prepare(`
    SELECT a.*, j.title, j.company, j.location
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.id = ?
  `).get(id);
}

export function getApplicationByJobId(jobId) {
  return db.prepare('SELECT * FROM applications WHERE job_id = ?').get(jobId);
}

export function createApplication(application) {
  const { job_id, date_applied, status, follow_up_date, notes } = application;

  const stmt = db.prepare(`
    INSERT INTO applications (job_id, date_applied, status, follow_up_date, notes)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    job_id,
    date_applied || new Date().toISOString().split('T')[0],
    status || 'preparing',
    follow_up_date,
    notes
  );

  return result.lastInsertRowid;
}

export function updateApplication(id, updates) {
  const fields = [];
  const values = [];

  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  if (fields.length === 0) return;

  values.push(id);

  const query = `UPDATE applications SET ${fields.join(', ')} WHERE id = ?`;
  db.prepare(query).run(...values);
}

export function getFollowUpsDue() {
  const today = new Date().toISOString().split('T')[0];

  return db.prepare(`
    SELECT a.*, j.title, j.company, j.location
    FROM applications a
    JOIN jobs j ON a.job_id = j.id
    WHERE a.follow_up_date <= ? AND a.follow_up_done = 0
    ORDER BY a.follow_up_date ASC
  `).all(today);
}

// ============ ANALYTICS ============

export function getAnalytics() {
  const totalJobs = db.prepare('SELECT COUNT(*) as count FROM jobs').get().count;
  const highScoringJobs = db.prepare('SELECT COUNT(*) as count FROM jobs WHERE score >= 7').get().count;
  const totalApplications = db.prepare('SELECT COUNT(*) as count FROM applications').get().count;
  const interviews = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status IN ('phone_screen', 'interview')").get().count;
  const offers = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'offer'").get().count;
  const rejected = db.prepare("SELECT COUNT(*) as count FROM applications WHERE status = 'rejected'").get().count;

  const responseRate = totalApplications > 0
    ? ((interviews + offers) / totalApplications * 100).toFixed(1)
    : 0;

  const jobsBySource = db.prepare(`
    SELECT source, COUNT(*) as count
    FROM jobs
    GROUP BY source
  `).all();

  const recentActivity = db.prepare(`
    SELECT
      'job' as type,
      title as name,
      company,
      created_at as date
    FROM jobs
    ORDER BY created_at DESC
    LIMIT 10
  `).all();

  return {
    totalJobs,
    highScoringJobs,
    totalApplications,
    interviews,
    offers,
    rejected,
    responseRate,
    jobsBySource,
    recentActivity
  };
}

export function getNewJobsCount(since = null) {
  if (!since) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    since = yesterday.toISOString();
  }

  return db.prepare('SELECT COUNT(*) as count FROM jobs WHERE created_at >= ?').get(since).count;
}

// ============ PROFILE CRUD ============

export function getProfile() {
  const profile = db.prepare('SELECT * FROM profile WHERE id = 1').get();

  // Create default profile if none exists
  if (!profile) {
    db.prepare(`
      INSERT INTO profile (id, full_name, email, location)
      VALUES (1, 'Kat Tassinari', 'kat@example.com', 'Kissimmee/Orlando, FL')
    `).run();
    return db.prepare('SELECT * FROM profile WHERE id = 1').get();
  }

  return profile;
}

export function updateProfile(updates) {
  const fields = [];
  const values = [];

  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  if (fields.length === 0) return;

  values.push(new Date().toISOString());

  const query = `UPDATE profile SET ${fields.join(', ')}, updated_at = ? WHERE id = 1`;
  db.prepare(query).run(...values);
}

// ============ PROJECTS CRUD ============

export function getAllProjects() {
  return db.prepare('SELECT * FROM projects WHERE is_active = 1 ORDER BY created_at DESC').all();
}

export function getProjectById(id) {
  return db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
}

export function createProject(project) {
  const { title, description, technologies, role, duration, highlights, url } = project;

  const stmt = db.prepare(`
    INSERT INTO projects (title, description, technologies, role, duration, highlights, url)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(title, description, technologies, role, duration, highlights, url);
  return result.lastInsertRowid;
}

export function updateProject(id, updates) {
  const fields = [];
  const values = [];

  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  if (fields.length === 0) return;

  values.push(id);

  const query = `UPDATE projects SET ${fields.join(', ')} WHERE id = ?`;
  db.prepare(query).run(...values);
}

export function deleteProject(id) {
  db.prepare('UPDATE projects SET is_active = 0 WHERE id = ?').run(id);
}

// ============ CONTACTS CRUD ============

export function getAllContacts(filters = {}) {
  const { company, search, sortBy = 'created_at', order = 'DESC' } = filters;

  let query = 'SELECT * FROM contacts WHERE is_active = 1';
  const params = [];

  if (company) {
    query += ' AND company = ?';
    params.push(company);
  }

  if (search) {
    query += ' AND (name LIKE ? OR company LIKE ? OR title LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ` ORDER BY ${sortBy} ${order}`;

  return db.prepare(query).all(...params);
}

export function getContactById(id) {
  return db.prepare('SELECT * FROM contacts WHERE id = ?').get(id);
}

export function createContact(contact) {
  const {
    name,
    email,
    phone,
    company,
    title,
    linkedin_url,
    notes,
    relationship,
    met_at,
    last_contact_date,
    next_followup_date,
    tags
  } = contact;

  const stmt = db.prepare(`
    INSERT INTO contacts (name, email, phone, company, title, linkedin_url, notes, relationship, met_at, last_contact_date, next_followup_date, tags)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    name,
    email,
    phone,
    company,
    title,
    linkedin_url,
    notes,
    relationship,
    met_at,
    last_contact_date,
    next_followup_date,
    tags
  );

  return result.lastInsertRowid;
}

export function updateContact(id, updates) {
  const fields = [];
  const values = [];

  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  if (fields.length === 0) return;

  values.push(new Date().toISOString());
  values.push(id);

  const query = `UPDATE contacts SET ${fields.join(', ')}, updated_at = ? WHERE id = ?`;
  db.prepare(query).run(...values);
}

export function deleteContact(id) {
  db.prepare('UPDATE contacts SET is_active = 0 WHERE id = ?').run(id);
}

export function getContactsNeedingFollowup() {
  const today = new Date().toISOString().split('T')[0];

  return db.prepare(`
    SELECT * FROM contacts
    WHERE is_active = 1 AND next_followup_date <= ?
    ORDER BY next_followup_date ASC
  `).all(today);
}

// ============ INTERACTIONS CRUD ============

export function getInteractionsByContactId(contactId) {
  return db.prepare(`
    SELECT * FROM interactions
    WHERE contact_id = ?
    ORDER BY interaction_date DESC
  `).all(contactId);
}

export function createInteraction(interaction) {
  const { contact_id, type, subject, notes, interaction_date } = interaction;

  const stmt = db.prepare(`
    INSERT INTO interactions (contact_id, type, subject, notes, interaction_date)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    contact_id,
    type,
    subject,
    notes,
    interaction_date || new Date().toISOString()
  );

  // Update last_contact_date on contact
  updateContact(contact_id, { last_contact_date: interaction_date || new Date().toISOString().split('T')[0] });

  return result.lastInsertRowid;
}

export function deleteInteraction(id) {
  db.prepare('DELETE FROM interactions WHERE id = ?').run(id);
}

// ============ JOB_CONTACTS CRUD ============

export function getContactsByJobId(jobId) {
  return db.prepare(`
    SELECT c.*, jc.relationship_type, jc.notes as connection_notes
    FROM contacts c
    JOIN job_contacts jc ON c.id = jc.contact_id
    WHERE jc.job_id = ?
  `).all(jobId);
}

export function getJobsByContactId(contactId) {
  return db.prepare(`
    SELECT j.*, jc.relationship_type, jc.notes as connection_notes
    FROM jobs j
    JOIN job_contacts jc ON j.id = jc.job_id
    WHERE jc.contact_id = ?
  `).all(contactId);
}

export function linkJobToContact(jobId, contactId, relationshipType, notes) {
  const stmt = db.prepare(`
    INSERT INTO job_contacts (job_id, contact_id, relationship_type, notes)
    VALUES (?, ?, ?, ?)
  `);

  const result = stmt.run(jobId, contactId, relationshipType, notes);
  return result.lastInsertRowid;
}

export function unlinkJobFromContact(jobId, contactId) {
  db.prepare('DELETE FROM job_contacts WHERE job_id = ? AND contact_id = ?').run(jobId, contactId);
}

// ============ REFERRALS CRUD ============

export function getAllReferrals(filters = {}) {
  const { status } = filters;

  let query = `
    SELECT r.*, j.title, j.company, c.name as contact_name
    FROM referrals r
    JOIN jobs j ON r.job_id = j.id
    JOIN contacts c ON r.contact_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (status) {
    query += ' AND r.status = ?';
    params.push(status);
  }

  query += ' ORDER BY r.created_at DESC';

  return db.prepare(query).all(...params);
}

export function getReferralsByJobId(jobId) {
  return db.prepare(`
    SELECT r.*, c.name, c.email, c.company as contact_company, c.title as contact_title
    FROM referrals r
    JOIN contacts c ON r.contact_id = c.id
    WHERE r.job_id = ?
    ORDER BY r.created_at DESC
  `).all(jobId);
}

export function createReferral(referral) {
  const { job_id, contact_id, status, requested_date, notes } = referral;

  const stmt = db.prepare(`
    INSERT INTO referrals (job_id, contact_id, status, requested_date, notes)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    job_id,
    contact_id,
    status || 'pending',
    requested_date || new Date().toISOString().split('T')[0],
    notes
  );

  return result.lastInsertRowid;
}

export function updateReferral(id, updates) {
  const fields = [];
  const values = [];

  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  if (fields.length === 0) return;

  values.push(new Date().toISOString());
  values.push(id);

  const query = `UPDATE referrals SET ${fields.join(', ')}, updated_at = ? WHERE id = ?`;
  db.prepare(query).run(...values);
}

export function getReferralById(id) {
  return db.prepare(`
    SELECT r.*, j.title, j.company, c.name as contact_name, c.title as contact_title
    FROM referrals r
    JOIN jobs j ON r.job_id = j.id
    JOIN contacts c ON r.contact_id = c.id
    WHERE r.id = ?
  `).get(id);
}

export function deleteReferral(id) {
  db.prepare('DELETE FROM referrals WHERE id = ?').run(id);
}

export function getReferralsByStatus(status) {
  return db.prepare(`
    SELECT r.*, j.title, j.company, c.name as contact_name, c.title as contact_title
    FROM referrals r
    JOIN jobs j ON r.job_id = j.id
    JOIN contacts c ON r.contact_id = c.id
    WHERE r.status = ?
    ORDER BY r.created_at DESC
  `).all(status);
}

export function getReferralsByContactId(contactId) {
  return db.prepare(`
    SELECT r.*, j.title, j.company
    FROM referrals r
    JOIN jobs j ON r.job_id = j.id
    WHERE r.contact_id = ?
    ORDER BY r.created_at DESC
  `).all(contactId);
}

// ============ EMAIL TEMPLATES CRUD ============

export function getAllEmailTemplates(category = null) {
  if (category) {
    return db.prepare('SELECT * FROM email_templates WHERE category = ? AND is_active = 1 ORDER BY name').all(category);
  }
  return db.prepare('SELECT * FROM email_templates WHERE is_active = 1 ORDER BY category, name').all();
}

export function getEmailTemplatesByCategory(category) {
  return db.prepare('SELECT * FROM email_templates WHERE category = ? AND is_active = 1 ORDER BY name').all(category);
}

export function getEmailTemplateById(id) {
  return db.prepare('SELECT * FROM email_templates WHERE id = ?').get(id);
}

export function createEmailTemplate(template) {
  const { name, subject, body, category, variables } = template;

  const stmt = db.prepare(`
    INSERT INTO email_templates (name, subject, body, category, variables)
    VALUES (?, ?, ?, ?, ?)
  `);

  const result = stmt.run(name, subject, body, category, variables);
  return result.lastInsertRowid;
}

export function updateEmailTemplate(id, updates) {
  const fields = [];
  const values = [];

  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  if (fields.length === 0) return;

  values.push(new Date().toISOString());
  values.push(id);

  const query = `UPDATE email_templates SET ${fields.join(', ')}, updated_at = ? WHERE id = ?`;
  db.prepare(query).run(...values);
}

export function deleteEmailTemplate(id) {
  db.prepare('UPDATE email_templates SET is_active = 0 WHERE id = ?').run(id);
}

// ============ EVENTS CRUD ============

export function getAllEvents() {
  return db.prepare('SELECT * FROM events ORDER BY date DESC').all();
}

export function getEventById(id) {
  return db.prepare('SELECT * FROM events WHERE id = ?').get(id);
}

export function createEvent(event) {
  const { name, type, date, location, notes, contacts_met } = event;

  const stmt = db.prepare(`
    INSERT INTO events (name, type, date, location, notes, contacts_met)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(name, type, date, location, notes, contacts_met);
  return result.lastInsertRowid;
}

export function updateEvent(id, updates) {
  const fields = [];
  const values = [];

  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  if (fields.length === 0) return;

  values.push(id);

  const query = `UPDATE events SET ${fields.join(', ')} WHERE id = ?`;
  db.prepare(query).run(...values);
}

export function deleteEvent(id) {
  db.prepare('DELETE FROM events WHERE id = ?').run(id);
}

// ============ COMPANIES CRUD ============

export function getAllCompanies(filters = {}) {
  const { isBlacklisted } = filters;

  let query = 'SELECT * FROM companies WHERE 1=1';
  const params = [];

  if (isBlacklisted !== undefined) {
    query += ' AND is_blacklisted = ?';
    params.push(isBlacklisted ? 1 : 0);
  }

  query += ' ORDER BY priority DESC, name ASC';

  return db.prepare(query).all(...params);
}

export function getCompanyByName(name) {
  return db.prepare('SELECT * FROM companies WHERE name = ?').get(name);
}

export function createCompany(company) {
  const {
    name,
    industry,
    size,
    location,
    website,
    culture_notes,
    interview_process,
    salary_insights,
    is_blacklisted,
    priority
  } = company;

  const stmt = db.prepare(`
    INSERT INTO companies (name, industry, size, location, website, culture_notes, interview_process, salary_insights, is_blacklisted, priority)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = stmt.run(
      name,
      industry,
      size,
      location,
      website,
      culture_notes,
      interview_process,
      salary_insights,
      is_blacklisted ? 1 : 0,
      priority || 0
    );
    return result.lastInsertRowid;
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return null;
    }
    throw error;
  }
}

export function updateCompany(name, updates) {
  const fields = [];
  const values = [];

  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = ?`);
    values.push(value);
  });

  if (fields.length === 0) return;

  values.push(new Date().toISOString());
  values.push(name);

  const query = `UPDATE companies SET ${fields.join(', ')}, updated_at = ? WHERE name = ?`;
  db.prepare(query).run(...values);
}

export function getBlacklistedCompanies() {
  return db.prepare('SELECT name FROM companies WHERE is_blacklisted = 1').all();
}

// ============ STATS CRUD ============

export function getStatsByDate(date) {
  return db.prepare('SELECT * FROM stats WHERE date = ?').get(date);
}

export function getStatsRange(startDate, endDate) {
  return db.prepare('SELECT * FROM stats WHERE date BETWEEN ? AND ? ORDER BY date ASC').all(startDate, endDate);
}

export function createOrUpdateStats(date, updates) {
  const existing = getStatsByDate(date);

  if (existing) {
    const fields = [];
    const values = [];

    Object.entries(updates).forEach(([key, value]) => {
      fields.push(`${key} = ${key} + ?`);
      values.push(value);
    });

    if (fields.length === 0) return;

    values.push(date);

    const query = `UPDATE stats SET ${fields.join(', ')} WHERE date = ?`;
    db.prepare(query).run(...values);
  } else {
    const stmt = db.prepare(`
      INSERT INTO stats (date, jobs_scraped, jobs_scored, materials_generated, applications_sent, responses_received)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      date,
      updates.jobs_scraped || 0,
      updates.jobs_scored || 0,
      updates.materials_generated || 0,
      updates.applications_sent || 0,
      updates.responses_received || 0
    );
  }
}

// ============ SETTINGS CRUD ============

export function getSetting(key) {
  const result = db.prepare('SELECT value FROM settings WHERE key = ?').get(key);
  return result ? result.value : null;
}

export function setSetting(key, value) {
  const existing = getSetting(key);

  if (existing !== null) {
    db.prepare('UPDATE settings SET value = ?, updated_at = ? WHERE key = ?')
      .run(value, new Date().toISOString(), key);
  } else {
    db.prepare('INSERT INTO settings (key, value) VALUES (?, ?)').run(key, value);
  }
}

export function getAllSettings() {
  return db.prepare('SELECT * FROM settings').all();
}

export function getSettings() {
  const rows = db.prepare('SELECT * FROM settings').all();

  // Convert rows to object
  const settings = {};
  rows.forEach(row => {
    try {
      // Try to parse as JSON first
      settings[row.key] = JSON.parse(row.value);
    } catch {
      // If not JSON, use as-is
      settings[row.key] = row.value;
    }
  });

  return settings;
}

export function updateSettings(updates) {
  Object.entries(updates).forEach(([key, value]) => {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

    db.prepare(`
      INSERT INTO settings (key, value, updated_at)
      VALUES (?, ?, ?)
      ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = ?
    `).run(key, stringValue, new Date().toISOString(), stringValue, new Date().toISOString());
  });
}
