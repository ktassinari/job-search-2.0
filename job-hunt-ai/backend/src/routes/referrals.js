import express from 'express';
import {
  getAllReferrals,
  getReferralById,
  createReferral,
  updateReferral,
  deleteReferral,
  getReferralsByStatus,
  getReferralsByJobId,
  getReferralsByContactId
} from '../db/services.js';

const router = express.Router();

// GET /api/referrals - Get all referrals
router.get('/', (req, res) => {
  try {
    const { status, job_id, contact_id } = req.query;

    let referrals;
    if (status) {
      referrals = getReferralsByStatus(status);
    } else if (job_id) {
      referrals = getReferralsByJobId(job_id);
    } else if (contact_id) {
      referrals = getReferralsByContactId(contact_id);
    } else {
      referrals = getAllReferrals();
    }

    res.json({ success: true, data: referrals });
  } catch (error) {
    console.error('Error getting referrals:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/referrals/:id - Get single referral
router.get('/:id', (req, res) => {
  try {
    const referral = getReferralById(req.params.id);
    if (!referral) {
      return res.status(404).json({ success: false, error: 'Referral not found' });
    }
    res.json({ success: true, data: referral });
  } catch (error) {
    console.error('Error getting referral:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/referrals - Create new referral request
router.post('/', (req, res) => {
  try {
    const id = createReferral(req.body);
    const referral = getReferralById(id);
    res.json({ success: true, data: referral });
  } catch (error) {
    console.error('Error creating referral:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/referrals/:id - Update referral
router.put('/:id', (req, res) => {
  try {
    updateReferral(req.params.id, req.body);
    const referral = getReferralById(req.params.id);
    res.json({ success: true, data: referral });
  } catch (error) {
    console.error('Error updating referral:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/referrals/:id - Delete referral
router.delete('/:id', (req, res) => {
  try {
    deleteReferral(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting referral:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
