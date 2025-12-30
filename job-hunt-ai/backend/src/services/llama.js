import axios from 'axios';
import { getProfile, getSettings } from '../db/services.js';

const OLLAMA_API = 'http://localhost:11434/api/generate';
const MODEL = 'deepseek-r1:8b'; // Using faster model

/**
 * Call Ollama's Llama 3.2 model with a prompt
 */
async function callLlama(prompt, temperature = 0.7) {
  try {
    const response = await axios.post(OLLAMA_API, {
      model: MODEL,
      prompt: prompt,
      stream: false,
      options: {
        temperature: temperature,
        num_predict: 1000
      }
    }, {
      timeout: 120000 // 120 second timeout (2 minutes)
    });

    return response.data.response;
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      throw new Error('Ollama is not running. Please start it with: ollama serve');
    }
    throw error;
  }
}

/**
 * Extract JSON from Llama response (it may include extra text)
 */
function extractJSON(text) {
  try {
    // First try to parse the whole response
    return JSON.parse(text);
  } catch {
    // Look for JSON block in the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[0]);
      } catch {
        // If that fails, try to find the last complete JSON object
        const matches = text.match(/\{[^{}]*\}/g);
        if (matches && matches.length > 0) {
          return JSON.parse(matches[matches.length - 1]);
        }
      }
    }
  }
  throw new Error('Could not extract JSON from response');
}

/**
 * Score a job using Llama 3.2
 */
export async function scoreJob(job) {
  const profile = getProfile() || {};
  const settings = getSettings() || {};

  const candidateName = profile.full_name || 'the candidate';
  const location = profile.location || 'Not specified';
  const graduationDate = profile.graduation_date || 'Not specified';
  const skills = profile.skills || 'Not specified';
  const summary = profile.summary || 'Not specified';

  const locationBoost = settings.prioritize_orlando && location.toLowerCase().includes('orlando')
    ? '\n- Orlando jobs: +0.5'
    : '';

  const prompt = `You are helping ${candidateName} find the perfect job.

ABOUT ${candidateName.toUpperCase().split(' ')[0] || 'CANDIDATE'}:
- Education: ${profile.education || 'Not specified'} ${graduationDate ? `(Graduation: ${graduationDate})` : ''}
- Location: ${location}
- Skills: ${skills}
- Summary: ${summary}
- Experience: ${profile.experience || 'Not specified'}
${profile.linkedin_url ? `- LinkedIn: ${profile.linkedin_url}` : ''}
${profile.portfolio_url ? `- Portfolio: ${profile.portfolio_url}` : ''}

JOB:
Title: ${job.title}
Company: ${job.company}
Location: ${job.location || 'Not specified'}
Description: ${job.description ? job.description.substring(0, 1000) : 'No description'}

Score 0-10 based on how well this job matches the candidate's profile, skills, and career goals. BE GENEROUS.

SCORING:
- 10 = Perfect match (aligns with all key skills, location, and career goals)
- 9 = Excellent match (strong alignment with skills and goals)
- 8 = Very strong match (good skill overlap and career fit)
- 7 = Good match (solid skill overlap, entry-level friendly)
- 6 = Worth considering (some skill overlap, interesting opportunity)
- 5 = Possible match (transferable skills, room to learn)
- 0 = Wrong (unpaid, irrelevant, or blacklisted)

BOOSTS:
- Remote work: +0.5${locationBoost}
- Entry-level/internship (if recent grad): +0.5

Return ONLY valid JSON, no other text:
{"score": <0-10>, "reason": "<1-2 sentences>", "keywords": ["skill1", "skill2", "skill3"]}`;

  try {
    const response = await callLlama(prompt, 0.5);
    const result = extractJSON(response);

    // Validate the response
    if (typeof result.score !== 'number' || result.score < 0 || result.score > 10) {
      console.error('Invalid score:', result.score);
      return { score: 5, reason: 'Could not parse score', keywords: [] };
    }

    return {
      score: Math.round(result.score),
      reason: result.reason || 'No reason provided',
      keywords: Array.isArray(result.keywords) ? result.keywords : []
    };
  } catch (error) {
    console.error('Error scoring job:', error.message);
    return { score: 5, reason: 'Error scoring job', keywords: [] };
  }
}

/**
 * Generate tailored resume and cover letter using Llama 3.2
 */
export async function generateMaterials(job) {
  const prompt = `Create tailored resume and cover letter for this job application.

CANDIDATE:
Kat Tassinari | Kissimmee, FL | kat.tassinari@scad.edu
SCAD BFA UX Design + Themed Entertainment Minor (Graduating June 2026)

SKILLS:
- UX Research & Design: User interviews, wireframing, prototyping, usability testing
- Design Tools: Figma, Adobe Creative Suite, Sketch
- 3D Design: Cinema 4D, Blender
- Project Management: Agile, cross-functional collaboration
- Themed Entertainment: Environmental design, narrative design, guest experience

KEY PROJECTS:
1. Snow: The Fairest (Red Dot Award Winner)
   - HHN-style haunted house experience
   - Environmental storytelling through UX design
   - Mentored by Bob Weis (Former Disney Imagineer)

2. Circe's Menagerie
   - Greek mythology themed nightclub
   - Immersive environmental design
   - Interactive guest experiences

3. MagicBand+ Sensory-Friendly Experience
   - Inclusive design for theme park guests
   - Accessibility-focused UX research
   - Disney park technology integration

JOB POSTING:
Title: ${job.title}
Company: ${job.company}
Description: ${job.description ? job.description.substring(0, 1500) : 'No description'}

Create professional, tailored application materials that:
1. Highlight relevant skills and projects
2. Show genuine enthusiasm for the role
3. Demonstrate fit with company culture
4. Keep resume to 1 page worth of content
5. Make cover letter warm and personable (3-4 paragraphs)

Return ONLY valid JSON, no other text:
{
  "resume": "<full resume text, organized with clear sections>",
  "coverLetter": "<full cover letter text, 3-4 paragraphs>",
  "projects": "<comma-separated list of 2-3 most relevant projects>"
}`;

  try {
    const response = await callLlama(prompt, 0.7);
    const result = extractJSON(response);

    return {
      resume: result.resume || 'Could not generate resume',
      coverLetter: result.coverLetter || 'Could not generate cover letter',
      projects: result.projects || 'Snow: The Fairest, Circe\'s Menagerie'
    };
  } catch (error) {
    console.error('Error generating materials:', error.message);
    throw error;
  }
}

/**
 * Check if Ollama is running
 */
export async function checkOllamaStatus() {
  try {
    const response = await axios.get('http://localhost:11434/api/tags', {
      timeout: 5000
    });
    return {
      running: true,
      models: response.data.models || []
    };
  } catch (error) {
    return {
      running: false,
      error: 'Ollama is not running'
    };
  }
}
