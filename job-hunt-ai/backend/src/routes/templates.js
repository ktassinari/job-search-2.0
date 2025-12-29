import express from 'express';
import {
  getAllEmailTemplates,
  getEmailTemplateById,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  getEmailTemplatesByCategory
} from '../db/services.js';

const router = express.Router();

// GET /api/templates - Get all email templates
router.get('/', (req, res) => {
  try {
    const { category } = req.query;

    let templates;
    if (category) {
      templates = getEmailTemplatesByCategory(category);
    } else {
      templates = getAllEmailTemplates();
    }

    res.json({ success: true, data: templates });
  } catch (error) {
    console.error('Error getting templates:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/templates/:id - Get single template
router.get('/:id', (req, res) => {
  try {
    const template = getEmailTemplateById(req.params.id);
    if (!template) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }
    res.json({ success: true, data: template });
  } catch (error) {
    console.error('Error getting template:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/templates - Create new template
router.post('/', (req, res) => {
  try {
    const id = createEmailTemplate(req.body);
    const template = getEmailTemplateById(id);
    res.json({ success: true, data: template });
  } catch (error) {
    console.error('Error creating template:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// PUT /api/templates/:id - Update template
router.put('/:id', (req, res) => {
  try {
    updateEmailTemplate(req.params.id, req.body);
    const template = getEmailTemplateById(req.params.id);
    res.json({ success: true, data: template });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE /api/templates/:id - Delete template
router.delete('/:id', (req, res) => {
  try {
    deleteEmailTemplate(req.params.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting template:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
