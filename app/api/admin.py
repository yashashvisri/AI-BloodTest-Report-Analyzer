from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional

from app.database.database import get_db
from app.database.models import User
from app.database.report_models import BloodReport
from app.database.analysis_models import ReportAnalysis
from app.api.auth import get_current_admin

router = APIRouter()


@router.get("/users")
def list_all_users(
    search: Optional[str] = None,
    role: Optional[str] = None,
    status_filter: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """List all users with search, role filter, status filter, and pagination."""
    query = db.query(User)

    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                User.username.ilike(term),
                User.email.ilike(term),
                User.name.ilike(term)
            )
        )

    if role and role != "all":
        query = query.filter(User.role == role)

    if status_filter and status_filter != "all":
        query = query.filter(User.is_active == status_filter)

    total = query.count()
    offset = (page - 1) * limit
    users = query.order_by(User.id.desc()).offset(offset).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "users": [
            {
                "id": u.id,
                "username": u.username,
                "email": u.email,
                "name": u.name,
                "role": u.role,
                "is_active": getattr(u, "is_active", "active"),
                "created_at": str(getattr(u, "created_at", "N/A")),
            }
            for u in users
        ]
    }


@router.get("/users/{user_id}")
def get_user_details(
    user_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Get detailed information about a specific user including report stats."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    report_count = db.query(BloodReport).filter(BloodReport.user_id == user_id).count()
    analysis_count = (
        db.query(ReportAnalysis)
        .join(BloodReport, ReportAnalysis.report_id == BloodReport.id)
        .filter(BloodReport.user_id == user_id)
        .count()
    )

    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "name": user.name,
        "role": user.role,
        "is_active": getattr(user, "is_active", "active"),
        "created_at": str(getattr(user, "created_at", "N/A")),
        "report_count": report_count,
        "analysis_count": analysis_count,
    }


from pydantic import BaseModel

class RoleUpdateRequest(BaseModel):
    role: str

@router.put("/users/{user_id}/role")
def update_user_role(
    user_id: int,
    request: RoleUpdateRequest,
    db: Session = Depends(get_db),
    admin: User = Depends(get_current_admin)
):
    """Update a user's role (patient, doctor, admin)."""
    if request.role not in ["patient", "doctor", "admin"]:
        raise HTTPException(status_code=400, detail="Invalid role. Must be patient, doctor, or admin.")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.id == admin.id:
        raise HTTPException(status_code=400, detail="Cannot change your own role")

    old_role = user.role
    user.role = request.role
    db.commit()
    db.refresh(user)

    return {"message": f"Role updated from {old_role} to {request.role}", "user_id": user_id}
