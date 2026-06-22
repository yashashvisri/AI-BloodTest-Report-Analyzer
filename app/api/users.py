from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User
from app.schemas.user import UserCreate

router = APIRouter()


@router.get("/")
def get_users():
    return {"message": "Users API Working"}


@router.post("/")
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    
    new_user = User(
        name=user.name,
        email=user.email
    )

    db.add(new_user)

    db.commit()

    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "id": new_user.id
    }