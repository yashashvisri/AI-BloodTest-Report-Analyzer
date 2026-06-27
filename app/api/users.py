from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import User
from app.schemas.user import UserCreate

router = APIRouter()


# -----------------------------
# GET ALL USERS
# -----------------------------
@router.get("/")
def get_users(db: Session = Depends(get_db)):
    users = db.query(User).all()

    return {
        "total_users": len(users),
        "users": users
    }


# -----------------------------
# CREATE NEW USER
# -----------------------------
@router.post("/", status_code=status.HTTP_201_CREATED)
def create_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    # Check if email already exists
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered."
        )

    # Create new user
    new_user = User(
        name=user.name,
        email=user.email
    )

    # Save to database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User created successfully",
        "user": {
            "id": new_user.id,
            "name": new_user.name,
            "email": new_user.email
        }
    }