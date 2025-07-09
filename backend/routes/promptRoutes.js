import express from 'express';
import Prompt from '../models/Prompt.js';

const router = express.Router();

// POST /api/prompts
router.post('/', async (req, res) => {
  const { userId, title, content, tags } = req.body;

  if (!userId || !title || !content) {
    return res.status(400).json({ message: 'Missing userId, title or content' });
  }

  try {
    const newPrompt = new Prompt({
      userId,
      title,
      content,
      tags: Array.isArray(tags) ? tags : [],
    });

    await newPrompt.save();
    res.status(201).json(newPrompt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating prompt' });
  }
});


// GET /api/prompts
router.get('/', async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ createdAt: -1 });
    res.json(prompts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching prompts' });
  }
});


export default router;
