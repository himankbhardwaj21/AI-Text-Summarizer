import { useState } from "react";
import axios from "axios";

function App() {

  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const summarizeText = async () => {

    if(!text){
      alert("Please enter text");
      return;
    }

    try {

      setLoading(true);

      const response = await axios.post(
        "https://ai-text-summarizer-backend.onrender.com/api/summarize/text",
        { text }
      );

      setSummary(response.data.summary);

    } catch (error) {

      console.log(error);

      alert("Error generating summary");

    } finally {
      setLoading(false);
    }
  };

  const summarizePDF = async () => {

    if(!file){
      alert("Please select a PDF file");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {

      setLoading(true);

      const response = await axios.post(
        "https://ai-text-summarizer-backend.onrender.com/api/summarize/pdf",
        formData
      );

      setSummary(response.data.summary);

    } catch (error) {

      console.log(error);

      alert("PDF summarization failed");

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="container">

      <h1>AI Text Summarizer</h1>
      <p className="description">
  Upload PDF files or enter text to generate AI-powered summaries quickly and efficiently.
</p>

      <textarea
        rows="10"
        placeholder="Enter text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <br />

      <button onClick={summarizeText}>
        Summarize Text
      </button>

      <br />

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button onClick={summarizePDF}>
        Summarize PDF
      </button>

      {loading && <p>Generating summary...</p>}

      {summary && (
        <div className="summary-box">

          <h2>Summary</h2>

          <p>{summary}</p>

        </div>
      )}
<div className="footer">
  <p>Developed as a Mini Project using React, Node.js and HuggingFace AI</p>
</div>
    </div>
  );
}

export default App;