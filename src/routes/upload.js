const express = require('express');
const multer = require('multer');
const pdfService = require('../services/pdfService');
const aiService = require('../services/aiService');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


router.post('/process', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const question = req.body.question || '';

    if (!file) return res.status(400).json({ error: 'File required' });

    // Extract text
    const text = await pdfService.extractTextFromBuffer(file);

    // Build structured prompt + call AI
    const structuredJson = await aiService.extractStructuredJSON({ text, question });

    return res.json({ text, structuredJson });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
