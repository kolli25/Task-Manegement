const express = require('express');
const router = express.Router();
const Document = require('../models/document.model');

// GET all documents (exclude soft deleted)
router.get('/', async (req, res) => {
  try {
    const documents = await Document.find({ isDeleted: false })
      .sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single document
router.get('/:id', async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);
    res.json(document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create document
router.post('/', async (req, res) => {
  try {
    const document = new Document(req.body);
    const saved = await document.save();
    res.json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update document
router.put('/:id', async (req, res) => {
  try {
    const document = await Document.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    );
    res.json(document);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    // ✅ Don't actually delete!
    // Just set isDeleted = true
    await Document.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true }
    );
    res.json({ message: 'Document soft deleted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;