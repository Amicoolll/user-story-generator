# backend/App/schemas.py
from pydantic import BaseModel, EmailStr, Field

# ----- Requests -----
class SignupRequest(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    organisation: str | None = None
    password: str = Field(min_length=6, max_length=128)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

# ----- Responses -----
class UserPublic(BaseModel):
    id: int
    name: str
    email: EmailStr
    organisation: str | None = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserPublic
