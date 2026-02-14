const Announcement = require("../models/Announcement");
const User = require("../models/User");

const createAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can create announcements" });
    }

    if (!req.user.community) {
      return res.status(400).json({ message: "Admin not assigned to community" });
    }

    const announcement = await Announcement.create({
      title: req.body.title,
      description: req.body.description,
      category: req.body.category,
      priority: req.body.priority,
      expiryDate: req.body.expiryDate,
      isPinned: req.body.isPinned,
      createdBy: req.user._id,
      community: req.user.community,
    });

    res.status(201).json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getCommunityAnnouncements = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user || !user.community) {
      return res.status(400).json({ message: 'User not assigned to a community' });
    }

    const now = new Date();
    const announcements = await Announcement.find({
      community: user.community,
      status: 'active',
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gt: now } }
      ]
    })
      .populate('createdBy', 'name')
      .sort({ isPinned: -1, createdAt: -1 });

    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAnnouncements = async (req, res) => {
  try {
    if (!req.user.community) {
      return res.status(400).json({ message: "User not part of any community" });
    }

    const page = Number(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const { category, priority } = req.query;

    let filter = {
      community: req.user.community,
      status: "active",
    };

    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const announcements = await Announcement.find({
      ...filter,
      $or: [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gte: new Date() } },
      ],
    })
      .populate("createdBy", "name")
      .sort({ isPinned: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can update" });
    }

    if (announcement.community.toString() !== req.user.community.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(announcement, req.body);

    await announcement.save();

    res.json(announcement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Only admins can delete" });
    }

    announcement.status = "expired";
    await announcement.save();

    res.json({ message: "Announcement removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createAnnouncement,
  getCommunityAnnouncements,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
};
