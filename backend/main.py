from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import fitz  # PyMuPDF
import os
import tempfile
from uuid import uuid4
from transformers import pipeline

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Store sessions and their document text
sessions = {}

# Load model once
qa_pipeline = pipeline("question-answering", model="distilbert-base-uncased-distilled-squad")


@app.post("/upload/")
async def upload(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        text = ""
        with fitz.open(tmp_path) as doc:
            for page in doc:
                text += page.get_text()

        os.remove(tmp_path)

        if not text.strip():
            return JSONResponse(status_code=400, content={"error": "No readable text found."})

        # Create session and store text
        session_id = str(uuid4())
        sessions[session_id] = text

        return {"message": "PDF processed successfully.", "session_id": session_id}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@app.post("/ask/")
async def ask(question: str = Form(...), session_id: str = Form(...)):
    if session_id not in sessions:
        return JSONResponse(status_code=403, content={"error": "Invalid session ID."})

    context = sessions[session_id][:4000]

    try:
        response = qa_pipeline({
            "question": question,
            "context": context
        })
        return {"answer": response["answer"]}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
