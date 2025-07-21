import express from 'express';
import Prompt from '../models/Prompt.js';
import User from '../models/User.js';


const router = express.Router();

// GET Public Prompts (Home)

router.get('/', async (req, res) => {
  try {
    const prompts = await Prompt.find({ isPublic: true }).sort({ createdAt: -1 });
    res.json(prompts);
  } catch (err) {
    console.error("Failed to fetch public prompts:", err);
    res.status(500).json({ message: "Server error" });
  }
});


//  GET Prompts by userId (for profile)
//  /api/prompts/user/:userId?filter=private|public

router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const { filter } = req.query;

  try {
    let query = { userId };

    if (filter === 'private') query.isPublic = false;
    else if (filter === 'public') query.isPublic = true;

    const prompts = await Prompt.find(query).sort({ createdAt: -1 });
    res.json(prompts);
  } catch (err) {
    console.error("Fetch user prompts failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//  GET Prompt by ID (increment view)
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const prompt = await Prompt.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!prompt) {
      return res.status(404).json({ message: 'Prompt not found' });
    }

    res.json(prompt);
  } catch (err) {
    console.error('Error fetching prompt: ', err);
    res.status(500).json({ message: 'Failed to fetch prompt' });
  }
});

//  POST new prompt
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

//  DELETE prompt
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

//  PUT upvote / remove upvote
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

// PUT /api/users/:clerkId
router.put('/:clerkId', async (req, res) => {
  const { clerkId } = req.params;
  const { username } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      { username },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (err) {
    console.error("Failed to update user:", err);
    res.status(500).json({ message: "Server error" });
  }
});


export default router;
