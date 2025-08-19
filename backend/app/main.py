# main.py (FastAPI backend)
# backend/App/main.py
from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import os
import tempfile
import docx2txt
import fitz  # PyMuPDF
import openai
from dotenv import load_dotenv

# --- NEW: auth + db imports ---
from .auth import router as auth_router, get_current_user
from .database import Base, engine, get_db
from .models import User  # for typing & future use

# ----------------------------
# Env & OpenAI setup
# ----------------------------
load_dotenv()  # loads backend/.env when you start from backend/
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY not set in .env file")

openai.api_key = OPENAI_API_KEY  # legacy OpenAI SDK style (ChatCompletion)

# ----------------------------
# FastAPI app & CORS
# ----------------------------
app = FastAPI(title="User Story Generator API")

app.add_middleware(
    CORSMiddleware,
    # TIP: lock this down to your frontend origin(s) in prod
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        # add your deployed frontend origin here
        "*",  # keep during dev only
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- NEW: create DB tables on startup ---
@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

# --- NEW: mount auth routes under /auth ---
app.include_router(auth_router)

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
    return f"""
You are a business analyst. Convert the scope into structured Markdown:

- Start each user story with a third-level heading: `### User Story N: <Short Title>`
- Then include this block:

#### Acceptance Criteria:
1. **<Heading>:** - <details...>
2. ...

#### Future Development:
- <item>

#### Notes:
- <item>

SCOPE OF WORK:
{scope_text}
""".strip()


# ----------------------------
# Routes
# ----------------------------
@app.get("/")
def health():
    return {"status": "ok"}

# --- CHANGED: protect this route with JWT ---
@app.post("/generate-user-stories")
async def generate_user_stories(
    file: UploadFile = File(...),
    # db available if you want to save ownership/usage later
    db = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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

        # Example: you can store metadata using current_user.id if needed
        # save_generation(db, owner_id=current_user.id, content=user_stories)

        return {"user_stories": user_stories, "user_id": current_user.id}
    except Exception as e:
        # Surface a clean error to the frontend
        raise HTTPException(status_code=500, detail=f"LLM generation failed: {e}")
