# main.py (FastAPI backend)
# backend/app/main.py
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import tempfile
import docx2txt
import fitz  # PyMuPDF
import openai
from dotenv import load_dotenv

# ----------------------------
# Env & OpenAI setup
# ----------------------------
load_dotenv()  # loads backend/.env when you start from backend/
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not set in .env file")

openai.api_key = OPENAI_API_KEY  # legacy OpenAI SDK style (works with ChatCompletion)

# ----------------------------
# FastAPI app & CORS
# ----------------------------
app = FastAPI(title="User Story Generator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: lock to your frontend origin in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Utilities
# ----------------------------
ALLOWED_EXTENSIONS = {".pdf", ".docx"}  # recommend dropping .doc (unsupported)

def _ext(filename: str) -> str:
    return os.path.splitext(filename.lower())[1]

def extract_text(upload: UploadFile) -> str:
    """
    Extract plain text from PDF or DOCX. Uses in-memory for PDF,
    and a secure temp file for DOCX.
    """
    ext = _ext(upload.filename)
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file format '{ext}'. Please upload a PDF or DOCX.",
        )

    # Read all bytes once
    data = upload.file.read()
    if not data or len(data) < 5:
        raise HTTPException(status_code=400, detail="Empty or unreadable file.")

    if ext == ".pdf":
        text = ""
        # Open directly from memory; no temp file needed
        try:
            with fitz.open(stream=data, filetype="pdf") as doc:
                for page in doc:
                    text += page.get_text()
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read PDF: {e}")
        return text.strip()

    if ext == ".docx":
        try:
            with tempfile.NamedTemporaryFile(delete=False, suffix=".docx") as tmp:
                tmp.write(data)
                tmp_path = tmp.name
            text = docx2txt.process(tmp_path) or ""
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Failed to read DOCX: {e}")
        finally:
            try:
                if tmp_path and os.path.exists(tmp_path):
                    os.remove(tmp_path)
            except Exception:
                pass
        return text.strip()

    # Fallback (should not reach)
    raise HTTPException(status_code=400, detail="Unsupported file format.")

def build_prompt(scope_text: str) -> str:
    """
    Keep your current simple numbered-list format.
    (We can switch to the strict Easy‑Peasy template later, as discussed.)
    """
    return f"""
Extract clear, testable user stories from the following scope of work.
Return a numbered list only. Keep each story to one sentence.

SCOPE OF WORK:
{scope_text}

FORMAT EXAMPLE:
1. [Role] should be able to [capability] so that [benefit].
2. ...
""".strip()

# ----------------------------
# Routes
# ----------------------------
@app.get("/")
def health():
    return {"status": "ok"}

@app.post("/generate-user-stories")
async def generate_user_stories(file: UploadFile = File(...)):
    # 1) Validate & extract text
    text = extract_text(file)
    if len(text) < 20:
        raise HTTPException(status_code=400, detail="The document seems empty or too short to extract stories.")

    # 2) Build prompt
    prompt = build_prompt(text)

    # 3) Call OpenAI (legacy ChatCompletion API for compatibility)
    try:
        resp = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",  # adjust if you use a different model
            messages=[
                {"role": "system", "content": "You are a precise business analyst assistant."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3,
            max_tokens=1500,
        )
        user_stories = resp["choices"][0]["message"]["content"].strip()
        return {"user_stories": user_stories}
    except Exception as e:
        # Surface a clean error to the frontend
        raise HTTPException(status_code=500, detail=f"LLM generation failed: {e}")
