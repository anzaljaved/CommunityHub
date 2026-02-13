const express = require("express");
const router = express.Router({ mergeParams: true });
const auth = require("../middleware/auth");

const {
  createMessage,
  getMessages,
} = require("../controllers/messageController");

router.post("/:threadId/messages", auth, createMessage);
router.get("/:threadId/messages", auth, getMessages);

module.exports = router;
