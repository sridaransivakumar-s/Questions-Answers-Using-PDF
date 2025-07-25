# Questions-Answers-Using-PDF
# PDF Q&A App (FastAPI + React)

A full-stack application that allows users to upload a PDF and ask questions based on its content using an open-source Hugging Face model (`distilbert-base-uncased-distilled-squad`).

---

## ✨ Features

- Upload any PDF file
- Extracts and stores the PDF text
- Ask questions about the uploaded PDF
- Answers generated using a Hugging Face question-answering model
- Clean and modern UI with a simple back navigation

---

## ⚙️ Tech Stack

### 🔹 Frontend
- React 
- Axios
- CSS 

### 🔹 Backend
- FastAPI
- PyMuPDF (`fitz`) for PDF text extraction
- Hugging Face Transformers pipeline

---

## 🛠️ Installation

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/sridaransivakumar-s/Questions-Answers-Using-PDF.git
cd Questions-Answers-Using-PDF
```

### 2️⃣ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

pip install -r requirements.txt

uvicorn main:app --reload
```

#### 📁 `requirements.txt`
```
fastapi
uvicorn
python-multipart
transformers
torch
pymupdf
python-multipart
```

### 3️⃣ Frontend Setup

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Usage

1. Start the FastAPI server on `http://localhost:8000`
2. Start the React dev server on `http://localhost:5173`
3. Upload a PDF from the frontend
4. Ask any question based on the content in the PDF
5. Get answers powered by an open-source transformer model!

---

## ⚠️ Difficulties Faced

- 📄 **PDF Text Extraction:** Not all PDFs are well-structured. Some scanned documents or poorly encoded files made text extraction unreliable using PyMuPDF.
- 🧠 **Model Limitations:** The base model (`distilbert-base-uncased-distilled-squad`) works well for short passages but cannot handle large or full PDF content in one go.
- 🧵 **Maintaining Context:** Since the model is stateless and sessionless, building a true conversational memory across multiple questions required extra design effort.
- ⚡ **Async Issues in React:** Handling UI updates with file uploads, loading indicators, and conditional rendering led to state management challenges.
- 🔐 **Session Handling:** Ensuring valid sessions with appropriate error handling took time to design and debug.

---

## 🌐 Author

**[Sridaran Sivakumar]**  
GitHub: (https://github.com/sridaransivakumar-s)
