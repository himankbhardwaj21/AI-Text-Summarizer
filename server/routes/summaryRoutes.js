const express = require("express");
const router = express.Router();

const {
  summarizeText,
  summarizePDF
} = require("../controllers/summaryController");

const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post("/text", summarizeText);

router.post("/pdf", upload.single("file"), summarizePDF);

module.exports = router;