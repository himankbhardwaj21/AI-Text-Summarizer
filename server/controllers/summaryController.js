const axios = require("axios");
const fs = require("fs");
const pdfParse = require("pdf-parse");

require("dotenv").config();

const summarizeText = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Text is required"
      });
    }

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        inputs: text
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    res.json({
      summary: response.data[0].summary_text
    });

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "Error generating summary"
    });
  }
};

const summarizePDF = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "PDF file is required"
      });
    }

    const dataBuffer = fs.readFileSync(req.file.path);

    const pdfData = await pdfParse(dataBuffer);

    const text = pdfData.text;

    const response = await axios.post(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        inputs: text
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    fs.unlinkSync(req.file.path);

    res.json({
      summary: response.data[0].summary_text
    });

  } catch (error) {

    console.log(
      error.response?.data || error.message
    );

    res.status(500).json({
      message: "PDF summarization failed"
    });
  }
};

module.exports = {
  summarizeText,
  summarizePDF
};