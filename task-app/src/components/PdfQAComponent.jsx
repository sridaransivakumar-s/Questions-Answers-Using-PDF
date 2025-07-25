import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./PdfQAComponent.css";
const PdfQAComponent = () => {
  const [pdfUploaded, setPdfUploaded] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [chat, setChat] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  useEffect(() => {
    if (pdfUploaded) {
      document.getElementById("questionInput")?.focus();
    }
  }, [pdfUploaded]);

  const uploadPdf = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file || file.type !== "application/pdf") {
      alert("Please select a valid PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const { data } = await axios.post(
        "http://localhost:8000/upload/",
        formData
      );
      setPdfUploaded(true);
      setSessionId(data.session_id);
      alert("PDF uploaded successfully!");
    } catch (error) {
      console.error("Upload Error:", error);
      alert("Failed to upload PDF.");
    }
  };

  const askQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = { sender: "You", text: question };
    setChat((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("question", question);
      formData.append("session_id", sessionId);

      const { data } = await axios.post("http://localhost:8000/ask/", formData);
      const Message = {
        sender: "Answer",
        text: data.answer || data.error || "No response.",
      };
      setChat((prev) => [...prev, Message]);

      if (data.error === "Invalid session ID.") {
        setPdfUploaded(false);
        setSessionId("");
        alert("Session expired. Please re-upload the PDF.");
      }
    } catch (error) {
      console.error("Question Error:", error);
      setChat((prev) => [
        ...prev,
        { sender: "BackEnd", text: "Error contacting the backend." },
      ]);
    } finally {
      setLoading(false);
      setQuestion("");
    }
  };
  const handleBack = () => {
    setPdfUploaded(false);
    setChat([]);
    setQuestion("");
  };
  return (
    <>
      <div className="page-wrapper">
        <div className="container">
          <h2>PDF Q&A App</h2>
          {!pdfUploaded && (
            <div className="upload-section">
              <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                style={{ marginBottom: "10px" }}
              />
              <button onClick={uploadPdf} className="back-button">
                Upload PDF
              </button>
            </div>
          )}
          {pdfUploaded && (
            <>
              <button onClick={handleBack} className="back-button">
                Back
              </button>
              <div className="chat-box">
                {chat.map((msg, index) => (
                  <div key={index} className="message">
                    <strong>{msg.sender}:</strong> {msg.text}
                  </div>
                ))}
              </div>

              <div className="input-section">
                <input
                  id="questionInput"
                  type="text"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a question about the PDF..."
                  className="input"
                />
                <button onClick={askQuestion} className="button">
                  Ask
                </button>
                {loading && <span className="loading">⏳</span>}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default PdfQAComponent;
