const axios = require("axios");
const fs = require("fs");
const pdfParse = require("pdf-parse");

const summarizeText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Text is required",
      });
    }

    // Simple manual summarization logic
    const summary = text.split(". ").slice(0, 2).join(". ") + ".";

    res.json({
      summary,
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "Error generating summary",
    });
  }
};

const summarizePDF = async (req, res) => {
  try {
    const pdfBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(pdfBuffer);

    const text = pdfData.text;

    const summary = text.split(". ").slice(0, 3).join(". ") + ".";

    fs.unlinkSync(req.file.path);

    res.json({
      summary,
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      error: "PDF summarization failed",
    });
  }
};

module.exports = {
  summarizeText,
  summarizePDF,
};