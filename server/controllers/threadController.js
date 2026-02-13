const Thread = require("../models/Thread");

const createThread = async (req, res) => {
  try {
    if (!req.user.community) {
      return res.status(400).json({ message: "User not part of any community" });
    }

    const { title, description, type } = req.body;

    const thread = await Thread.create({
      title,
      description,
      type,
      community: req.user.community,
      createdBy: req.user._id,
      participants: [req.user._id],
    });

    res.status(201).json(thread);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getThreads = async (req, res) => {
  try {
    const { type } = req.query;

    let filter = {
      community: req.user.community,
    };

    if (type) filter.type = type;

    const threads = await Thread.find(filter)
      .populate("createdBy", "name")
      .sort({ lastMessageAt: -1 });

    res.json(threads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const lockThread = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can lock threads" });
    }

    const thread = await Thread.findById(req.params.id);

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }

    thread.isLocked = true;
    await thread.save();

    res.json({ message: "Thread locked" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createThread,
  getThreads,
};
