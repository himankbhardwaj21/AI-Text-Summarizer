const fs = require("fs");
const pdfParse = require("pdf-parse");

const summarizeText = async (req, res) => {
  try {

    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        error: "Text is required"
      });
    }

    const cleanedText = text.replace(/\n/g, " ");

    const sentences = cleanedText.split(/[.!?]/);

    const summary = sentences
      .slice(0, 2)
      .join(". ")
      .trim();

    res.json({
      summary: summary + "."
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "Error generating summary"
    });
  }
};

const summarizePDF = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        error: "PDF file is required"
      });
    }

    const pdfBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(pdfBuffer);

    const cleanedText = pdfData.text.replace(/\n/g, " ");

    const sentences = cleanedText.split(/[.!?]/);

    const summary = sentences
      .slice(0, 3)
      .join(". ")
      .trim();

    fs.unlinkSync(req.file.path);

    res.json({
      summary: summary + "."
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      error: "PDF summarization failed"
    });
  }
};

module.exports = {
  summarizeText,
  summarizePDF
};