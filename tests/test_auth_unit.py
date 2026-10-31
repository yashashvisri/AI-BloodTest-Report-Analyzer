from app.api.auth import verify_password, get_password_hash, create_access_token
from jose import jwt
import os

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-here-for-development-change-in-production")
ALGORITHM = "HS256"

def test_password_hashing():
    pwd = "SecretPassword123"
    hashed = get_password_hash(pwd)
    assert hashed != pwd
    assert verify_password(pwd, hashed) is True
    assert verify_password("WrongPassword", hashed) is False

def test_access_token_creation():
    data = {"sub": "testuser", "role": "patient"}
    token = create_access_token(data)
    decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    assert decoded["sub"] == "testuser"
    assert decoded["role"] == "patient"
    assert "exp" in decoded
