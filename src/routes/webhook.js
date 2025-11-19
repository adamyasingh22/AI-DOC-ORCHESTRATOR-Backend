const express = require('express');
const axios = require('axios');
const router = express.Router();


router.post('/send-webhook', async (req, res) => {
  try {
    const { text, structuredJson, question, recipientEmail } = req.body;
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) return res.status(500).json({ error: 'n8n webhook not configured' });

    const payload = { text, structuredJson, question, recipientEmail };

    const n8nRes = await axios.post(webhookUrl, payload, { timeout: 30000 });

    // forward response from n8n to frontend
    return res.json({ n8n: n8nRes.data });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res.status(500).json({ error: 'Failed to call n8n', details: err.message });
  }
});

module.exports = router;
