import express from 'express';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  getContactsNeedingFollowup,
  getInteractionsByContactId,
  createInteraction,
  deleteInteraction,
  getContactsByJobId,
  getJobsByContactId,
  linkJobToContact,
  unlinkJobFromContact
} from '../db/services.js';

const router = express.Router();

// ============ CONTACTS ============

// GET /api/contacts - Get all contacts
router.get('/', (req, res) => {
  try {
    const { company, search, sortBy, order } = req.query;
    const contacts = getAllContacts({ company, search, sortBy, order });
    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Error getting contacts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/contacts/followups - Get contacts needing follow-up
router.get('/followups', (req, res) => {
  try {
    const contacts = getContactsNeedingFollowup();
    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error('Error getting follow-ups:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/contacts/:id - Get single contact
router.get('/:id', (req, res) => {
  try {
    const contact = getContactById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact not found' });
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    console.error('Error getting contact:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/contacts - Create new contact
router.post('/', (req, res) => {
  try {
    const id = createContact(req.body);
    const contact = getContactById(id);
    res.json({ success: true, data: contact });
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/contacts/:id - Update contact
router.put('/:id', (req, res) => {
  try {
    updateContact(req.params.id, req.body);
    const contact = getContactById(req.params.id);
    res.json({ success: true, data: contact });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/contacts/:id - Delete contact
router.delete('/:id', (req, res) => {
  try {
    deleteContact(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ INTERACTIONS ============

// GET /api/contacts/:id/interactions - Get interactions for contact
router.get('/:id/interactions', (req, res) => {
  try {
    const interactions = getInteractionsByContactId(req.params.id);
    res.json({ success: true, data: interactions });
  } catch (error) {
    console.error('Error getting interactions:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/contacts/:id/interactions - Create interaction
router.post('/:id/interactions', (req, res) => {
  try {
    const interactionData = {
      ...req.body,
      contact_id: req.params.id
    };
    const id = createInteraction(interactionData);
    res.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Error creating interaction:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/contacts/:contactId/interactions/:interactionId - Delete interaction
router.delete('/:contactId/interactions/:interactionId', (req, res) => {
  try {
    deleteInteraction(req.params.interactionId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting interaction:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ============ JOB-CONTACT LINKING ============

// GET /api/contacts/:id/jobs - Get jobs associated with contact
router.get('/:id/jobs', (req, res) => {
  try {
    const jobs = getJobsByContactId(req.params.id);
    res.json({ success: true, data: jobs });
  } catch (error) {
    console.error('Error getting jobs for contact:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/contacts/:contactId/jobs/:jobId - Link job to contact
router.post('/:contactId/jobs/:jobId', (req, res) => {
  try {
    const { relationship_type, notes } = req.body;
    const id = linkJobToContact(req.params.jobId, req.params.contactId, relationship_type, notes);
    res.json({ success: true, data: { id } });
  } catch (error) {
    console.error('Error linking job to contact:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/contacts/:contactId/jobs/:jobId - Unlink job from contact
router.delete('/:contactId/jobs/:jobId', (req, res) => {
  try {
    unlinkJobFromContact(req.params.jobId, req.params.contactId);
    res.json({ success: true });
  } catch (error) {
    console.error('Error unlinking job from contact:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
