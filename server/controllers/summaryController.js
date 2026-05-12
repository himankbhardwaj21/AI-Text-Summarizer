const axios = require("axios");
const fs = require("fs");
const pdfParse = require("pdf-parse");

require("dotenv").config();

const summarizeText = async (req, res) => {
  try {
    const { text } = req.body;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        inputs: text,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      summary: response.data[0].summary_text,
    });

  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: "Error generating summary",
    });
  }
};

const summarizePDF = async (req, res) => {
  try {
    const pdfBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(pdfBuffer);

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        inputs: pdfData.text,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    fs.unlinkSync(req.file.path);

    res.json({
      summary: response.data[0].summary_text,
    });

  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: "PDF summarization failed",
    });
  }
};

module.exports = {
  summarizeText,
  summarizePDF,
};