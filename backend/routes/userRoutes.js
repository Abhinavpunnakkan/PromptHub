import express from "express";
import User from "../models/User.js";

const router = express.Router();

router.put("/:clerkId", async (req, res) => {
  const { clerkId } = req.params;
  const { username } = req.body;

  if (!username) return res.status(400).json({ message: "Username is required" });

  try {
    const existing = await User.findOne({ username });
    if (existing && existing.clerkId !== clerkId) {
      return res.status(409).json({ message: "Username already taken" });
    }

    const updated = await User.findOneAndUpdate({ clerkId }, { username }, { new: true });

    if (!updated) return res.status(404).json({ message: "User not found" });

    res.json(updated);
  } catch (err) {
    console.error("Error updating username:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
