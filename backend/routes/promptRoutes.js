import express from 'express';
import Prompt from '../models/Prompt.js';

const router = express.Router();

// GET /api/prompts
router.get('/', async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ createdAt: -1 });
    res.json(prompts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch prompts' });
  }
});

// POST /api/prompts
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      author,
      title,
      content,
      tags,
      category,
      models,
      isPublic,
    } = req.body;

    const newPrompt = new Prompt({
      userId,
      author,
      title,
      content,
      tags,
      category,
      models,
      isPublic,
    });

    await newPrompt.save();
    res.status(201).json(newPrompt);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error creating prompt' });
  }
});

// PUT /api/prompts/:id/upvote
router.put('/:id/upvote', async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body; // either 'upvote' or 'remove'

    const increment = action === 'upvote' ? 1 : -1;

    const prompt = await Prompt.findByIdAndUpdate(
      id,
      { $inc: { upvotes: increment } },
      { new: true }
    );

    if (!prompt) return res.status(404).json({ message: 'Prompt not found' });

    res.json({ upvotes: prompt.upvotes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update upvotes' });
  }
});


export default router;
