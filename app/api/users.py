from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext

from app.database.database import get_db
from app.database.models import User
from app.database.report_models import BloodReport
from app.database.analysis_models import ReportAnalysis
from app.api.auth import get_current_user

router = APIRouter()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserUpdate(BaseModel):
    name: str
    email: EmailStr

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str

@router.get("/me")
def get_my_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }

@router.put("/me")
def update_profile(user_update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Check email collision
    existing = db.query(User).filter(User.email == user_update.email, User.id != current_user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already in use by another account.")
    
    current_user.name = user_update.name
    current_user.email = user_update.email
    db.commit()
    db.refresh(current_user)
    return {"message": "Profile updated successfully"}
