const Thread = require("../models/Thread");
const Message = require("../models/Message");

const createMessage = async (req, res) => {
  try {
    const thread = await Thread.findById(req.params.threadId);

    if (!thread) {
      return res.status(404).json({ message: "Thread not found" });
    }


    if (thread.community.toString() !== req.user.community.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const message = await Message.create({
      thread: thread._id,
      sender: req.user._id,
      content: req.body.content,
    });

    // Update thread activity
    thread.lastMessageAt = new Date();
    thread.messageCount += 1;

    if (!thread.participants.includes(req.user._id)) {
      thread.participants.push(req.user._id);
    }

    await thread.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ thread: req.params.threadId })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMessage,
  getMessages,
};
