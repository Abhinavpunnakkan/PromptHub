import express from 'express';
import Prompt from '../models/Prompt.js';

const router = express.Router();

// DELETE a prompt
router.delete('/:id', async (req, res) => {
  const promptId = req.params.id;

  try {
    const deleted = await Prompt.findByIdAndDelete(promptId);
    if (!deleted) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    res.status(200).json({ message: 'Prompt deleted successfully' });
  } catch (err) {
    console.error('Error deleting prompt:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /api/prompts?userId=abc&filter=private|liked|saved
router.get('/', async (req, res) => {
  try {
    const { userId, filter } = req.query;

    let query = {};
    if (filter === 'private') {
      query = { userId, isPublic: false };
    } else if (filter === 'public') {
      query = { userId, isPublic: true };
    } else {
      query = { userId }; // fallback to all prompts by user
    }

    const prompts = await Prompt.find(query).sort({ createdAt: -1 });
    res.json(prompts);
  } catch (err) {
    console.error("Fetch profile prompts failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const prompt = await Prompt.findByIdAndDelete(req.params.id);
    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }
    res.status(200).json({ message: 'Prompt deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete prompt' });
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

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const prompt = await Prompt.findByIdandUpdate(
            id,
            { $inc: {views: 1} },
            { new: true }
        );

        if (!prompt) {
            return res.status(404).json({message: 'Prompt not found'});
        }

        res.json(prompt);
    } catch (err) {
        console.error('Error fetching prompt: ', err);
        res.status(500).json({ message: 'Failed to fetch prompt' });;
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
