const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  createAnnouncement,
  getAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} = require("../controllers/announcementController");

router.post("/", auth, createAnnouncement);
router.get("/", auth, getAnnouncements);
router.put("/:id", auth, updateAnnouncement);
router.delete("/:id", auth, deleteAnnouncement);

module.exports = router;
