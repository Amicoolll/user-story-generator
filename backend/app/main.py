# main.py (FastAPI backend)
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import os
import docx2txt
import fitz  # PyMuPDF
import openai

# 🔐 Set your OpenAI API key here or use an environment variable
openai.api_key = "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"

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use specific domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Helper function to extract text from supported formats
def extract_text(file: UploadFile):
    if file.filename.endswith(".pdf"):
        content = file.file.read()
        with open("temp.pdf", "wb") as f:
            f.write(content)
        text = ""
        with fitz.open("temp.pdf") as doc:
            for page in doc:
                text += page.get_text()
        os.remove("temp.pdf")
        return text

    elif file.filename.endswith((".docx", ".doc")):
        content = file.file.read()
        with open("temp.docx", "wb") as f:
            f.write(content)
        text = docx2txt.process("temp.docx")
        os.remove("temp.docx")
        return text
    else:
        return "Unsupported file format"

# ✅ Route: Accept file and return user stories
@app.post("/generate-user-stories")
async def generate_user_stories(file: UploadFile = File(...)):
    raw_text = extract_text(file)

    # 🧠 Send to GPT-3.5 to generate user stories
    prompt = f"""
    Extract structured user stories from the following scope of work. Each story should be numbered.

    SCOPE OF WORK:
    {raw_text}

    Format:
    1. [Role] should be able to [feature]
    2. ...
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a business analyst assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=1500,
        )

        user_stories = response["choices"][0]["message"]["content"].strip()
        return {"user_stories": user_stories}

    except Exception as e:
        return {"error": str(e)}
