const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  createThread,
  getThreads,
  lockThread,
} = require("../controllers/threadController");

router.post("/", auth, createThread);
router.get("/", auth, getThreads);

module.exports = router;
